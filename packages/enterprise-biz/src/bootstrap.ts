// 引导脚本：把企业业务库接入 Ontology 平台
// 流程：S1 注册只读数据源 -> S2 创建对象类型(内嵌映射) + 关系类型 + 函数 -> S3 实例下推
//
// 既可作为 CLI 运行（npm run bootstrap），也可被 apps/server 在启动时调用。
import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import {
  PostgresMappingStore,
  MappingService,
} from '@ontology/data-integration';
import { objectTypes, linkTypes, functions, actions, alertRules } from './definitions';
import { sourceConnection, objectTypeMappings } from './mappings';
import { registerDimissionRisk } from './dimission-risk';
import { TypeScriptFunctionSandbox, AlertScheduler } from '@ontology/ontology-core';

const META_URL = process.env.META_DATABASE_URL ||
  'postgresql://ontology:ontology@localhost:5432/ontology';

// S1+S2：注册只读数据源、对象类型（内嵌映射）、关系类型、函数。
// 幂等：已存在则跳过/覆盖，可重复执行。
export async function seedEnterpriseBiz(pool: Pool): Promise<PostgresMetadataRepository> {
  const repo = new PostgresMetadataRepository(pool);
  const store = new PostgresMappingStore(pool);
  const svc = new MappingService(store, repo);

  try {
    await svc.registerSourceConnection(sourceConnection);
    console.log(`[S1] 数据源已注册(只读): ${sourceConnection.id}`);
  } catch (e: any) {
    if (/already exists|duplicate/i.test(e.message)) {
      console.log(`[S1] 数据源已存在(只读): ${sourceConnection.id}`);
    } else {
      throw e;
    }
  }

  const byApi = new Map(objectTypes.map((o) => [o.apiName, o]));
  // 1) 先创建全部对象类型（含无外部数据源映射、由平台内部生成的类型，如 Alert）
  for (const ot of objectTypes) {
    await repo.createObjectType(ot);
    console.log(`  - 对象类型已创建: ${ot.apiName}`);
  }
  // 2) 再为带映射的对象类型注册 S1 数据源字段映射
  for (const m of objectTypeMappings) {
    const full = byApi.get(m.objectType.apiName);
    if (!full) {
      console.warn(`  ! 未找到对象类型定义: ${m.objectType.apiName}`);
      continue;
    }
    const { qualityStatus } = await svc.createObjectTypeWithMapping({ ...m, objectType: full });
    console.log(`  - ${m.objectType.apiName} <- ${m.sourceTable} (${qualityStatus})`);
  }

  for (const lt of linkTypes) {
    await repo.createLinkType(lt);
    console.log(`[S2] 关系类型已创建: ${lt.apiName}`);
  }

  for (const fn of functions) {
    await repo.createFunction(fn);
    console.log(`[S2] 函数已创建: ${fn.apiName}`);
  }

  for (const a of actions) {
    await repo.createAction(a);
    console.log(`[S2] 动作已创建: ${a.apiName}`);
  }

  for (const r of alertRules) {
    await repo.createAlertRule(r);
    console.log(`[S2] 告警规则已创建: ${r.apiName} (${r.enabled ? '启用' : '禁用'})`);
  }

  return repo;
}

// S3：把 enterprise_biz.employee 全量镜像为本体可写侧实例，
// 并写入 EmployeeDepartment 关系实例，供离职预警函数读取与触发。
// 直接从只读源 enterprise_biz 读取，保证与业务库数据一致（含全部员工属性）。
export async function seedEmployeeInstances(repo: PostgresMetadataRepository): Promise<void> {
  await repo.clearLinkInstances('EmployeeDepartment');
  await repo.clearObjectWrites('Employee');

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });
  const { rows } = await srcPool.query(
    `SELECT emp_code, name, gender, email, phone, title,
            department_id, manager_id, hire_date, work_hours, status
       FROM employee ORDER BY id`,
  );
  await srcPool.end();

  for (const r of rows) {
    const rid = r.emp_code;
    await repo.writeObjectPatch(
      'Employee',
      rid,
      {
        empCode: r.emp_code,
        name: r.name,
        gender: r.gender,
        email: r.email,
        phone: r.phone,
        title: r.title,
        departmentId: r.department_id,
        managerId: r.manager_id,
        hireDate: r.hire_date ? String(r.hire_date) : null,
        workHours: r.work_hours != null ? Number(r.work_hours) : null,
        status: r.status,
        dimissionRisk: false,
      },
      'bootstrap:seed',
    );
    if (r.department_id != null) {
      await repo.createLinkInstance('EmployeeDepartment', rid, String(r.department_id));
    }
  }
  console.log(`[S3] 已写入 ${rows.length} 条人员实例与 EmployeeDepartment 关系实例`);
}

// 注册业务函数到沙箱（供运行时 invoke）
export function buildSandbox(repo: PostgresMetadataRepository): TypeScriptFunctionSandbox {
  const sandbox = new TypeScriptFunctionSandbox();
  registerDimissionRisk(sandbox, repo);
  return sandbox;
}

// 启动后台告警调度器（按 alert_rule 周期执行可配置 Function 与 Action）
export function startScheduler(repo: PostgresMetadataRepository, tickMs = 10_000): AlertScheduler {
  const sandbox = buildSandbox(repo);
  const scheduler = new AlertScheduler(repo, sandbox, { tickMs });
  scheduler.start();
  return scheduler;
}

// CLI 入口
async function main() {
  const pool = new Pool({ connectionString: META_URL });
  const repo = await seedEnterpriseBiz(pool);
  await seedEmployeeInstances(repo);
  buildSandbox(repo);
  const ots = await repo.listObjectTypes();
  const lts = await repo.listLinkTypes();
  const fn = await repo.getFunction('evaluateDimissionRisk');
  console.log(`\n汇总: 对象类型 ${ots.length} | 关系类型 ${lts.length} | 函数 ${fn ? 1 : 0}`);
  await pool.end();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('引导失败:', e);
    process.exit(1);
  });
}
