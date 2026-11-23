// 引导脚本：把企业业务库接入 Ontology 平台
// 流程：S1 注册只读数据源 -> S2 创建对象类型(内嵌映射) + 关系类型 + 函数 -> S3 实例下推
//
// 既可作为 CLI 运行（npm run bootstrap），也可被 apps/server 在启动时调用。
import { Pool } from 'pg';
import { PostgresMetadataRepository, rid as mkRid } from '@ontology/ontology-core';
import {
  PostgresMappingStore,
  MappingService,
} from '@ontology/data-integration';
import { objectTypes, linkTypes, functions, actions, alertRules } from './definitions';
import { EXT_OBJECT_TYPES } from './definitions-ext';
import { sourceConnection, objectTypeMappings } from './mappings';

const SRC_CONN_ID_EXT = 'src_enterprise_biz'; // 与 generate-ot.mjs / mappings.ts 中扩展域源连接一致
import { registerDimissionRisk } from './dimission-risk';
import { TypeScriptFunctionSandbox, RuleScheduler } from '@ontology/ontology-core';

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

  // 3) 共享属性（Shared properties）演示（须在 S1 映射注册之后，避免被覆盖）：
  //   - 把 Employee / Department 上的内嵌属性"提升"为共享属性（元数据集中）；
  //   - 再把同一个共享属性复用（引用）到其它原本没有该属性的对象类型，
  //     实现"一处定义、多处复用"。派生属性不参与共享。
  const sharedSeeds: Array<{
    fromType: string; prop: string;            // 提升来源：Employee.<prop>
    applyTo: string[];                          // 复用到的目标对象类型
  }> = [
    { fromType: 'Employee', prop: 'name',     applyTo: ['Alert'] },          // Alert 原本无 name
    { fromType: 'Employee', prop: 'status',   applyTo: ['Department', 'Alert'] }, // Department/Alert 无 status
    { fromType: 'Employee', prop: 'title',    applyTo: ['Department', 'Project'] }, // 二者均无 title
    { fromType: 'Department', prop: 'location', applyTo: ['Project'] },       // Project 无 location
    { fromType: 'Employee', prop: 'managerId', applyTo: ['Project'] },       // Project 无 managerId
  ];

  for (const s of sharedSeeds) {
    // 提升：若共享属性已存在也不影响，convert 方法幂等（已引用则跳过，未引用则挂引用）
    try {
      await repo.convertPropertyToShared(s.fromType, s.prop);
      console.log(`[Shared] 已提升共享属性: ${s.prop} (from ${s.fromType})`);
    } catch (e: any) {
      console.warn(`[Shared] 提升失败(跳过) ${s.prop}: ${e.message}`);
    }
    // 把共享属性复用（引用）到目标对象类型（已引用则跳过，避免重复）
    for (const target of s.applyTo) {
      const t = await repo.getObjectType(target);
      if (!t) continue;
      if (t.properties.some((p) => p.sharedRef === s.prop)) {
        console.log(`[Shared] ${target} 已引用 ${s.prop}（跳过）`);
        continue;
      }
      try {
        await repo.applySharedToObjectType(s.prop, target);
        console.log(`[Shared] 已应用共享属性 ${s.prop} -> ${target}`);
      } catch (e: any) {
        console.warn(`[Shared] 应用失败(跳过) ${s.prop}->${target}: ${e.message}`);
      }
    }
  }

  for (const lt of linkTypes) {
    await repo.createLinkType(lt);
    console.log(`[S2] 关系类型已创建: ${lt.apiName}`);
  }

  for (const fn of functions) {
    await repo.createFunction(fn);
    // 若 DB 中该函数已存在但 body 为空（旧库 seed 过的注入式函数），
    // 补写代码里的默认 body，使函数体可在前端在线编辑；FDE 已改过 body 的不覆盖。
    if (fn.body) {
      const existing = await repo.getFunction(fn.apiName);
      if (existing && !existing.body) {
        await repo.updateFunction(fn.apiName, { body: fn.body });
      }
    }
    console.log(`[S2] 函数已创建: ${fn.apiName}`);
  }

  for (const a of actions) {
    await repo.createAction(a);
    // 若 DB 中该 action 已存在（ON CONFLICT DO NOTHING 不覆盖），补同步代码侧 preconditions，
    // 避免「代码定义」与「DB 存储」漂移（Action 内嵌校验规则的代码优先同步）。
    const existing = await repo.getAction(a.apiName);
    if (existing) {
      const same =
        JSON.stringify(existing.preconditions ?? []) === JSON.stringify(a.preconditions ?? []);
      if (!same) {
        await repo.updateAction(a.apiName, { preconditions: a.preconditions ?? [] });
        console.log(`[S2] 动作已同步 preconditions: ${a.apiName}`);
      }
    }
    console.log(`[S2] 动作已创建: ${a.apiName}`);
  }

  for (const r of alertRules) {
    await repo.createRule(r);
    console.log(`[S2] 自动化规则已创建: ${r.apiName} (${r.enabled ? '启用' : '禁用'})`);
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
    `SELECT id, emp_code, name, gender, email, phone, title,
            department_id, manager_id, hire_date, work_hours, status
       FROM employee ORDER BY id`,
  );
  await srcPool.end();

  // 建立 源id -> emp_code 映射，供 manager 关系对齐（Employee RID 统一用 emp_code）
  const idToCode: Record<number, string> = {};
  for (const r of rows) idToCode[r.id] = r.emp_code;

  for (const r of rows) {
    const rid = mkRid('Employee', r.emp_code);
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
      await repo.createLinkInstance('EmployeeDepartment', rid, mkRid('Department', r.department_id));
    }
    if (r.manager_id != null && idToCode[r.manager_id]) {
      await repo.createLinkInstance('EmployeeManager', rid, mkRid('Employee', idToCode[r.manager_id]));
    }
  }
  console.log(`[S3] 已写入 ${rows.length} 条人员实例与 EmployeeDepartment 关系实例`);
}

