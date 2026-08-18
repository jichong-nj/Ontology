// 生成并灌入 enterprise_biz 扩展业务库（200+ 张表，每表 ≥200 行模拟数据）
// 覆盖域：人事/ERP/CRM/WMS/资产管理/项目管理/产品管理/档案管理/财务/网络安全
// 运行：node packages/enterprise-biz/sql/generate-ext.mjs
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
const DOMAINS = {
  hr: { cn: '人事', tables: [
    ['employee_contract','员工合同',['contract_type','TEXT','["固定期限","无固定期限","实习"]'],['start_date','DATE',null],['end_date','DATE',null],['salary','NUMERIC(12,2)',null]],
    ['salary','薪资',['pay_month','TEXT',null],['base_salary','NUMERIC(12,2)',null],['bonus','NUMERIC(12,2)',null]],
    ['attendance','考勤',['work_date','DATE',null],['check_in','TIME',null],['check_out','TIME',null],['late_minutes','INT',null]],
    ['performance','绩效',['period','TEXT',null],['score','NUMERIC(5,2)',null],['rank','TEXT','["A","B","C","D"]']],
    ['training','培训',['course','TEXT',null],['hours','INT',null],['passed','BOOLEAN',null]],
    ['recruitment','招聘',['position','TEXT',null],['candidates','INT',null],['stage','TEXT','["初筛","面试","offer","入职"]']],
    ['position','岗位',['level','TEXT','["P4","P5","P6","P7","P8"]'],['headcount','INT',null]],
    ['org_chart','组织架构',['parent_code','TEXT',null],['manager','TEXT',null]],
    ['health','员工健康',['check_date','DATE',null],['bmi','NUMERIC(4,1)',null],['status','TEXT','["正常","关注","异常"]']],
    ['overtime','加班',['ot_date','DATE',null],['hours','NUMERIC(4,1)',null],['reason','TEXT',null]],
    ['business_trip','出差',['city','TEXT',null],['start_date','DATE',null],['days','INT',null]],
    ['leave_balance','年假余额',['year','INT',null],['total_days','NUMERIC(4,1)',null],['used_days','NUMERIC(4,1)',null]],
    ['employee_skill','员工技能',['skill','TEXT',null],['level','INT',null]],
    ['certification','证书',['cert_name','TEXT',null],['issue_date','DATE',null],['valid_years','INT',null]],
    ['payroll','工资单',['pay_month','TEXT',null],['gross','NUMERIC(12,2)',null],['net','NUMERIC(12,2)',null]],
    ['bonus','奖金',['reason','TEXT',null],['amount','NUMERIC(12,2)',null]],
    ['pension','社保公积金',['month','TEXT',null],['pension_base','NUMERIC(12,2)',null],['fund_base','NUMERIC(12,2)',null]],
    ['social_security','社保',['month','TEXT',null],['amount','NUMERIC(12,2)',null],['type','TEXT','["养老","医疗","失业","工伤","生育"]']],
    ['probation','试用期',['start_date','DATE',null],['end_date','DATE',null],['passed','BOOLEAN',null]],
    ['transfer','调岗',['from_dept','TEXT',null],['to_dept','TEXT',null],['eff_date','DATE',null]],
    ['exit','离职',['exit_date','DATE',null],['reason','TEXT',null],['type','TEXT','["主动","被动","退休"]']],
    ['employee_document','员工档案',['doc_type','TEXT',null],['file_path','TEXT',null]],
  ]},
  erp: { cn: 'ERP', tables: [
    ['purchase_order','采购订单',['po_no','TEXT',null],['supplier_id','INT',null],['order_date','DATE',null],['amount','NUMERIC(14,2)',null]],
    ['purchase_order_item','采购订单行',['po_no','TEXT',null],['sku','TEXT',null],['qty','INT',null],['price','NUMERIC(12,2)',null]],
    ['supplier','供应商',['supplier_code','TEXT',null],['contact','TEXT',null],['level','TEXT','["战略","普通","备选"]']],
    ['supplier_eval','供应商评估',['supplier_code','TEXT',null],['score','NUMERIC(5,2)',null],['dimension','TEXT','["质量","交期","价格","服务"]']],
    ['inventory','库存',['sku','TEXT',null],['qty','INT',null],['warehouse','TEXT',null]],
    ['inventory_txn','库存交易',['sku','TEXT',null],['txn_type','TEXT','["in","out","adj"]'],['qty','INT',null]],
    ['bom','物料清单',['product_code','TEXT',null],['material_code','TEXT',null],['qty','NUMERIC(10,2)',null]],
    ['production_plan','生产计划',['plan_no','TEXT',null],['product_code','TEXT',null],['plan_qty','INT',null]],
    ['work_order','工单',['wo_no','TEXT',null],['product_code','TEXT',null],['status','TEXT','["待生产","生产中","完成","暂停"]']],
    ['quality_inspect','质检',['wo_no','TEXT',null],['result','TEXT','["合格","不合格","待复检"]'],['defect_rate','NUMERIC(5,2)',null]],
    ['material','物料',['material_code','TEXT',null],['name','TEXT',null],['unit','TEXT','["个","米","千克"]']],
    ['material_category','物料类别',['cat_code','TEXT',null],['parent','TEXT',null]],
    ['warehouse','仓库',['wh_code','TEXT',null],['location','TEXT',null],['capacity','INT',null]],
    ['sales_order','销售订单',['so_no','TEXT',null],['customer','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['sales_order_item','销售订单行',['so_no','TEXT',null],['sku','TEXT',null],['qty','INT',null]],
    ['invoice','发票',['inv_no','TEXT',null],['amount','NUMERIC(14,2)',null],['tax_rate','NUMERIC(4,2)',null]],
    ['payment','付款',['pay_no','TEXT',null],['amount','NUMERIC(14,2)',null],['method','TEXT','["电汇","支票","承兑"]']],
    ['receipt','收款',['rcpt_no','TEXT',null],['amount','NUMERIC(14,2)',null],['method','TEXT','["电汇","现金","票据"]']],
    ['cost_center','成本中心',['cc_code','TEXT',null],['budget','NUMERIC(14,2)',null]],
    ['budget','预算',['year','INT',null],['cc_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['gl_account','总账科目',['acc_code','TEXT',null],['acc_name','TEXT',null],['direction','TEXT','["借","贷"]']],
    ['voucher','凭证',['voucher_no','TEXT',null],['acc_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
  ]},
  crm: { cn: 'CRM', tables: [
    ['customer','客户',['customer_code','TEXT',null],['industry','TEXT',null],['level','TEXT','["战略","重要","普通"]']],
    ['customer_contact','客户联系人',['customer_code','TEXT',null],['contact_name','TEXT',null],['phone','TEXT',null]],
    ['lead','线索',['source','TEXT','["官网","展会","转介","广告"]'],['status','TEXT','["新","跟进","转化","失效"]']],
    ['opportunity','商机',['opp_no','TEXT',null],['customer_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['opportunity_stage','商机阶段',['opp_no','TEXT',null],['stage','TEXT','["初步","方案","谈判","赢单","丢单"]'],['probability','NUMERIC(4,2)',null]],
    ['activity','活动',['act_type','TEXT','["电话","拜访","邮件","会议"]'],['act_date','DATE',null]],
    ['campaign','营销活动',['camp_name','TEXT',null],['channel','TEXT','["微信","邮件","短信","线下"]'],['cost','NUMERIC(12,2)',null]],
    ['contract','合同',['contract_no','TEXT',null],['customer_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['contract_item','合同明细',['contract_no','TEXT',null],['item','TEXT',null],['qty','INT',null]],
    ['quote','报价单',['quote_no','TEXT',null],['customer_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['quote_item','报价明细',['quote_no','TEXT',null],['item','TEXT',null],['price','NUMERIC(12,2)',null]],
    ['complaint','投诉',['complaint_no','TEXT',null],['level','TEXT','["低","中","高","紧急"]'],['status','TEXT','["待处理","处理中","已关闭"]']],
    ['satisfaction','满意度',['customer_code','TEXT',null],['score','INT',null],['nps','INT',null]],
    ['segment','客户分群',['seg_name','TEXT',null],['criteria','TEXT',null]],
    ['tag','客户标签',['customer_code','TEXT',null],['tag','TEXT',null]],
    ['interaction','互动记录',['customer_code','TEXT',null],['channel','TEXT',null],['content','TEXT',null]],
    ['task','任务',['owner','TEXT',null],['due_date','DATE',null],['status','TEXT','["待办","完成"]']],
    ['visit','拜访',['customer_code','TEXT',null],['visit_date','DATE',null],['summary','TEXT',null]],
    ['partner','合作伙伴',['partner_code','TEXT',null],['type','TEXT','["代理","分销","集成"]']],
    ['channel','渠道',['channel_name','TEXT',null],['type','TEXT','["直销","代理","电商"]']],
    ['price_book','价格手册',['sku','TEXT',null],['list_price','NUMERIC(12,2)',null]],
    ['subscription','订阅',['customer_code','TEXT',null],['plan','TEXT',null],['renew_date','DATE',null]],
  ]},
  wms: { cn: 'WMS', tables: [
    ['warehouse','仓库',['wh_code','TEXT',null],['location','TEXT',null],['type','TEXT','["中心仓","区域仓","前置仓"]']],
    ['zone','库区',['wh_code','TEXT',null],['zone_code','TEXT',null],['zone_type','TEXT','["存储","拣选","暂存"]']],
    ['location','库位',['zone_code','TEXT',null],['loc_code','TEXT',null],['capacity','INT',null]],
    ['sku','库存单位',['sku','TEXT',null],['name','TEXT',null],['uom','TEXT','["个","箱","托"]']],
    ['inbound','入库单',['ib_no','TEXT',null],['supplier','TEXT',null],['status','TEXT','["待入","入库中","完成"]']],
    ['inbound_line','入库明细',['ib_no','TEXT',null],['sku','TEXT',null],['qty','INT',null]],
    ['outbound','出库单',['ob_no','TEXT',null],['customer','TEXT',null],['status','TEXT','["待出","拣货中","完成"]']],
    ['outbound_line','出库明细',['ob_no','TEXT',null],['sku','TEXT',null],['qty','INT',null]],
    ['stock','库存',['sku','TEXT',null],['loc_code','TEXT',null],['qty','INT',null]],
    ['stock_move','库存移动',['sku','TEXT',null],['from_loc','TEXT',null],['to_loc','TEXT',null]],
    ['cycle_count','循环盘点',['loc_code','TEXT',null],['count_date','DATE',null],['diff','INT',null]],
    ['picking_task','拣货任务',['ob_no','TEXT',null],['picker','TEXT',null],['status','TEXT','["待拣","完成"]']],
    ['packing','打包',['ob_no','TEXT',null],['pack_type','TEXT',null],['weight','NUMERIC(8,2)',null]],
    ['shipping','发货',['ob_no','TEXT',null],['carrier','TEXT',null],['track_no','TEXT',null]],
    ['receiving','收货',['ib_no','TEXT',null],['qty','INT',null],['damaged','INT',null]],
    ['return','退货',['return_no','TEXT',null],['sku','TEXT',null],['reason','TEXT',null]],
    ['reservation','预留',['sku','TEXT',null],['qty','INT',null],['expire','DATE',null]],
    ['lot','批次',['lot_no','TEXT',null],['sku','TEXT',null],['prod_date','DATE',null]],
    ['serial','序列号',['sku','TEXT',null],['serial_no','TEXT',null]],
    ['inventory_adj','库存调整',['sku','TEXT',null],['adj_qty','INT',null],['reason','TEXT',null]],
    ['cross_dock','越库',['ib_no','TEXT',null],['ob_no','TEXT',null],['sku','TEXT',null]],
    ['putaway','上架',['ib_no','TEXT',null],['loc_code','TEXT',null],['qty','INT',null]],
  ]},
  am: { cn: '资产管理', tables: [
    ['asset','资产',['asset_code','TEXT',null],['asset_name','TEXT',null],['category','TEXT',null],['value','NUMERIC(14,2)',null]],
    ['asset_category','资产类别',['cat_code','TEXT',null],['parent','TEXT',null]],
    ['asset_depreciation','资产折旧',['asset_code','TEXT',null],['period','TEXT',null],['amount','NUMERIC(12,2)',null]],
    ['asset_maintenance','资产保养',['asset_code','TEXT',null],['m_date','DATE',null],['type','TEXT','["例行","预防","应急"]']],
    ['asset_repair','资产维修',['asset_code','TEXT',null],['fault','TEXT',null],['cost','NUMERIC(12,2)',null]],
    ['asset_check','资产盘点',['asset_code','TEXT',null],['check_date','DATE',null],['result','TEXT','["一致","盘盈","盘亏"]']],
    ['asset_disposal','资产处置',['asset_code','TEXT',null],['method','TEXT','["报废","出售","捐赠"]'],['amount','NUMERIC(12,2)',null]],
    ['asset_transfer','资产调拨',['asset_code','TEXT',null],['from_loc','TEXT',null],['to_loc','TEXT',null]],
    ['asset_lease','资产租赁',['asset_code','TEXT',null],['lessor','TEXT',null],['rent','NUMERIC(12,2)',null]],
    ['asset_warranty','资产保修',['asset_code','TEXT',null],['start_date','DATE',null],['months','INT',null]],
    ['asset_insurance','资产保险',['asset_code','TEXT',null],['insurer','TEXT',null],['premium','NUMERIC(12,2)',null]],
    ['asset_location','资产位置',['asset_code','TEXT',null],['building','TEXT',null],['floor','TEXT',null]],
    ['asset_supplier','资产供应商',['supplier','TEXT',null],['contact','TEXT',null]],
    ['asset_lifecycle','资产生命周期',['asset_code','TEXT',null],['stage','TEXT','["在用","闲置","待修","已处置"]'],['ts','TIMESTAMP',null]],
    ['asset_valuation','资产估值',['asset_code','TEXT',null],['val_date','DATE',null],['value','NUMERIC(14,2)',null]],
    ['asset_utilization','资产利用率',['asset_code','TEXT',null],['month','TEXT',null],['rate','NUMERIC(5,2)',null]],
    ['asset_image','资产图片',['asset_code','TEXT',null],['url','TEXT',null]],
    ['asset_doc','资产文档',['asset_code','TEXT',null],['doc_type','TEXT',null],['path','TEXT',null]],
    ['asset_tag','资产标签',['asset_code','TEXT',null],['tag','TEXT',null]],
    ['asset_loan','资产借用',['asset_code','TEXT',null],['borrower','TEXT',null],['return_date','DATE',null]],
    ['asset_calibration','资产校准',['asset_code','TEXT',null],['cal_date','DATE',null],['result','TEXT','["合格","不合格"]']],
    ['asset_license','资产许可',['asset_code','TEXT',null],['license_no','TEXT',null],['expire','DATE',null]],
  ]},
  pm: { cn: '项目管理', tables: [
    ['project_task','项目任务',['task_code','TEXT',null],['project_code','TEXT',null],['status','TEXT','["待开始","进行中","完成"]']],
    ['task_dependency','任务依赖',['task_code','TEXT',null],['dep_task','TEXT',null],['type','TEXT','["FS","SS","FF"]']],
    ['milestone','里程碑',['project_code','TEXT',null],['name','TEXT',null],['date','DATE',null]],
    ['timesheet','工时表',['emp_code','TEXT',null],['task_code','TEXT',null],['hours','NUMERIC(5,1)',null]],
    ['issue','问题',['issue_no','TEXT',null],['severity','TEXT','["低","中","高","紧急"]'],['status','TEXT','["打开","修复中","关闭"]']],
    ['risk','风险',['risk_no','TEXT',null],['level','TEXT','["低","中","高"]'],['mitigation','TEXT',null]],
    ['change_request','变更请求',['cr_no','TEXT',null],['reason','TEXT',null],['status','TEXT','["待审","批准","拒绝"]']],
    ['meeting','会议',['project_code','TEXT',null],['title','TEXT',null],['date','DATE',null]],
    ['deliverable','交付物',['project_code','TEXT',null],['name','TEXT',null],['status','TEXT','["进行中","已交付"]']],
    ['resource','资源',['res_code','TEXT',null],['type','TEXT','["人力","设备","外包"]'],['cost','NUMERIC(10,2)',null]],
    ['resource_allocation','资源分配',['project_code','TEXT',null],['res_code','TEXT',null],['qty','INT',null]],
    ['budget','项目预算',['project_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['expense','项目费用',['project_code','TEXT',null],['category','TEXT',null],['amount','NUMERIC(12,2)',null]],
    ['document','项目文档',['project_code','TEXT',null],['doc_type','TEXT',null],['path','TEXT',null]],
    ['comment','评论',['task_code','TEXT',null],['author','TEXT',null],['content','TEXT',null]],
    ['sprint','迭代',['project_code','TEXT',null],['name','TEXT',null],['start_date','DATE',null]],
    ['backlog','需求池',['project_code','TEXT',null],['title','TEXT',null],['priority','TEXT','["P0","P1","P2","P3"]']],
    ['epic','史诗',['project_code','TEXT',null],['name','TEXT',null]],
    ['stakeholder','干系人',['project_code','TEXT',null],['name','TEXT',null],['role','TEXT',null]],
    ['quality_gate','质量门',['project_code','TEXT',null],['gate','TEXT',null],['passed','BOOLEAN',null]],
    ['lessons','经验教训',['project_code','TEXT',null],['content','TEXT',null]],
    ['portfolio','项目组合',['pf_code','TEXT',null],['name','TEXT',null]],
  ]},
  pd: { cn: '产品管理', tables: [
    ['product_spec','产品规格',['sku','TEXT',null],['spec_name','TEXT',null],['spec_value','TEXT',null]],
    ['product_feature','产品特性',['sku','TEXT',null],['name','TEXT',null],['status','TEXT','["规划","开发","发布"]']],
    ['product_version','产品版本',['sku','TEXT',null],['version','TEXT',null],['release_date','DATE',null]],
    ['product_roadmap','产品路线图',['sku','TEXT',null],['quarter','TEXT',null],['goal','TEXT',null]],
    ['requirement','需求',['req_no','TEXT',null],['title','TEXT',null],['priority','TEXT','["高","中","低"]']],
    ['user_story','用户故事',['req_no','TEXT',null],['story','TEXT',null],['points','INT',null]],
    ['release','发布',['release_no','TEXT',null],['sku','TEXT',null],['date','DATE',null]],
    ['release_note','发布说明',['release_no','TEXT',null],['content','TEXT',null]],
    ['competitor','竞品',['comp_code','TEXT',null],['name','TEXT',null],['strength','TEXT',null]],
    ['market_analysis','市场分析',['sku','TEXT',null],['region','TEXT',null],['share','NUMERIC(5,2)',null]],
    ['pricing','定价',['sku','TEXT',null],['price','NUMERIC(12,2)',null],['currency','TEXT','["CNY","USD"]']],
    ['lifecycle','产品生命周期',['sku','TEXT',null],['stage','TEXT','["引入","成长","成熟","衰退"]'],['date','DATE',null]],
    ['bug','缺陷',['bug_no','TEXT',null],['severity','TEXT','["低","中","高","严重"]'],['status','TEXT','["新建","修复","关闭"]']],
    ['feedback','用户反馈',['sku','TEXT',null],['channel','TEXT',null],['content','TEXT',null]],
    ['review','产品评审',['sku','TEXT',null],['reviewer','TEXT',null],['result','TEXT','["通过","不通过"]']],
    ['catalog','产品目录',['cat_code','TEXT',null],['name','TEXT',null]],
    ['category','产品类别',['cat_code','TEXT',null],['parent','TEXT',null]],
    ['attribute','产品属性',['attr_code','TEXT',null],['name','TEXT',null]],
    ['attribute_value','属性值',['attr_code','TEXT',null],['value','TEXT',null]],
    ['bundle','产品组合',['bundle_code','TEXT',null],['sku','TEXT',null]],
    ['channel_product','渠道产品',['sku','TEXT',null],['channel','TEXT',null]],
    ['launch','产品上市',['sku','TEXT',null],['region','TEXT',null],['launch_date','DATE',null]],
  ]},
  ar: { cn: '档案管理', tables: [
    ['document','文档',['doc_code','TEXT',null],['title','TEXT',null],['type','TEXT','["合同","制度","报告","通知"]']],
    ['folder','文件夹',['folder_code','TEXT',null],['parent','TEXT',null],['name','TEXT',null]],
    ['file','文件',['file_code','TEXT',null],['folder_code','TEXT',null],['name','TEXT',null]],
    ['archive','档案',['arc_code','TEXT',null],['title','TEXT',null],['year','INT',null]],
    ['metadata','元数据',['doc_code','TEXT',null],['key','TEXT',null],['value','TEXT',null]],
    ['permission','权限',['doc_code','TEXT',null],['role','TEXT',null],['level','TEXT','["读","写","管理"]']],
    ['audit_log','审计日志',['doc_code','TEXT',null],['actor','TEXT',null],['action','TEXT',null]],
    ['classification','密级',['doc_code','TEXT',null],['level','TEXT','["公开","内部","机密","绝密"]']],
    ['retention','保管期限',['doc_code','TEXT',null],['years','INT',null]],
    ['version','版本',['doc_code','TEXT',null],['ver','TEXT',null],['author','TEXT',null]],
    ['template','模板',['tpl_code','TEXT',null],['name','TEXT',null]],
    ['contract_doc','合同文档',['doc_code','TEXT',null],['party','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['policy','制度',['policy_code','TEXT',null],['title','TEXT',null]],
    ['procedure','流程',['proc_code','TEXT',null],['title','TEXT',null]],
    ['form','表单',['form_code','TEXT',null],['name','TEXT',null]],
    ['report','报告',['report_code','TEXT',null],['title','TEXT',null],['period','TEXT',null]],
    ['email_archive','邮件归档',['mail_code','TEXT',null],['subject','TEXT',null],['date','DATE',null]],
    ['image','图片档案',['img_code','TEXT',null],['url','TEXT',null]],
    ['video','视频档案',['vid_code','TEXT',null],['url','TEXT',null]],
    ['knowledge','知识库',['kb_code','TEXT',null],['title','TEXT',null]],
    ['tag','标签',['doc_code','TEXT',null],['tag','TEXT',null]],
    ['share','共享',['doc_code','TEXT',null],['to_user','TEXT',null]],
  ]},
  fin: { cn: '财务', tables: [
    ['account','会计科目',['acc_code','TEXT',null],['acc_name','TEXT',null],['type','TEXT','["资产","负债","权益","收入","费用"]']],
    ['journal','日记账',['j_no','TEXT',null],['acc_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['ledger','分类账',['acc_code','TEXT',null],['period','TEXT',null],['balance','NUMERIC(14,2)',null]],
    ['voucher','凭证',['voucher_no','TEXT',null],['acc_code','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['receivable','应收',['cust_code','TEXT',null],['amount','NUMERIC(14,2)',null],['due_date','DATE',null]],
    ['payable','应付',['supplier_code','TEXT',null],['amount','NUMERIC(14,2)',null],['due_date','DATE',null]],
    ['payment','付款',['pay_no','TEXT',null],['amount','NUMERIC(14,2)',null],['method','TEXT','["电汇","票据"]']],
    ['receipt','收款',['rcpt_no','TEXT',null],['amount','NUMERIC(14,2)',null],['method','TEXT','["电汇","现金"]']],
    ['invoice','发票',['inv_no','TEXT',null],['amount','NUMERIC(14,2)',null],['tax','NUMERIC(12,2)',null]],
    ['tax','税务',['tax_type','TEXT',null],['period','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['budget','预算',['year','INT',null],['dept','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['cost','成本',['cost_type','TEXT',null],['amount','NUMERIC(14,2)',null],['period','TEXT',null]],
    ['revenue','收入',['rev_type','TEXT',null],['amount','NUMERIC(14,2)',null],['period','TEXT',null]],
    ['expense','费用',['exp_type','TEXT',null],['amount','NUMERIC(12,2)',null],['period','TEXT',null]],
    ['asset_ledger','资产台账',['asset_code','TEXT',null],['value','NUMERIC(14,2)',null]],
    ['bank','银行',['bank_code','TEXT',null],['name','TEXT',null],['balance','NUMERIC(14,2)',null]],
    ['cash_flow','现金流',['cf_type','TEXT','["经营","投资","筹资"]'],['amount','NUMERIC(14,2)',null]],
    ['salary','工资',['emp_code','TEXT',null],['gross','NUMERIC(12,2)',null],['net','NUMERIC(12,2)',null]],
    ['dividend','分红',['shareholder','TEXT',null],['amount','NUMERIC(14,2)',null]],
    ['loan','借款',['loan_no','TEXT',null],['amount','NUMERIC(14,2)',null],['rate','NUMERIC(5,2)',null]],
    ['investment','投资',['inv_code','TEXT',null],['amount','NUMERIC(14,2)',null],['return_rate','NUMERIC(5,2)',null]],
    ['report','报表',['rep_code','TEXT',null],['name','TEXT',null],['period','TEXT',null]],
  ]},
  sec: { cn: '网络安全', tables: [
    ['asset','安全资产',['asset_code','TEXT',null],['name','TEXT',null],['criticality','TEXT','["高","中","低"]']],
    ['vulnerability','漏洞',['vuln_no','TEXT',null],['severity','TEXT','["低","中","高","严重"]'],['status','TEXT','["未修复","修复中","已修复"]']],
    ['incident','安全事件',['inc_no','TEXT',null],['type','TEXT','["入侵","泄露","钓鱼","勒索"]'],['level','TEXT','["低","中","高","紧急"]']],
    ['alert','安全告警',['alert_no','TEXT',null],['rule','TEXT',null],['severity','TEXT','["低","中","高"]']],
    ['firewall_rule','防火墙规则',['fw_no','TEXT',null],['src','TEXT',null],['dst','TEXT',null],['action','TEXT','["allow","deny"]']],
    ['access_log','访问日志',['user','TEXT',null],['resource','TEXT',null],['ts','TIMESTAMP',null]],
    ['user_account','账号',['acc','TEXT',null],['status','TEXT','["正常","锁定","禁用"]'],['mfa','BOOLEAN',null]],
    ['auth_event','认证事件',['acc','TEXT',null],['result','TEXT','["成功","失败"]'],['ts','TIMESTAMP',null]],
    ['threat_intel','威胁情报',['ti_code','TEXT',null],['ioc','TEXT',null],['type','TEXT','["IP","域名","哈希"]']],
    ['policy','安全策略',['policy_code','TEXT',null],['title','TEXT',null]],
    ['control','安全控制',['ctrl_code','TEXT',null],['name','TEXT',null],['status','TEXT','["启用","停用"]']],
    ['audit','安全审计',['audit_no','TEXT',null],['scope','TEXT',null],['result','TEXT','["通过","不通过"]']],
    ['scan','扫描',['scan_no','TEXT',null],['target','TEXT',null],['status','TEXT','["进行中","完成"]']],
    ['patch','补丁',['patch_no','TEXT',null],['asset_code','TEXT',null],['status','TEXT','["待装","已装"]']],
    ['certificate','证书',['cert_no','TEXT',null],['cn','TEXT',null],['expire','DATE',null]],
    ['endpoint','终端',['ep_code','TEXT',null],['os','TEXT',null],['compliant','BOOLEAN',null]],
    ['network_device','网络设备',['dev_code','TEXT',null],['type','TEXT','["交换机","路由器","防火墙"]'],['ip','TEXT',null]],
    ['intrusion','入侵检测',['ids_no','TEXT',null],['src_ip','TEXT',null],['dst_ip','TEXT',null]],
    ['malware','恶意代码',['mal_no','TEXT',null],['name','TEXT',null],['type','TEXT','["病毒","木马","勒索"]']],
    ['phishing','钓鱼',['ph_no','TEXT',null],['target','TEXT',null],['blocked','BOOLEAN',null]],
    ['backup','备份',['bk_no','TEXT',null],['target','TEXT',null],['status','TEXT','["成功","失败"]']],
    ['compliance','合规',['cmp_code','TEXT',null],['standard','TEXT',null],['status','TEXT','["符合","不符合"]']],
  ]},
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
  // 预取基础外键值
  const fkCache = {};
  for (const k of Object.keys(FK_BASE)) {
    const r = await pool.query(FK_BASE[k].fetch);
    fkCache[k] = r.rows.map((x) => x[FK_BASE[k].col]);
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
