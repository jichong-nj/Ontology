// 由企业业务库(enterprise_biz)实际 schema 派生 S2 建模产物：
//   1) 对象类型定义（definitions-ext.ts）：每个扩展表 => 1 个对象类型，携带 sourceTable / sourceConnectionId
//   2) 对象类型映射（mappings-ext.ts）：字段级 sourceMapping（属性 <-> 源表列）
//   3) 链接类型（link types）：扩展表外键(dept_id/employee_id/product_id) => 连接核心对象类型
//
// 直接从数据库读取真实表名与列结构（schema_ext.sql 可能与线上库漂移），保证 source_table / 列名
// 与数据库完全一致。运行： node sql/generate-ot.mjs
// 依赖：本地 enterprise_biz（postgresql://ontology:ontology@localhost:5432/enterprise_biz）

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src');

const SRC_CONN_ID = 'src_enterprise_biz';
const PREFIXES = ['hr', 'erp', 'crm', 'wms', 'am', 'pm', 'pd', 'ar', 'fin', 'sec'];

function pascal(name) {
  return name.split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function dataTypeToPropType(udt) {
  const t = String(udt).toUpperCase();
  if (t.startsWith('NUMERIC') || t.startsWith('DECIMAL')) return 'NUMBER';
  if (t === 'INT' || t === 'INTEGER' || t === 'INT2' || t === 'INT4' || t === 'INT8' || t === 'BIGINT' || t.startsWith('SERIAL') || t === 'OID') return 'INTEGER';
  if (t === 'BOOL' || t === 'BOOLEAN') return 'BOOLEAN';
  if (t === 'DATE') return 'DATE';
  if (t.startsWith('TIMESTAMP') || t.startsWith('TIME')) return 'TIMESTAMP';
  if (t === 'JSON' || t === 'JSONB') return 'TEXT';
  return 'TEXT';
}

// 外键列名 -> 核心对象类型（实际库中外键列形如 dept_id/employee_id/product_id，目标表 department/employee/product）
const FK_COL_TO_OT = {
  dept_id: 'Department',
  employee_id: 'Employee',
  product_id: 'Product',
};

async function main() {
  const pool = new pg.Pool({
    connectionString: process.env.ENTERPRISE_BIZ_URL || 'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });

  // 1) 扩展表清单
  const { rows: tables } = await pool.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' AND table_name ~ $1
     ORDER BY table_name`,
    [`^(${PREFIXES.join('|')})_`],
  );

  // 2) 列 + 主键 + 外键目标
  const objectTypes = [];
  const linkTypes = [];
  const mappings = [];
  const linkTypeSet = new Set();

  for (const { table_name: tableName } of tables) {
    const { rows: cols } = await pool.query(
      `SELECT c.column_name, c.udt_name, c.data_type,
              (SELECT 1 FROM information_schema.table_constraints tc
                       JOIN information_schema.key_column_usage k ON tc.constraint_name=k.constraint_name
               WHERE tc.table_name=$1 AND tc.constraint_type='PRIMARY KEY' AND k.column_name=c.column_name LIMIT 1) AS is_pk,
              (SELECT ccu.table_name FROM information_schema.constraint_column_usage ccu
                       JOIN information_schema.key_column_usage kcu ON ccu.constraint_name=kcu.constraint_name
               WHERE kcu.table_name=$1 AND kcu.column_name=c.column_name
                 AND ccu.table_name IN ('department','employee','product') LIMIT 1) AS fk_target
       FROM information_schema.columns c
       WHERE c.table_name=$1 ORDER BY c.ordinal_position`,
      [tableName],
    );
    if (!cols.length) continue;

    const apiName = pascal(tableName);

    const properties = [];
    const fieldMappings = [];
    for (const col of cols) {
      if (col.fk_target) continue; // 外键列 -> 链接类型
      const propType = dataTypeToPropType(col.udt_name || col.data_type);
      const isPk = !!col.is_pk;
      properties.push({
        apiName: col.column_name,
        displayName: col.column_name,
        dataType: propType,
        required: isPk || ['code', 'name', 'status'].includes(col.column_name),
        primaryKey: isPk,
        identity: isPk,
        description: '',
        sourceMapping: { type: 'column', column: col.column_name, connection: SRC_CONN_ID },
      });
      fieldMappings.push({ property: col.column_name, sourceColumn: col.column_name });
    }

    const commentRes = await pool.query(
      `SELECT obj_description(($1)::regclass, 'pg_class') AS cmt`,
      [tableName],
    );
    const cnName = commentRes.rows[0]?.cmt || tableName;

    objectTypes.push({
      apiName,
      displayName: cnName,
      description: `扩展域：${cnName}（源表 ${tableName}）`,
      icon: '📄',
      sourceConnectionId: SRC_CONN_ID,
      sourceTable: tableName,
      properties,
    });
    mappings.push({ objectType: apiName, sourceConnectionId: SRC_CONN_ID, sourceTable: tableName, fieldMappings });

    // 外键链接类型
    const fkCol = cols.find((c) => c.fk_target);
    if (fkCol) {
      const target = FK_COL_TO_OT[fkCol.column_name] || pascal(fkCol.fk_target);
      const linkApi = `${apiName}_${pascal(fkCol.column_name.replace(/_id$/, ''))}`;
      if (!linkTypeSet.has(linkApi)) {
        linkTypeSet.add(linkApi);
        linkTypes.push({
          apiName: linkApi,
          displayName: `${cnName}→${target}`,
          description: `${apiName} 关联 ${target}`,
          sourceType: apiName,
          targetType: target,
          sourceCardinality: 'many',
          targetCardinality: 'one',
          cardinality: 'many-to-many',
          primaryKey: fkCol.column_name,
          foreignKey: 'id',
          instanceSource: 'source',
          version: 1,
          properties: [],
        });
      }
    }
  }

  await pool.end();

  const defsContent = `// 自动生成（sql/generate-ot.mjs）—— 扩展域对象类型 / 链接类型定义。
// 由 enterprise_biz 实际 schema 解析生成，source_table / 列名与数据库真实表一致。请勿手工编辑，改动请改生成器后重跑。
import type { ObjectType, LinkType } from '@ontology/ontology-core';

export const EXT_OBJECT_TYPES: ObjectType[] = ${JSON.stringify(objectTypes, null, 2)};

export const EXT_LINK_TYPES: LinkType[] = ${JSON.stringify(linkTypes, null, 2)};
`;

  const mapContent = `// 自动生成（sql/generate-ot.mjs）—— 扩展域对象类型字段映射。
// 形状与 mappings.ts 中 objectTypeMappings 一致（CreateObjectTypeWithMappingInput）。
import type { CreateObjectTypeWithMappingInput } from '@ontology/data-integration';

export const EXT_OBJECT_TYPE_MAPPINGS: CreateObjectTypeWithMappingInput[] = ${JSON.stringify(mappings, null, 2)};
`;

  writeFileSync(join(OUT_DIR, 'definitions-ext.ts'), defsContent);
  writeFileSync(join(OUT_DIR, 'mappings-ext.ts'), mapContent);

  console.log(`生成完成：对象类型 ${objectTypes.length} 个，链接类型 ${linkTypes.length} 个，映射 ${mappings.length} 个`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