// S3：把 enterprise_biz.leave_record 全量镜像为本体可写侧 LeaveRecord 实例，
// 并写入 EmployeeLeave 关系实例（Employee.emp_code -> LeaveRecord），
// 供 Employee 派生属性「年请假天数」(sumLinks) 实时聚合。
export async function seedLeaveRecordInstances(repo: PostgresMetadataRepository): Promise<void> {
  await repo.clearLinkInstances('EmployeeLeave');
  await repo.clearObjectWrites('LeaveRecord');

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });
  // 仅取 emp_code 即可对齐 Employee RID（Employee RID 统一为 emp_code）
  const { rows } = await srcPool.query(
    `SELECT id, emp_code, leave_type, start_date, duration_days, reason
       FROM leave_record ORDER BY id`,
  );
  await srcPool.end();

  for (const r of rows) {
    const rid = mkRid('LeaveRecord', `lr_${r.id}`);
    await repo.writeObjectPatch(
      'LeaveRecord',
      rid,
      {
        id: r.id,
        empCode: r.emp_code,
        leaveType: r.leave_type,
        startDate: r.start_date ? String(r.start_date) : null,
        durationDays: r.duration_days != null ? Number(r.duration_days) : null,
        reason: r.reason,
      },
      'bootstrap:seed',
    );
    if (r.emp_code) {
      // EmployeeLeave: source=Employee(emp_code) -> target=LeaveRecord(lr_<id>)
      await repo.createLinkInstance('EmployeeLeave', mkRid('Employee', r.emp_code), rid);
    }
  }
  console.log(`[S3] 已写入 ${rows.length} 条请假记录实例与 EmployeeLeave 关系实例`);
}

// S3：把 enterprise_biz.department 全量镜像为本体可写侧 Department 实例，
// 并写入 DepartmentHierarchy 自引用关系（parent_id），
// 使 EmployeeDepartment 的 target 能与 Department 实例对齐（RID 统一用部门 id）。
export async function seedDepartmentInstances(repo: PostgresMetadataRepository): Promise<void> {
  await repo.clearLinkInstances('DepartmentHierarchy');
  await repo.clearObjectWrites('Department');

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });
  const { rows } = await srcPool.query(
    `SELECT id, code, name, parent_id, manager_id, location FROM department ORDER BY id`,
  );
  await srcPool.end();

  for (const r of rows) {
    const rid = mkRid('Department', r.id);
    await repo.writeObjectPatch(
      'Department',
      rid,
      {
        id: r.id,
        code: r.code,
        name: r.name,
        parentId: r.parent_id != null ? Number(r.parent_id) : null,
        managerId: r.manager_id != null ? Number(r.manager_id) : null,
        location: r.location,
      },
      'bootstrap:seed',
    );
    if (r.parent_id != null) {
      await repo.createLinkInstance('DepartmentHierarchy', rid, mkRid('Department', r.parent_id));
    }
  }
  console.log(`[S3] 已写入 ${rows.length} 条部门实例与 DepartmentHierarchy 关系实例`);
}

