// 企业业务库 -> S2 Ontology 对象/关系类型定义
// 属性 apiName 与 enterprise_biz 源表字段一一对应（见 packages/enterprise-biz/sql/schema.sql）。
import type { ObjectType, LinkType, OntologyFunction, ActionType, AlertRule } from '@ontology/ontology-core';

const V = 1;

export const objectTypes: ObjectType[] = [
  {
    apiName: 'Department',
    displayName: '部门',
    description: '企业组织结构中的部门，含上下级层级',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'integer', required: true, sourceMapping: 'id' },
      { apiName: 'code', displayName: '部门编码', type: 'string', required: true, sourceMapping: 'code' },
      { apiName: 'name', displayName: '部门名称', type: 'string', required: true, sourceMapping: 'name' },
      { apiName: 'parentId', displayName: '上级部门', type: 'integer', required: false, sourceMapping: 'parent_id' },
      { apiName: 'managerId', displayName: '负责人', type: 'integer', required: false, sourceMapping: 'manager_id' },
      { apiName: 'location', displayName: '办公地点', type: 'string', required: false, sourceMapping: 'location' },
      // 部门人数（派生）：统计 EmployeeDepartment 关系中 target=本部门的实例数
      {
        apiName: 'employeeCount',
        displayName: '部门人数',
        type: 'integer',
        required: false,
        derived: true,
        reducer: JSON.stringify({ op: 'countLinks', linkType: 'EmployeeDepartment', side: 'target' }),
      },
      // 部门平均上班时间（派生）：聚合本部门人员 workHours 的均值
      {
        apiName: 'avgWorkHours',
        displayName: '部门平均上班时长(小时)',
        type: 'float',
        required: false,
        derived: true,
        reducer: JSON.stringify({ op: 'avgLinks', linkType: 'EmployeeDepartment', side: 'target', prop: 'workHours' }),
      },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
  {
    apiName: 'Employee',
    displayName: '人员',
    description: '企业人员基本信息',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'integer', required: true, sourceMapping: 'id' },
      { apiName: 'empCode', displayName: '工号', type: 'string', required: true, sourceMapping: 'emp_code' },
      { apiName: 'name', displayName: '姓名', type: 'string', required: true, sourceMapping: 'name' },
      { apiName: 'gender', displayName: '性别', type: 'string', required: false, sourceMapping: 'gender' },
      { apiName: 'email', displayName: '邮箱', type: 'string', required: false, sourceMapping: 'email' },
      { apiName: 'phone', displayName: '电话', type: 'string', required: false, sourceMapping: 'phone' },
      { apiName: 'title', displayName: '职位', type: 'string', required: false, sourceMapping: 'title' },
      { apiName: 'departmentId', displayName: '隶属部门', type: 'integer', required: true, sourceMapping: 'department_id' },
      { apiName: 'managerId', displayName: '直属上级', type: 'integer', required: false, sourceMapping: 'manager_id' },
      { apiName: 'hireDate', displayName: '入职日期', type: 'date', required: false, sourceMapping: 'hire_date' },
      { apiName: 'status', displayName: '状态', type: 'string', required: true, sourceMapping: 'status' },
      { apiName: 'workHours', displayName: '日均上班时长(小时)', type: 'float', required: false, sourceMapping: 'work_hours' },
      // 离职风险预警：可写属性，由 evaluateDimissionRisk 函数计算后修改（非派生）
      { apiName: 'dimissionRisk', displayName: '离职风险预警', type: 'boolean', required: false, derived: false },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
  {
    apiName: 'Alert',
    displayName: '告警',
    description: '后台告警规则命中后生成的对象（写入本体可写侧，不回写数据源）',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'string', required: true },
      { apiName: 'ruleApiName', displayName: '规则', type: 'string', required: true },
      { apiName: 'subjectType', displayName: '主体类型', type: 'string', required: true },
      { apiName: 'subjectRid', displayName: '主体实例', type: 'string', required: true },
      { apiName: 'subjectName', displayName: '主体名称', type: 'string', required: false },
      { apiName: 'level', displayName: '级别', type: 'string', required: true },
      { apiName: 'message', displayName: '说明', type: 'string', required: false },
      { apiName: 'createdAt', displayName: '生成时间', type: 'string', required: true },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
  {
    apiName: 'Product',
    displayName: '产品',
    description: '企业产品信息',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'integer', required: true, sourceMapping: 'id' },
      { apiName: 'sku', displayName: '产品编码', type: 'string', required: true, sourceMapping: 'sku' },
      { apiName: 'name', displayName: '产品名称', type: 'string', required: true, sourceMapping: 'name' },
      { apiName: 'category', displayName: '类别', type: 'string', required: false, sourceMapping: 'category' },
      { apiName: 'ownerDeptId', displayName: '负责部门', type: 'integer', required: false, sourceMapping: 'owner_dept_id' },
      { apiName: 'status', displayName: '状态', type: 'string', required: true, sourceMapping: 'status' },
      { apiName: 'launchDate', displayName: '上市日期', type: 'date', required: false, sourceMapping: 'launch_date' },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
  {
    apiName: 'Device',
    displayName: '设备',
    description: '企业设备资产信息',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'integer', required: true, sourceMapping: 'id' },
      { apiName: 'assetCode', displayName: '资产编码', type: 'string', required: true, sourceMapping: 'asset_code' },
      { apiName: 'name', displayName: '设备名称', type: 'string', required: true, sourceMapping: 'name' },
      { apiName: 'type', displayName: '设备类型', type: 'string', required: false, sourceMapping: 'type' },
      { apiName: 'model', displayName: '型号', type: 'string', required: false, sourceMapping: 'model' },
      { apiName: 'productId', displayName: '关联产品', type: 'integer', required: false, sourceMapping: 'product_id' },
      { apiName: 'status', displayName: '状态', type: 'string', required: true, sourceMapping: 'status' },
      { apiName: 'purchaseDate', displayName: '采购日期', type: 'date', required: false, sourceMapping: 'purchase_date' },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
  {
    apiName: 'Project',
    displayName: '项目',
    description: '企业项目信息',
    properties: [
      { apiName: 'id', displayName: 'ID', type: 'integer', required: true, sourceMapping: 'id' },
      { apiName: 'code', displayName: '项目编码', type: 'string', required: true, sourceMapping: 'code' },
      { apiName: 'name', displayName: '项目名称', type: 'string', required: true, sourceMapping: 'name' },
      { apiName: 'deptId', displayName: '牵头部门', type: 'integer', required: true, sourceMapping: 'dept_id' },
      { apiName: 'leadEmpId', displayName: '项目负责人', type: 'integer', required: false, sourceMapping: 'lead_emp_id' },
      { apiName: 'startDate', displayName: '开始日期', type: 'date', required: false, sourceMapping: 'start_date' },
      { apiName: 'endDate', displayName: '结束日期', type: 'date', required: false, sourceMapping: 'end_date' },
      { apiName: 'budget', displayName: '预算', type: 'float', required: false, sourceMapping: 'budget' },
      { apiName: 'status', displayName: '状态', type: 'string', required: true, sourceMapping: 'status' },
    ],
    implementsInterfaces: [],
    version: V,
    createdAt: '',
    updatedAt: '',
  },
];

