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

// 演示用人员实例数据（与 packages/enterprise-biz/sql/seed.sql 的 employee 一致）
// rid 约定：员工用 emp_code，部门用 id（与源表一致，便于核对）。
const EMPLOYEE_DEMO: Array<{ rid: string; name: string; dept: number; workHours: number; title: string }> = [
  { rid: 'E0001', name: '张伟', dept: 1, workHours: 9.0, title: 'CEO' },
  { rid: 'E0002', name: '李娜', dept: 2, workHours: 8.5, title: '研发总监' },
  { rid: 'E0003', name: '王强', dept: 3, workHours: 7.5, title: '制造总监' },
  { rid: 'E0004', name: '刘洋', dept: 4, workHours: 8.8, title: '市场总监' },
  { rid: 'E0005', name: '陈静', dept: 5, workHours: 5.0, title: '软件组长' },
  { rid: 'E0006', name: '杨帆', dept: 5, workHours: 7.2, title: '软件工程师' },
  { rid: 'E0007', name: '赵磊', dept: 5, workHours: 7.8, title: '软件工程师' },
  { rid: 'E0008', name: '周敏', dept: 6, workHours: 4.5, title: '硬件组长' },
  { rid: 'E0009', name: '吴昊', dept: 6, workHours: 7.0, title: '硬件工程师' },
  { rid: 'E0010', name: '孙丽', dept: 3, workHours: 8.2, title: '生产主管' },
  { rid: 'E0011', name: '马涛', dept: 3, workHours: 8.6, title: '产线工人' },
  { rid: 'E0012', name: '朱琳', dept: 4, workHours: 8.0, title: '市场经理' },
];

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

// S3：把 enterprise_biz.employee 的 work_hours/department_id 镜像为本体可写侧实例，
// 并写入 EmployeeDepartment 关系实例，供离职预警函数读取与触发。
export async function seedEmployeeInstances(repo: PostgresMetadataRepository): Promise<void> {
  await repo.clearLinkInstances('EmployeeDepartment');
  await repo.clearObjectWrites('Employee');

  for (const e of EMPLOYEE_DEMO) {
    await repo.writeObjectPatch(
      'Employee',
      e.rid,
      { empCode: e.rid, name: e.name, title: e.title, departmentId: e.dept, workHours: e.workHours, dimissionRisk: false },
      'bootstrap:seed',
    );
    await repo.createLinkInstance('EmployeeDepartment', e.rid, String(e.dept));
  }
  console.log(`[S3] 已写入 ${EMPLOYEE_DEMO.length} 条人员实例与 EmployeeDepartment 关系实例`);
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