// S3：把 enterprise_biz 的 product / project / device 全量镜像为本体可写侧实例，
// 并写入其相关关系实例（RID 统一用源表 id）：
//   - Product        -> ProductOwnerDept (owner_dept_id -> Department)
//   - Device         -> DeviceProduct    (product_id -> Product)
//                      + device_department 多对多 -> Department (DeviceDepartment)
//   - Project        -> ProjectDepartment (dept_id -> Department)
//                      + project_member   多对多 -> Employee (ProjectMember)
//                      + project_product  多对多 -> Product  (ProjectProduct)
export async function seedBusinessObjectInstances(repo: PostgresMetadataRepository): Promise<void> {
  const linkTypes = [
    'ProductOwnerDept',
    'DeviceProduct',
    'DeviceDepartment',
    'ProjectDepartment',
    'ProjectMember',
    'ProjectProduct',
  ];
  for (const lt of linkTypes) {
    await repo.clearLinkInstances(lt);
  }
  await repo.clearObjectWrites('Product');
  await repo.clearObjectWrites('Project');
  await repo.clearObjectWrites('Device');

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });

  // ---- Product ----
  {
    const { rows } = await srcPool.query(
      `SELECT id, sku, name, category, owner_dept_id, status, launch_date FROM product ORDER BY id`,
    );
    for (const r of rows) {
      const rid = mkRid('Product', r.id);
      await repo.writeObjectPatch(
        'Product',
        rid,
        {
          id: r.id,
          sku: r.sku,
          name: r.name,
          category: r.category,
          ownerDeptId: r.owner_dept_id != null ? Number(r.owner_dept_id) : null,
          status: r.status,
          launchDate: r.launch_date ? String(r.launch_date) : null,
        },
        'bootstrap:seed',
      );
      if (r.owner_dept_id != null) {
        await repo.createLinkInstance('ProductOwnerDept', rid, mkRid('Department', r.owner_dept_id));
      }
    }
    console.log(`[S3] 已写入 ${rows.length} 条产品实例`);
  }

  // ---- Device ----
  {
    const { rows } = await srcPool.query(
      `SELECT id, asset_code, name, type, model, product_id, status, purchase_date FROM device ORDER BY id`,
    );
    for (const r of rows) {
      const rid = mkRid('Device', r.id);
      await repo.writeObjectPatch(
        'Device',
        rid,
        {
          id: r.id,
          assetCode: r.asset_code,
          name: r.name,
          type: r.type,
          model: r.model,
          productId: r.product_id != null ? Number(r.product_id) : null,
          status: r.status,
          purchaseDate: r.purchase_date ? String(r.purchase_date) : null,
        },
        'bootstrap:seed',
      );
      if (r.product_id != null) {
        await repo.createLinkInstance('DeviceProduct', rid, mkRid('Product', r.product_id));
      }
    }
    // 设备 <-> 部门 多对多
    const { rows: dd } = await srcPool.query(
      `SELECT device_id, department_id FROM device_department`,
    );
    for (const r of dd) {
      await repo.createLinkInstance('DeviceDepartment', mkRid('Device', r.device_id), mkRid('Department', r.department_id));
    }
    console.log(`[S3] 已写入 ${rows.length} 条设备实例与 ${dd.length} 条设备-部门关系`);
  }

  // ---- Project ----
  {
    const { rows } = await srcPool.query(
      `SELECT id, code, name, dept_id, lead_emp_id, start_date, end_date, budget, status FROM project ORDER BY id`,
    );
    for (const r of rows) {
      const rid = mkRid('Project', r.id);
      await repo.writeObjectPatch(
        'Project',
        rid,
        {
          id: r.id,
          code: r.code,
          name: r.name,
          deptId: r.dept_id != null ? Number(r.dept_id) : null,
          leadEmpId: r.lead_emp_id != null ? Number(r.lead_emp_id) : null,
          startDate: r.start_date ? String(r.start_date) : null,
          endDate: r.end_date ? String(r.end_date) : null,
          budget: r.budget != null ? Number(r.budget) : null,
          status: r.status,
        },
        'bootstrap:seed',
      );
      if (r.dept_id != null) {
        await repo.createLinkInstance('ProjectDepartment', rid, mkRid('Department', r.dept_id));
      }
    }
    // 项目成员 多对多（Employee 端统一用 emp_code 作为 RID）
    const { rows: empRows } = await srcPool.query(`SELECT id, emp_code FROM employee`);
    const empIdToCode: Record<number, string> = {};
    for (const e of empRows) empIdToCode[e.id] = e.emp_code;
    const { rows: pm } = await srcPool.query(
      `SELECT project_id, employee_id FROM project_member`,
    );
    for (const r of pm) {
      const empRid = empIdToCode[r.employee_id];
      if (empRid) await repo.createLinkInstance('ProjectMember', mkRid('Project', r.project_id), mkRid('Employee', empRid));
    }
    // 项目交付产品 多对多
    const { rows: pp } = await srcPool.query(
      `SELECT project_id, product_id FROM project_product`,
    );
    for (const r of pp) {
      await repo.createLinkInstance('ProjectProduct', mkRid('Project', r.project_id), mkRid('Product', r.product_id));
    }
    console.log(`[S3] 已写入 ${rows.length} 条项目实例与 ${pm.length} 条成员 / ${pp.length} 条交付产品关系`);
  }

  await srcPool.end();
}

