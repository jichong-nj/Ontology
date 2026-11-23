// 生成并灌入 enterprise_biz 扩展业务库（表清单驱动，每表 ≥200 行模拟数据）
// 运行：node packages/enterprise-biz/sql/generate-ext.mjs
//
// ⚠️ 本脚本已于 2026-11-23 清空扩展域表清单（DOMAINS 置空），准备逐表重建。
//    原始 220 张表的完整清单备份在：
//      - 文件备份：packages/enterprise-biz/sql-backup-20261123/generate-ext.mjs
//      - git 备份：git show backup/seed-scripts-20261123:packages/enterprise-biz/sql/generate-ext.mjs
//
// 前置条件（重建顺序）：
//    1) psql "$ENTERPRISE_BIZ_URL" -f packages/enterprise-biz/sql/schema.sql   # 核心 9 表
//    2) psql "$ENTERPRISE_BIZ_URL" -f packages/enterprise-biz/sql/seed.sql     # 核心样例数据
//    3) （可选）python3 packages/enterprise-biz/sql/gen_people.py               # 扩到 10 部门/100 人
//    4) node packages/enterprise-biz/sql/generate-ext.mjs                       # 本脚本（扩展域）
//    5) node packages/enterprise-biz/sql/generate-ot.mjs                        # 由源库 schema 重新生成 S2 建模产物
//
// 加表方法：往 DOMAINS 对应域的 tables 数组里加一行：
//    ['表名后缀', '中文注释', ['字段名','类型',枚举数组或null], ...]
//    实际表名 = `${域前缀}_${后缀}`；每表自动附加 id/code/name/<外键>/status/created_at/updated_at 基础列。
//    原清单里的表可以直接从备份文件整行复制回来。
import { Pool } from 'pg';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DDL_PATH = join(__dirname, 'schema_ext.sql');

const conn = process.env.ENTERPRISE_BIZ_URL ||
  'postgresql://ontology:ontology@localhost:5432/enterprise_biz';
const pool = new Pool({ connectionString: conn });

const ROWS = 210; // 每张表数据行数（≥200）

// ---------- 伪随机（可重复） ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 每个域的表清单： [表名后缀, 中文注释, 额外字段(名称/类型/示例值生成)]
// —— 已于 2026-11-23 清空，逐表重建中。原始清单见 sql-backup-20261123/generate-ext.mjs ——
// 可用域前缀（外键规则见 main()）：hr/pm/am/fin→department，sec→employee，pd/wms→product，其余→department
const DOMAINS = {
  // hr: { cn: '人事', tables: [
  //   ['employee_contract','员工合同',['contract_type','TEXT','["固定期限","无固定期限","实习"]'],['start_date','DATE',null],['end_date','DATE',null],['salary','NUMERIC(12,2)',null]],
  // ]},
};

const FK_BASE = {
  department: { table: 'department', col: 'id', fetch: 'SELECT id FROM department ORDER BY id' },
  employee: { table: 'employee', col: 'id', fetch: 'SELECT id FROM employee ORDER BY id' },
  product: { table: 'product', col: 'id', fetch: 'SELECT id FROM product ORDER BY id' },
};

function quote(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  return `'${String(v).replace(/'/g, "''")}'`;
}

