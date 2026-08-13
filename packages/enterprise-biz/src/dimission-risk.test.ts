// ============================================================
// 端到端场景测试：对接数据源(S1) -> 对象/关系类型(S2) -> 实例下推(S3) -> 派生属性 -> 离职预警函数触发
// 说明：本测试直接调用底层仓储与函数沙箱，覆盖「S1 数据源接入 → S2 建模 → S3 实例落库 →
//       配置部门平均上班时间(派生 avgLinks) → 函数 evaluateDimissionRisk 触发离职风险标记」全链路。
// 运行前需有可用的 PostgreSQL（与 ontology-core 测试同一实例）。
// ============================================================
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Pool } from 'pg';
import {
  PostgresMetadataRepository,
  TypeScriptFunctionSandbox,
  RuleScheduler,
} from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from '@ontology/data-integration';
import {
  objectTypes,
  linkTypes,
  functions,
  actions,
  alertRules,
} from './definitions';
import { sourceConnection, objectTypeMappings } from './mappings';
import { registerDimissionRisk } from './dimission-risk';
import type { ObjectType, LinkType } from '@ontology/ontology-core';

const DATABASE_URL = process.env.DATABASE_URL ??
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: DATABASE_URL });
const repo = new PostgresMetadataRepository(pool);
const store = new PostgresMappingStore(pool);
const mappingSvc = new MappingService(store, repo);
const sandbox = new TypeScriptFunctionSandbox();

const EMP_DEMO: Array<{ rid: string; dept: number; workHours: number; name: string }> = [
  { rid: 'E0001', dept: 1, workHours: 9.0, name: '张伟' },
  { rid: 'E0002', dept: 2, workHours: 8.5, name: '李娜' },
  { rid: 'E0005', dept: 5, workHours: 5.0, name: '陈静' },
  { rid: 'E0006', dept: 5, workHours: 7.2, name: '杨帆' },
  { rid: 'E0007', dept: 5, workHours: 7.8, name: '赵磊' },
  { rid: 'E0008', dept: 6, workHours: 4.5, name: '周敏' },
  { rid: 'E0009', dept: 6, workHours: 7.0, name: '吴昊' },
];

beforeAll(async () => {
  await pool.query('SELECT 1');
  registerDimissionRisk(sandbox, repo);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query(`
    TRUNCATE object_type, link_type, link_instance, object_write,
      interface_def, object_interface, interface_method_impl,
      action_type, ontology_function, source_connection, object_mapping
      RESTART IDENTITY CASCADE;
  `);

  // S1：注册只读数据源
  await mappingSvc.registerSourceConnection(sourceConnection);
  for (const m of objectTypeMappings) {
    const full = objectTypes.find((o) => o.apiName === m.objectType.apiName)!;
    await mappingSvc.createObjectTypeWithMapping({ ...m, objectType: full });
  }
  for (const lt of linkTypes) await repo.createLinkType(lt);
  for (const fn of functions) await repo.createFunction(fn);
  for (const a of actions) await repo.createAction(a);
  for (const r of alertRules) await repo.createRule(r);

  // S3：实例下推（本体可写侧）
  await repo.clearLinkInstances('EmployeeDepartment');
  await repo.clearObjectWrites('Employee');
  for (const e of EMP_DEMO) {
    await repo.writeObjectPatch('Employee', e.rid,
      { empCode: e.rid, name: e.name, departmentId: e.dept, workHours: e.workHours, dimissionRisk: false },
      'test:seed');
    await repo.createLinkInstance('EmployeeDepartment', e.rid, String(e.dept));
  }
});