// S3：父子明细下推 —— 依据对象类型上的 childTableMappings，把明细表行按父键(parentKey)
// 聚合为数组/计数属性，合并写入主对象实例（纵向多表关联，对齐 Palantir MDO 父子明细场景）。
// 明细表与主表同连接（复用主对象的 sourceConnectionId）；父 RID 约定为 String(parentKey 值)
// （id 主键型父对象：Device/Department/Product/Project 均满足，Employee 用 emp_code 需另加映射）。
// 幂等：writeObjectPatch 为 patch || EXCLUDED.patch 合并，可重复执行。
export async function seedChildDetailInstances(repo: PostgresMetadataRepository): Promise<void> {
  const ots = await repo.listObjectTypes();
  const withChildren = ots.filter((o) => o.childTableMappings?.length);

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });

  let affectedObjects = 0;
  let affectedMappings = 0;
  for (const ot of withChildren) {
    const table = ot.sourceTable;
    if (!table) continue;
    const validProps = new Set(ot.properties.map((p) => p.apiName));
    for (const child of ot.childTableMappings!) {
      const aggs = child.aggregations.filter((a) => validProps.has(a.property));
      if (!aggs.length) continue;
      affectedMappings++;

      const { rows } = await srcPool.query(`SELECT * FROM "${child.table}"`);
      // 按父键分组
      const groups = new Map<string, unknown[]>();
      for (const r of rows) {
        const key = r[child.parentKey];
        if (key == null) continue;
        const k = String(key);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(r);
      }

      for (const [parentRid, childRows] of groups) {
        const patch: Record<string, unknown> = {};
        for (const a of aggs) {
          if (a.agg === 'count') {
            patch[a.property] = childRows.length;
          } else if (a.agg === 'collect') {
            let values = childRows
              .map((r) => r[a.childColumn])
              .filter((v) => v != null);
            if (a.asSet) {
              values = [...new Set(values.map((v) => String(v)))];
            }
            if (a.limit != null && values.length > a.limit) {
              values = values.slice(0, a.limit);
            }
            patch[a.property] = values;
          }
        }
        await repo.writeObjectPatch(ot.apiName, mkRid(ot.apiName, parentRid), patch, 'bootstrap:seed-child');
        affectedObjects++;
      }
    }
  }

  await srcPool.end();
  console.log(
    `[S3] 父子明细下推完成：${affectedMappings} 个明细映射、${affectedObjects} 个主对象被聚合`,
  );
}

