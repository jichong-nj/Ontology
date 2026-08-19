// 批量更新 Object Type 和 Property 的 displayName 为中文
// 用法: node scripts/update-displaynames.mjs

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Property apiName -> displayName 中文映射表
const PROP_DISPLAY_NAMES = {
  // 通用字段
  id: 'ID',
  code: '编码',
  name: '名称',
  status: '状态',
  created_at: '创建时间',
  updated_at: '更新时间',
  created_by: '创建人',
  updated_by: '更新人',
  deleted_at: '删除时间',
  remark: '备注',
  sort_order: '排序',
  
  // 资产相关
  asset_code: '资产编号',
  asset_name: '资产名称',
  category: '类别',
  value: '价值',
  brand: '品牌',
  model: '型号',
  serial_number: '序列号',
  location: '位置',
  department: '部门',
  user: '使用人',
  condition: '状况',
  purchase_date: '购买日期',
  warranty_period: '保修期',
  warranty_status: '保修状态',
  
  // 人员相关
  employee_id: '人员ID',
  employee_name: '人员姓名',
  dept_id: '部门ID',
  dept_name: '部门名称',
  position: '职位',
  title: '职称',
  email: '邮箱',
  phone: '电话',
  username: '用户名',
  password: '密码',
  avatar: '头像',
  gender: '性别',
  birthday: '生日',
  id_card: '身份证号',
  entry_date: '入职日期',
  departure_date: '离职日期',
  employment_status: '在职状态',
  salary: '薪资',
  
  // 产品相关
  product_id: '产品ID',
  product_name: '产品名称',
  product_code: '产品编码',
  price: '价格',
  cost: '成本',
  stock: '库存',
  unit: '单位',
  description: '描述',
  spec: '规格',
  
  // 项目相关
  project_id: '项目ID',
  project_name: '项目名称',
  project_code: '项目编码',
  start_date: '开始日期',
  end_date: '结束日期',
  progress: '进度',
  priority: '优先级',
  
  // 客户相关
  customer_id: '客户ID',
  customer_name: '客户名称',
  customer_type: '客户类型',
  company: '公司',
  contact: '联系人',
  
  // 订单相关
  order_id: '订单ID',
  order_no: '订单号',
  quantity: '数量',
  amount: '金额',
  discount: '折扣',
  
  // 供应商相关
  supplier_id: '供应商ID',
  supplier_name: '供应商名称',
  supplier_code: '供应商编码',
  
  // 仓库相关
  warehouse_id: '仓库ID',
  warehouse_name: '仓库名称',
  warehouse_code: '仓库编码',
  address: '地址',
  
  // 合同相关
  contract_id: '合同ID',
  contract_no: '合同号',
  contract_name: '合同名称',
  sign_date: '签署日期',
  effective_date: '生效日期',
  expire_date: '到期日期',
  
  // 财务相关
  account: '账户',
  account_code: '账户编码',
  account_name: '账户名称',
  currency: '币种',
  type: '类型',
  subtype: '子类型',
  
  // 权限相关
  role_id: '角色ID',
  role_name: '角色名称',
  permission: '权限',
  menu: '菜单',
  
  // 日志相关
  log_type: '日志类型',
  log_level: '日志级别',
  action: '操作',
  module: '模块',
  ip_address: 'IP地址',
  user_agent: '用户代理',
  result: '结果',
  error_msg: '错误信息',
  
  // 告警相关
  alert_level: '告警级别',
  alert_type: '告警类型',
  alert_message: '告警消息',
  triggered_at: '触发时间',
  resolved_at: '解决时间',
  resolved_by: '解决人',
  
  // 设备相关
  device_id: '设备ID',
  device_name: '设备名称',
  device_type: '设备类型',
  device_model: '设备型号',
  device_status: '设备状态',
  install_location: '安装位置',
  manufacturer: '制造商',
  
  // 工单相关
  ticket_id: '工单ID',
  ticket_no: '工单号',
  title: '标题',
  content: '内容',
  assignee: '处理人',
  priority: '优先级',
  severity: '严重程度',
  category: '分类',
  
  // 任务相关
  task_id: '任务ID',
  task_name: '任务名称',
  task_type: '任务类型',
  assignee_id: '处理人ID',
  due_date: '截止日期',
  completion_rate: '完成率',
  
  // 文档相关
  doc_type: '文档类型',
  doc_name: '文档名称',
  doc_code: '文档编码',
  file_path: '文件路径',
  file_size: '文件大小',
  version: '版本',
  
  // 标签相关
  tag: '标签',
  tag_name: '标签名称',
  tag_color: '标签颜色',
  
  // 图片/文档相关
  image_url: '图片URL',
  file_url: '文件URL',
  thumbnail: '缩略图',
  
  // 保险相关
  insurance_company: '保险公司',
  policy_number: '保单号',
  premium: '保费',
  coverage: '保额',
  
  // 租赁相关
  lease_start: '租赁开始日',
  lease_end: '租赁结束日',
  rent: '租金',
  
  // 折旧相关
  depreciation_method: '折旧方法',
  useful_life: '使用寿命',
  residual_value: '残值',
  residual_rate: '残值率',
  
  // 盘点相关
  check_date: '盘点日期',
  checker: '盘点人',
  check_result: '盘点结果',
  
  // 校准相关
  calibration_date: '校准日期',
  calibration_result: '校准结果',
  next_calibration: '下次校准',
  
  // 位置相关
  latitude: '纬度',
  longitude: '经度',
  building: '楼栋',
  floor: '楼层',
  room: '房间',
  
  // 审批相关
  approval_status: '审批状态',
  approver: '审批人',
  approved_at: '审批时间',
  
  // 其他通用字段
  enabled: '启用',
  is_active: '是否启用',
  is_deleted: '是否删除',
  sort: '排序',
  order: '顺序',
  metadata: '元数据',
  ext_data: '扩展数据',
  json_data: 'JSON数据',
  content: '内容',
  summary: '摘要',
  title: '标题',
};