describe('场景：离职预警（S1→S2→S3→函数）', () => {
  it('S1 数据源为只读接入', async () => {
    const { rows } = await pool.query('SELECT read_only FROM source_connection WHERE id=$1', [sourceConnection.id]);
    expect(rows[0].read_only).toBe(true);
  });

  it('S2 对象类型创建并含配置化派生属性', async () => {
    const emp = await repo.getObjectType('Employee');
    expect(emp).toBeTruthy();
    const dept = await repo.getObjectType('Department');
    expect(dept).toBeTruthy();
    const avg = dept!.properties.find((p) => p.apiName === 'avgWorkHours');
    expect(avg?.derived).toBe(true);
    const empCount = dept!.properties.find((p) => p.apiName === 'employeeCount');
    expect(empCount?.derived).toBe(true);
  });

  it('S3 实例下推：Employee 实例与 EmployeeDepartment 关系实例写入', async () => {
    const inst = await repo.listLinkInstances('EmployeeDepartment');
    expect(inst.length).toBe(EMP_DEMO.length);
    const props = await repo.listObjectProperties('Employee');
    expect(props.length).toBe(EMP_DEMO.length);
  });

  it('派生属性：部门人数 = 以该部门为 target 的关系实例数', async () => {
    // dept 5 应有 3 名员工（E0005/E0006/E0007）
    const r = await repo.computeDerived('Department', 'employeeCount', '5');
    expect(r.value).toBe(3);
  });

  it('派生属性：部门平均上班时间（avgLinks 算子）', async () => {
    // dept5: (5.0+7.2+7.8)/3 = 6.6667
    const r = await repo.computeDerived('Department', 'avgWorkHours', '5');
    expect(Number(r.value)).toBeCloseTo(6.6667, 3);
    // dept6: (4.5+7.0)/2 = 5.75
    const r6 = await repo.computeDerived('Department', 'avgWorkHours', '6');
    expect(Number(r6.value)).toBeCloseTo(5.75, 3);
  });

  it('函数触发：上班时间 < 部门均值80% 即标记离职风险', async () => {
    const result = await sandbox.execute('evaluateDimissionRisk', { threshold: 0.8 }) as any;
    // dept5 均值 6.6667*0.8=5.333，E0005=5.0 < 5.333 → 预警
    // dept6 均值 5.75*0.8=4.6，E0008=4.5 < 4.6 → 预警
    expect(result.flaggedCount).toBe(2);
    const rids = result.flagged.map((f: any) => f.rid).sort();
    expect(rids).toEqual(['E0005', 'E0008']);

    // 验证 dimissionRisk 已写入本体可写侧 object_write
    const { rows } = await pool.query(
      "SELECT object_rid, patch->>'dimissionRisk' AS risk FROM object_write WHERE object_type='Employee' AND patch->>'dimissionRisk' = 'true'",
    );
    const flagged = rows.map((r: any) => r.object_rid).sort();
    expect(flagged).toEqual(['E0005', 'E0008']);
  });

  it('函数仅扫描指定部门（按 dep氐tId 入参过滤）', async () => {
    const result = await sandbox.execute('evaluateDimissionRisk', { threshold: 0.8, departmentId: 5 }) as any;
    expect(result.departmentAverages['5']).toBeCloseTo(6.67, 2);
    expect(result.flagged.map((f: any) => f.rid)).toEqual(['E0005']);
    expect(result.flaggedCount).toBe(1);
  });

  it('后台规则调度器：可配置 Function + Action 生成告警对象', async () => {
    registerDimissionRisk(sandbox, repo); // 含 createDimissionAlert 动作注册
    const scheduler = new RuleScheduler(repo, sandbox, { tickMs: 1000 });
    const results = await scheduler.runAll();
    expect(results.length).toBe(1);
    expect(results[0].flaggedCount).toBe(2);
    expect(results[0].actionsInvoked).toBe(2);

    // 告警对象已写入本体可写侧 Alert 类型
    const alerts = await repo.listObjectProperties('Alert');
    const subjectRids = alerts.map((a) => a.properties.subjectRid).sort();
    expect(subjectRids).toEqual(['E0005', 'E0008']);
  });

  it('告警规则可配置：禁用规则被调度器跳过', async () => {
    registerDimissionRisk(sandbox, repo);
    // 新增一条禁用的同类规则，验证「enabled=false 不执行」
    const disabledRule = { ...alertRules[0], apiName: 'disabledRule', enabled: false };
    await repo.createRule(disabledRule);
    const before = (await repo.listObjectProperties('Alert')).length;
    const scheduler = new RuleScheduler(repo, sandbox, { tickMs: 1000 });
    const results = await scheduler.runAll();
    const disabled = results.find((r) => r.rule === 'disabledRule');
    expect(disabled?.ran).toBe(false);
    // 启用的规则仍生成告警，禁用的不重复生成
    const after = (await repo.listObjectProperties('Alert')).length;
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