// S3：把 220 张扩展域表（hr/erp/crm/wms/am/pm/pd/ar/fin/sec）全量镜像为本体可写侧实例，
// 并写入对应的外键关系实例（RID 统一为 ext_<sourceTable>_<id>）。
// 完全数据驱动：依据对象类型 properties[].sourceMapping.column 把源行映射到属性；
// 依据扩展 linkType(sourceProperty/targetObjectType) 写外键关系实例。
// 幂等：每次先清空再全量写入（与现有 seed 函数一致）。
const EXT_PREFIXES = ['hr_', 'erp_', 'crm_', 'wms_', 'am_', 'pm_', 'pd_', 'ar_', 'fin_', 'sec_'];

// 清理历史残留的扩展对象类型/链接类型：源连接为扩展域、但其 source_table 已不在当前定义中的
// 元数据（例如早期生成器漂移产生的多余类型）。删除前先清掉对应实例与关系实例，避免孤儿数据。
export async function cleanupStaleExtensionMetadata(repo: PostgresMetadataRepository): Promise<void> {
  const validTables = new Set(EXT_OBJECT_TYPES.map((o) => o.sourceTable).filter(Boolean) as string[]);
  const { rows } = await repo.pool.query<{ api_name: string; source_table: string | null }>(
    `SELECT api_name, source_table FROM object_type WHERE source_connection_id=$1`,
    [SRC_CONN_ID_EXT],
  );
  // 只清理「扩展前缀表」的残留：source_table 以扩展前缀开头，且不在当前扩展定义中。
  // 核心对象类型（Department/Employee/Product 等，source_table 无扩展前缀）一律保留，避免误删。
  const stale = rows.filter(
    (r) => r.source_table && EXT_PREFIXES.some((p) => r.source_table!.startsWith(p)) && !validTables.has(r.source_table),
  );
  if (!stale.length) return;
  console.log(`[S3] 清理 ${stale.length} 个残留扩展对象类型`);
  for (const r of stale) {
    try {
      await repo.clearObjectWrites(r.api_name);
    } catch {
      /* ignore */
    }
    try {
      const lts = await repo.pool.query<{ api_name: string }>(
        `SELECT api_name FROM link_type WHERE source_type=$1 OR target_type=$1`,
        [r.api_name],
      );
      for (const lt of lts.rows) await repo.clearLinkInstances(lt.api_name);
    } catch {
      /* ignore */
    }
    await repo.deleteObjectType(r.api_name);
  }
}