// Object Type apiName -> displayName 中文映射（补充）
const OT_DISPLAY_NAMES = {
  AmAsset: '资产管理-资产',
  AmAssetCalibration: '资产管理-资产校准',
  AmAssetCategory: '资产管理-资产类别',
  AmAssetCheck: '资产管理-资产盘点',
  AmAssetDepreciation: '资产管理-资产折旧',
  AmAssetDisposal: '资产管理-资产处置',
  AmAssetDoc: '资产管理-资产文档',
  AmAssetImage: '资产管理-资产图片',
  AmAssetInsurance: '资产管理-资产保险',
  AmAssetLease: '资产管理-资产租赁',
  AmAssetLicense: '资产管理-资产许可',
  AmAssetLifecycle: '资产管理-资产生命周期',
  AmAssetLoan: '资产管理-资产借用',
  AmAssetLocation: '资产管理-资产位置',
  AmAssetMaintenance: '资产管理-资产保养',
  AmAssetRepair: '资产管理-资产维修',
  AmAssetSupplier: '资产管理-资产供应商',
  AmAssetTag: '资产管理-资产标签',
  AmAssetTransfer: '资产管理-资产调拨',
  
  HrDepartment: '人力资源-部门',
  HrEmployee: '人力资源-员工',
  HrPosition: '人力资源-职位',
  HrSalary: '人力资源-薪资',
  HrAttendance: '人力资源-考勤',
  HrPerformance: '人力资源-绩效',
  
  ErpProduct: 'ERP-产品',
  ErpInventory: 'ERP-库存',
  ErpPurchase: 'ERP-采购',
  ErpSales: 'ERP-销售',
  
  CrmCustomer: 'CRM-客户',
  CrmContact: 'CRM-联系人',
  CrmOpportunity: 'CRM-商机',
  
  WmWarehouse: 'WMS-仓库',
  WmStock: 'WMS-库存',
  WmInbound: 'WMS-入库',
  WmOutbound: 'WMS-出库',
  
  PmProject: '项目管理-项目',
  PmTask: '项目管理-任务',
  PmMilestone: '项目管理-里程碑',
  
  ArAccounts: '财务-账户',
  ArTransaction: '财务-交易',
  ArInvoice: '财务-发票',
  
  FinFinance: '财务-财务',
  FinBudget: '财务-预算',
  FinExpense: '财务-费用',
  
  SecPermission: '安全-权限',
  SecRole: '安全-角色',
  SecMenu: '安全-菜单',
  
  Alert: '告警',
  AlertRule: '告警规则',
  AlertHistory: '告警历史',
  
  Device: '设备',
  DeviceMonitor: '设备监控',
  DeviceLog: '设备日志',
};

const SRC_CONN_ID = 'src_enterprise_biz';
const POSTGRES_URL = process.env.ONTOLOGY_URL || 'postgresql://ontology:ontology@localhost:5432/ontology';

async function main() {
  const pool = new pg.Pool({ connectionString: POSTGRES_URL });
  
  try {
    // 1. 获取所有扩展域对象类型
    const { rows: objectTypes } = await pool.query(
      `SELECT api_name, display_name, properties FROM object_type 
       WHERE source_connection_id = $1 
       ORDER BY api_name`,
      [SRC_CONN_ID],
    );
    
    console.log(`找到 ${objectTypes.length} 个扩展域对象类型`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const ot of objectTypes) {
      const properties = ot.properties || [];
      let needsUpdate = false;
      const updatedProperties = [...properties];
      
      // 更新每个属性的 displayName
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        const propApiName = prop.apiName;
        const currentDisplayName = prop.displayName;
        
        // 如果 displayName 是英文，尝试替换为中文
        if (PROP_DISPLAY_NAMES[propApiName] && currentDisplayName !== PROP_DISPLAY_NAMES[propApiName]) {
          // 检查是否是英文（不包含中文字符）
          const isEnglish = /^[\w]+$/.test(currentDisplayName);
          if (isEnglish) {
            updatedProperties[i] = {
              ...prop,
              displayName: PROP_DISPLAY_NAMES[propApiName],
            };
            needsUpdate = true;
            updatedCount++;
            
            // 每更新10个属性打印一次进度
            if (updatedCount % 10 === 0) {
              console.log(`  更新 ${ot.api_name}.${propApiName} -> ${PROP_DISPLAY_NAMES[propApiName]}`);
            }
          }
        }
      }
      
      // 如果属性有更新，更新整个对象类型
      if (needsUpdate) {
        await pool.query(
          `UPDATE object_type 
           SET properties = $1, updated_at = now() 
           WHERE api_name = $2`,
          [JSON.stringify(updatedProperties), ot.api_name],
        );
        skippedCount++;
      }
    }
    
    console.log(`\n更新完成！`);
    console.log(`- 更新属性数: ${updatedCount}`);
    console.log(`- 更新对象类型数: ${skippedCount}`);
    
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('错误:', e);
  process.exit(1);
});
