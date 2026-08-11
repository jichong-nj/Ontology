// 企业业务库 -> S1 数据源与对象映射配置
// 数据源：enterprise_biz（只读，作为数据中台）。
// 映射已内嵌到对象类型：这里导出"对象类型 + 其来源"的组合列表，
// bootstrap 通过 createObjectTypeWithMapping 把来源写进 object_type 并保留 object_mapping 底层记录。
import type { SourceConnection } from '@ontology/data-integration';
import type { CreateObjectTypeWithMappingInput } from '@ontology/data-integration';

export const SOURCE_ID = 'src_enterprise_biz';

export const sourceConnection: SourceConnection = {
  id: SOURCE_ID,
  displayName: '企业业务库(治理后)',
  kind: 'database',
  readOnly: true, // 强制只读
  connectionMeta: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'enterprise_biz',
    user: 'ontology',
    // 注意：真实密码仅存引用(secretRef)，不在此明文。此处仅结构示意。
  },
  secretRef: 'vault://pg/ontology/enterprise_biz', // 指向 S6 托管的凭据引用
  status: 'connected',
  createdAt: '',
  updatedAt: '',
};

// 源列 -> 对象属性(apiName) 映射辅助
function fm(property: string, sourceColumn: string) {
  return { property, sourceColumn };
}

// 组合创建输入：对象类型(apiName) + 关联数据源表 + 字段映射
// 实际的对象类型定义在 definitions.ts；此处用 (objectType, sourceTable, fieldMappings) 描述其来源。
export const objectTypeMappings: CreateObjectTypeWithMappingInput[] = [
  {
    objectType: { apiName: 'Department', displayName: '部门', description: '企业组织结构中的部门，含上下级层级', properties: [], implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '' },
    sourceConnectionId: SOURCE_ID,
    sourceTable: 'department',
    fieldMappings: [
      fm('id', 'id'),
      fm('code', 'code'),
      fm('name', 'name'),
      fm('parentId', 'parent_id'),
      fm('managerId', 'manager_id'),
      fm('location', 'location'),
    ],
  },
  {
    objectType: { apiName: 'Employee', displayName: '人员', description: '企业人员基本信息', properties: [], implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '' },
    sourceConnectionId: SOURCE_ID,
    sourceTable: 'employee',
    fieldMappings: [
      fm('id', 'id'),
      fm('empCode', 'emp_code'),
      fm('name', 'name'),
      fm('gender', 'gender'),
      fm('email', 'email'),
      fm('phone', 'phone'),
      fm('title', 'title'),
      fm('departmentId', 'department_id'),
      fm('managerId', 'manager_id'),
      fm('hireDate', 'hire_date'),
      fm('status', 'status'),
    ],
  },
  {
    objectType: { apiName: 'Product', displayName: '产品', description: '企业产品信息', properties: [], implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '' },
    sourceConnectionId: SOURCE_ID,
    sourceTable: 'product',
    fieldMappings: [
      fm('id', 'id'),
      fm('sku', 'sku'),
      fm('name', 'name'),
      fm('category', 'category'),
      fm('ownerDeptId', 'owner_dept_id'),
      fm('status', 'status'),
      fm('launchDate', 'launch_date'),
    ],
  },
  {
    objectType: { apiName: 'Device', displayName: '设备', description: '企业设备资产信息', properties: [], implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '' },
    sourceConnectionId: SOURCE_ID,
    sourceTable: 'device',
    fieldMappings: [
      fm('id', 'id'),
      fm('assetCode', 'asset_code'),
      fm('name', 'name'),
      fm('type', 'type'),
      fm('model', 'model'),
      fm('productId', 'product_id'),
      fm('status', 'status'),
      fm('purchaseDate', 'purchase_date'),
    ],
  },
  {
    objectType: { apiName: 'Project', displayName: '项目', description: '企业项目信息', properties: [], implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '' },
    sourceConnectionId: SOURCE_ID,
    sourceTable: 'project',
    fieldMappings: [
      fm('id', 'id'),
      fm('code', 'code'),
      fm('name', 'name'),
      fm('deptId', 'dept_id'),
      fm('leadEmpId', 'lead_emp_id'),
      fm('startDate', 'start_date'),
      fm('endDate', 'end_date'),
      fm('budget', 'budget'),
      fm('status', 'status'),
    ],
  },
];