export async function seedExtensionInstances(repo: PostgresMetadataRepository): Promise<void> {
  await cleanupStaleExtensionMetadata(repo);
  const extOts = objectTypes.filter(
    (o) => o.sourceTable && EXT_PREFIXES.some((p) => o.sourceTable!.startsWith(p)),
  );
  const extOtNames = new Set(extOts.map((o) => o.apiName));
  const extLts = linkTypes.filter((lt) => extOtNames.has(lt.sourceType));

  for (const lt of extLts) {
    try {
      await repo.clearLinkInstances(lt.apiName);
    } catch {
      /* 表/关系不存在则忽略 */
    }
  }
  for (const ot of extOts) {
    try {
      await repo.clearObjectWrites(ot.apiName);
    } catch {
      /* 对象类型尚未注册则忽略 */
    }
  }
  console.log(`[S3] 扩展域对象类型 ${extOts.length} 个，关系类型 ${extLts.length} 个，开始下推实例`);

  const srcPool = new Pool({
    connectionString:
      process.env.ENTERPRISE_BIZ_URL ||
      'postgresql://ontology:ontology@localhost:5432/enterprise_biz',
  });

  // Employee RID = emp_code（与 seedEmployeeInstances 对齐），其余核心对象 RID = 源表 id
  const empIdToCode: Record<number, string> = {};
  {
    const { rows } = await srcPool.query('SELECT id, emp_code FROM employee');
    for (const r of rows) empIdToCode[r.id] = r.emp_code;
  }

  let total = 0;
  let totalLinks = 0;
  for (const ot of extOts) {
    const table = ot.sourceTable!;
    const propCols = ot.properties
      .filter((p) => p.sourceMapping?.column)
      .map((p) => ({ apiName: p.apiName, column: p.sourceMapping!.column, dataType: p.dataType }));
    const { rows } = await srcPool.query(`SELECT * FROM "${table}" ORDER BY id`);

    for (const r of rows) {
      const rid = mkRid(ot.apiName, `ext_${table}_${r.id}`);
      const patch: Record<string, unknown> = {};
      for (const pc of propCols) {
        let v = r[pc.column];
        if (v != null) {
          if (pc.dataType === 'NUMBER' || pc.dataType === 'INTEGER') v = Number(v);
          else if (pc.dataType === 'BOOLEAN') v = !!v;
          else if (pc.dataType === 'DATE' || pc.dataType === 'TIMESTAMP') v = String(v);
        } else {
          v = null;
        }
        patch[pc.apiName] = v;
      }
      await repo.writeObjectPatch(ot.apiName, rid, patch, 'bootstrap:seed');
    }
    total += rows.length;

    // 外键关系实例
    const ltsForOt = extLts.filter((lt) => lt.sourceType === ot.apiName);
    for (const lt of ltsForOt) {
      const fkCol = lt.primaryKey; // 源表外键列，如 dept_id
      for (const r of rows) {
        const fkVal = r[fkCol];
        if (fkVal == null) continue;
        const targetRid =
          lt.targetType === 'Employee' ? mkRid('Employee', empIdToCode[fkVal]) : mkRid(lt.targetType, fkVal);
        if (!targetRid) continue;
        await repo.createLinkInstance(lt.apiName, mkRid(ot.apiName, `ext_${table}_${r.id}`), targetRid);
        totalLinks++;
      }
    }
  }

  await srcPool.end();
  console.log(`[S3] 扩展域已写入 ${total} 条对象实例与 ${totalLinks} 条关系实例`);
}

// 注册业务函数到沙箱（供运行时 invoke）
export function buildSandbox(repo: PostgresMetadataRepository): TypeScriptFunctionSandbox {
  const sandbox = new TypeScriptFunctionSandbox();
  sandbox.setContext({
    repo,
    objects: (t) => repo.listObjectProperties(t),
    links: (t) => repo.listLinkInstances(t),
  });
  registerDimissionRisk(sandbox, repo);
  // 注册存库可编辑的函数体（有 body 的函数用源码编译，覆盖 seed 注入的同名实现）
  for (const fn of functions) {
    if (fn.body && fn.language === 'typescript') {
      try {
        sandbox.registerFromSource(fn.apiName, fn.body);
      } catch (e: any) {
        console.error(`[buildSandbox] 函数 ${fn.apiName} 源码编译失败:`, e.message);
      }
    }
  }
  return sandbox;
}

// 运行时从元数据库加载所有存库可编辑函数体并注册到共享沙箱（供前端创建/修改后即时生效）
export async function registerDbFunctions(repo: PostgresMetadataRepository, sandbox: TypeScriptFunctionSandbox): Promise<void> {
  const fns = await repo.listFunctions();
  for (const fn of fns) {
    if (fn.body && fn.language === 'typescript') {
      try {
        sandbox.registerFromSource(fn.apiName, fn.body);
      } catch (e: any) {
        console.error(`[registerDbFunctions] 函数 ${fn.apiName} 源码编译失败:`, e.message);
      }
    }
  }
}

// 启动后台规则调度器（按通用 rule 表的 trigger 执行可配置 Function 与 Action）
// 触发器支持 schedule（周期轮询）与 event（对象写入事件）。规则语义是通用的「满足条件→执行动作」。
export function startScheduler(repo: PostgresMetadataRepository, tickMs = 10_000): RuleScheduler {
  const sandbox = buildSandbox(repo);
  const scheduler = new RuleScheduler(repo, sandbox, { tickMs });
  scheduler.start();
  return scheduler;
}

// CLI 入口
async function main() {
  const pool = new Pool({ connectionString: META_URL });
  const repo =   await seedEnterpriseBiz(pool);
  await seedDepartmentInstances(repo);
  await seedEmployeeInstances(repo);
  await seedLeaveRecordInstances(repo);
  await seedBusinessObjectInstances(repo);
  await seedExtensionInstances(repo);
  await seedChildDetailInstances(repo);
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