// 为某列生成模拟值（确定性随机）
function genValue(rng, colType, colName, idx, fkVals) {
  if (colType === 'INT') return 1 + Math.floor(rng() * 9999);
  if (colType === 'BIGINT') return 1 + Math.floor(rng() * 999999);
  if (colType.startsWith('NUMERIC')) {
    const m = colType.match(/NUMERIC\((\d+),(\d+)\)/);
    const precision = m ? Number(m[1]) : 12;
    const scale = m ? Number(m[2]) : 2;
    const maxInt = Math.pow(10, precision - scale) - 1; // 整数部分上限
    const v = rng() * maxInt;
    return Number(v.toFixed(scale));
  }
  if (colType === 'DATE') {
    const y = 2020 + Math.floor(rng() * 6);
    const mo = 1 + Math.floor(rng() * 12);
    const d = 1 + Math.floor(rng() * 28);
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  if (colType === 'TIME') {
    const h = Math.floor(rng() * 24);
    const m = Math.floor(rng() * 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`;
  }
  if (colType === 'TIMESTAMP') {
    const d = genValue(rng, 'DATE', colName + '_d', idx, null);
    const h = String(Math.floor(rng() * 24)).padStart(2, '0');
    const m = String(Math.floor(rng() * 60)).padStart(2, '0');
    const s = String(Math.floor(rng() * 60)).padStart(2, '0');
    return `${d} ${h}:${m}:${s}`; // 裸字符串，由外层 quote() 加引号
  }
  if (colType === 'BOOLEAN') return rng() > 0.5;
  // TEXT：枚举或序列
  return `${colName}_${idx}`;
}

async function main() {
  const tableCount = Object.values(DOMAINS).reduce((n, d) => n + d.tables.length, 0);
  if (tableCount === 0) {
    console.log('DOMAINS 为空：没有需要重建的扩展表。请往 DOMAINS 里加表后再运行。');
    console.log('原始 220 表清单参考：packages/enterprise-biz/sql-backup-20261123/generate-ext.mjs');
    await pool.end();
    return;
  }

  // 预取基础外键值（扩展表外键引用核心表，核心表必须先建好）
  const fkCache = {};
  for (const k of Object.keys(FK_BASE)) {
    try {
      const r = await pool.query(FK_BASE[k].fetch);
      fkCache[k] = r.rows.map((x) => x[FK_BASE[k].col]);
    } catch {
      throw new Error(`核心表 ${FK_BASE[k].table} 不存在或不可读：请先执行 schema.sql + seed.sql 重建核心 9 表，再运行本脚本。`);
    }
  }
  const depIds = fkCache.department.length ? fkCache.department : [1];
  const empIds = fkCache.employee.length ? fkCache.employee : [1];
  const prodIds = fkCache.product.length ? fkCache.product : [1];

  let created = 0;
  const ddlLines = [
    '-- 企业业务库扩展 DDL（由 generate-ext.mjs 自动生成，仅建表，不含数据）',
    '-- 覆盖域：人事/ERP/CRM/WMS/资产管理/项目管理/产品管理/档案管理/财务/网络安全',
    '-- 数据请用 generate-ext.mjs 灌入（每张 210 行）。',
    '',
  ];
  for (const [domain, def] of Object.entries(DOMAINS)) {
    for (const t of def.tables) {
      const [suffix, cn, ...fields] = t;
      const tableName = `${domain}_${suffix}`;
      try {
      // 额外字段定义： [name,type,enumOrNull]
      const extraCols = [];
      const enumMap = {};
      for (const f of fields) {
        const [name, type, enums] = f;
        extraCols.push({ name, type });
        if (Array.isArray(enums)) enumMap[name] = enums;
      }

      // 选一个外键关联（优先 department，其次 employee，部分用 product）
      let fkCol = null;
      if (domain === 'hr') fkCol = { name: 'dept_id', ref: 'department' };
      else if (domain === 'sec') fkCol = { name: 'owner_emp_id', ref: 'employee' };
      else if (domain === 'pm') fkCol = { name: 'dept_id', ref: 'department' };
      else if (domain === 'am') fkCol = { name: 'dept_id', ref: 'department' };
      else if (domain === 'pd' || domain === 'wms') fkCol = { name: 'product_id', ref: 'product' };
      else if (domain === 'fin') fkCol = { name: 'dept_id', ref: 'department' };
      else fkCol = { name: 'dept_id', ref: 'department' };

      // 建表（幂等）
      const hasStatus = extraCols.some((c) => c.name === 'status');
      const hasName = extraCols.some((c) => c.name === 'name');
      const hasCode = extraCols.some((c) => c.name === 'code');
      const colDefs = [
        'id BIGSERIAL PRIMARY KEY',
        ...(hasCode ? [] : ['"code" TEXT UNIQUE NOT NULL']),
        ...(hasName ? [] : ['"name" TEXT NOT NULL']),
        ...extraCols.map((c) => `"${c.name}" ${c.type}`),
        `"${fkCol.name}" BIGINT REFERENCES ${fkCol.ref}(id)`,
        ...(hasStatus ? [] : ['status TEXT NOT NULL DEFAULT \'active\'']),
        'created_at TIMESTAMPTZ NOT NULL DEFAULT now()',
        'updated_at TIMESTAMPTZ NOT NULL DEFAULT now()',
      ];
      await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
      await pool.query(`CREATE TABLE ${tableName} (${colDefs.join(',\n')})`);
      await pool.query(`COMMENT ON TABLE ${tableName} IS '${def.cn}-${cn}'`);
      ddlLines.push(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
      ddlLines.push(`CREATE TABLE ${tableName} (\n  ${colDefs.join(',\n  ')}\n);`);
      ddlLines.push(`COMMENT ON TABLE ${tableName} IS '${def.cn}-${cn}';`);
      ddlLines.push('');

      // 插入数据（基础列若已在额外字段中则不重复）
      const allCols = [...(hasCode ? [] : ['code']), ...(hasName ? [] : ['name']), ...extraCols.map((c) => c.name), fkCol.name, ...(hasStatus ? [] : ['status'])];
      const fkVals = fkCol.ref === 'department' ? depIds : fkCol.ref === 'employee' ? empIds : prodIds;
      const insertSql = `INSERT INTO ${tableName} (${allCols.map((c) => `"${c}"`).join(',')}) VALUES `;
      const rowsParts = [];
      for (let i = 1; i <= ROWS; i++) {
        const rng = mulberry32(i * 2654435761 + tableName.length * 40503);
        const vals = [];
        for (const c of allCols) {
          if (c === 'code') vals.push(`${domain}_${suffix}_${String(i).padStart(4, '0')}`);
          else if (c === 'name') vals.push(`${def.cn}${cn}#${i}`);
          else if (c === fkCol.name) vals.push(fkVals[Math.floor(rng() * fkVals.length)]);
          else if (c === 'status' && !hasStatus) vals.push('active');
          else {
            const meta = extraCols.find((x) => x.name === c);
            if (c === 'name') vals.push(`${def.cn}${cn}#${i}`);
            else if (c === 'code') vals.push(`${domain}_${suffix}_${String(i).padStart(4, '0')}`);
            else if (enumMap[c]) vals.push(enumMap[c][Math.floor(rng() * enumMap[c].length)]);
            else vals.push(genValue(rng, meta.type, c, i, null));
          }
        }
        rowsParts.push(`(${vals.map(quote).join(',')})`);
      }
      await pool.query(insertSql + rowsParts.join(','));
      created++;
      console.log(`  已建表+灌数据: ${tableName} (${ROWS} 行)`);
      } catch (e) {
        console.error(`  失败表 ${tableName}: ${e.message}`);
        throw e;
      }
    }
  }
  // 汇总
  const r = await pool.query(`SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='public'`);
  writeFileSync(DDL_PATH, ddlLines.join('\n'));
  console.log(`\n完成：共 ${created} 张扩展表，库内总表数 ${r.rows[0].n}`);
  console.log(`建表 DDL 已写出: ${DDL_PATH}`);
  await pool.end();
}

main().catch(async (e) => {
  console.error('生成失败:', e);
  await pool.end();
  process.exit(1);
});
