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
    `SELECT id, emp_code, name, gender, email, phone, title,
            department_id, manager_id, hire_date, work_hours, status
       FROM employee ORDER BY id`,
  );
  await srcPool.end();

  // 建立 源id -> emp_code 映射，供 manager 关系对齐（Employee RID 统一用 emp_code）
  const idToCode: Record<number, string> = {};
  for (const r of rows) idToCode[r.id] = r.emp_code;

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
    if (r.manager_id != null && idToCode[r.manager_id]) {
      await repo.createLinkInstance('EmployeeManager', rid, idToCode[r.manager_id]);
    }
  }
  console.log(`[S3] 已写入 ${rows.length} 条人员实例与 EmployeeDepartment 关系实例`);
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
    const rid = String(r.id);
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
      await repo.createLinkInstance('DepartmentHierarchy', rid, String(r.parent_id));
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
      const rid = String(r.id);
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
        await repo.createLinkInstance('ProductOwnerDept', rid, String(r.owner_dept_id));
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
      const rid = String(r.id);
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
        await repo.createLinkInstance('DeviceProduct', rid, String(r.product_id));
      }
    }
    // 设备 <-> 部门 多对多
    const { rows: dd } = await srcPool.query(
      `SELECT device_id, department_id FROM device_department`,
    );
    for (const r of dd) {
      await repo.createLinkInstance('DeviceDepartment', String(r.device_id), String(r.department_id));
    }
    console.log(`[S3] 已写入 ${rows.length} 条设备实例与 ${dd.length} 条设备-部门关系`);
  }

  // ---- Project ----
  {
    const { rows } = await srcPool.query(
      `SELECT id, code, name, dept_id, lead_emp_id, start_date, end_date, budget, status FROM project ORDER BY id`,
    );
    for (const r of rows) {
      const rid = String(r.id);
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
        await repo.createLinkInstance('ProjectDepartment', rid, String(r.dept_id));
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
      if (empRid) await repo.createLinkInstance('ProjectMember', String(r.project_id), empRid);
    }
    // 项目交付产品 多对多
    const { rows: pp } = await srcPool.query(
      `SELECT project_id, product_id FROM project_product`,
    );
    for (const r of pp) {
      await repo.createLinkInstance('ProjectProduct', String(r.project_id), String(r.product_id));
    }
    console.log(`[S3] 已写入 ${rows.length} 条项目实例与 ${pm.length} 条成员 / ${pp.length} 条交付产品关系`);
  }

  await srcPool.end();
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
  const repo =   await seedEnterpriseBiz(pool);
  await seedDepartmentInstances(repo);
  await seedEmployeeInstances(repo);
  await seedBusinessObjectInstances(repo);
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