// 关系类型：多数是源端数据中台已存在的关系实例（instanceSource='source'），
// 由 S1 link 映射下推查询；本平台也可在 link_instance 表内维护补充关联（managed）。
export const linkTypes: LinkType[] = [
  {
    apiName: 'DepartmentHierarchy',
    displayName: '部门上下级',
    sourceType: 'Department',
    targetType: 'Department',
    cardinality: 'one-to-many',
    instanceSource: 'source',   // 来自 department.parent_id
    version: V,
  },
  {
    apiName: 'EmployeeDepartment',
    displayName: '人员隶属部门',
    sourceType: 'Employee',
    targetType: 'Department',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 employee.department_id
    version: V,
  },
  {
    apiName: 'EmployeeManager',
    displayName: '人员汇报关系',
    sourceType: 'Employee',
    targetType: 'Employee',
    cardinality: 'one-to-many',
    instanceSource: 'source',   // 来自 employee.manager_id
    version: V,
  },
  {
    apiName: 'ProductOwnerDept',
    displayName: '产品负责部门',
    sourceType: 'Product',
    targetType: 'Department',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 product.owner_dept_id
    version: V,
  },
  {
    apiName: 'DeviceProduct',
    displayName: '设备关联产品',
    sourceType: 'Device',
    targetType: 'Product',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 device.product_id
    version: V,
  },
  {
    apiName: 'DeviceDepartment',
    displayName: '设备使用部门',
    sourceType: 'Device',
    targetType: 'Department',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 device_department 关系表
    version: V,
  },
  {
    apiName: 'ProjectDepartment',
    displayName: '项目牵头部门',
    sourceType: 'Project',
    targetType: 'Department',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 project.dept_id
    version: V,
  },
  {
    apiName: 'ProjectMember',
    displayName: '项目成员',
    sourceType: 'Project',
    targetType: 'Employee',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 project_member 关系表
    version: V,
  },
  {
    apiName: 'ProjectProduct',
    displayName: '项目交付产品',
    sourceType: 'Project',
    targetType: 'Product',
    cardinality: 'many-to-many',
    instanceSource: 'source',   // 来自 project_product 关系表
    version: V,
  },
];

// 本体函数：离职预警评估
// 逻辑：对每个部门计算其人员日均上班时间的均值，若某人员上班时长 < 部门均值 * 阈值(默认 0.8)，
// 则通过 writeObjectPatch 修改该人员实例的 dimissionRisk=true（写入本体可写侧 object_write，不回写只读源端）。
export const functions: OntologyFunction[] = [
  {
    apiName: 'evaluateDimissionRisk',
    displayName: '离职风险预警评估',
    language: 'typescript',
    entry: 'evaluateDimissionRisk',
    inputs: [
      { name: 'threshold', type: 'float', required: false }, // 触发比例，默认 0.8
      { name: 'departmentId', type: 'integer', required: false }, // 可选：仅评估某个部门
    ],
    outputs: ['object'],
    version: V,
  },
];

// 动作：告警规则命中后调用，将命中对象生成为 Alert 对象（写入本体可写侧）
// effect.kind='function' 表示该 Action 实为一个函数（createDimissionAlert），由沙箱执行。
export const actions: ActionType[] = [
  {
    apiName: 'createDimissionAlert',
    displayName: '生成离职风险告警',
    kind: 'standard',
    parameters: [
      { name: 'rule', type: 'string', required: true },
      { name: 'alertObjectType', type: 'string', required: true },
      { name: 'flagged', type: 'string', required: true },
    ],
    validationRules: [],
    effect: { kind: 'function', ref: 'createDimissionAlert' },
    version: V,
  },
];

// 告警规则（后台定时任务）：可配置 Function 评估 + 可配置 Action 落地
export const alertRules: AlertRule[] = [
  {
    apiName: 'dimissionRiskRule',
    displayName: '离职风险定时巡检',
    enabled: true,
    intervalSeconds: 60,
    functionApiName: 'evaluateDimissionRisk',
    actionApiName: 'createDimissionAlert',
    params: { threshold: 0.8 },
    alertObjectType: 'Alert',
    version: V,
  },
];
