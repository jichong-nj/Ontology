-- 企业业务库扩展 DDL（由 generate-ext.mjs 自动生成，仅建表，不含数据）
-- 覆盖域：人事/ERP/CRM/WMS/资产管理/项目管理/产品管理/档案管理/财务/网络安全
-- 数据请用 generate-ext.mjs 灌入（每张 210 行）。

DROP TABLE IF EXISTS hr_employee_contract CASCADE;
CREATE TABLE hr_employee_contract (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "contract_type" TEXT,
  "start_date" DATE,
  "end_date" DATE,
  "salary" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_employee_contract IS '人事-员工合同';

DROP TABLE IF EXISTS hr_salary CASCADE;
CREATE TABLE hr_salary (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "pay_month" TEXT,
  "base_salary" NUMERIC(12,2),
  "bonus" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_salary IS '人事-薪资';

DROP TABLE IF EXISTS hr_attendance CASCADE;
CREATE TABLE hr_attendance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "work_date" DATE,
  "check_in" TIME,
  "check_out" TIME,
  "late_minutes" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_attendance IS '人事-考勤';

DROP TABLE IF EXISTS hr_performance CASCADE;
CREATE TABLE hr_performance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "period" TEXT,
  "score" NUMERIC(5,2),
  "rank" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_performance IS '人事-绩效';

DROP TABLE IF EXISTS hr_training CASCADE;
CREATE TABLE hr_training (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "course" TEXT,
  "hours" INT,
  "passed" BOOLEAN,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_training IS '人事-培训';

DROP TABLE IF EXISTS hr_recruitment CASCADE;
CREATE TABLE hr_recruitment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "position" TEXT,
  "candidates" INT,
  "stage" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_recruitment IS '人事-招聘';

DROP TABLE IF EXISTS hr_position CASCADE;
CREATE TABLE hr_position (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "level" TEXT,
  "headcount" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_position IS '人事-岗位';

DROP TABLE IF EXISTS hr_org_chart CASCADE;
CREATE TABLE hr_org_chart (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "parent_code" TEXT,
  "manager" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_org_chart IS '人事-组织架构';

DROP TABLE IF EXISTS hr_health CASCADE;
CREATE TABLE hr_health (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "check_date" DATE,
  "bmi" NUMERIC(4,1),
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_health IS '人事-员工健康';

DROP TABLE IF EXISTS hr_overtime CASCADE;
CREATE TABLE hr_overtime (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ot_date" DATE,
  "hours" NUMERIC(4,1),
  "reason" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_overtime IS '人事-加班';

DROP TABLE IF EXISTS hr_business_trip CASCADE;
CREATE TABLE hr_business_trip (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "city" TEXT,
  "start_date" DATE,
  "days" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_business_trip IS '人事-出差';

DROP TABLE IF EXISTS hr_leave_balance CASCADE;
CREATE TABLE hr_leave_balance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "year" INT,
  "total_days" NUMERIC(4,1),
  "used_days" NUMERIC(4,1),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_leave_balance IS '人事-年假余额';

DROP TABLE IF EXISTS hr_employee_skill CASCADE;
CREATE TABLE hr_employee_skill (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "skill" TEXT,
  "level" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_employee_skill IS '人事-员工技能';

DROP TABLE IF EXISTS hr_certification CASCADE;
CREATE TABLE hr_certification (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cert_name" TEXT,
  "issue_date" DATE,
  "valid_years" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_certification IS '人事-证书';

DROP TABLE IF EXISTS hr_payroll CASCADE;
CREATE TABLE hr_payroll (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "pay_month" TEXT,
  "gross" NUMERIC(12,2),
  "net" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_payroll IS '人事-工资单';

DROP TABLE IF EXISTS hr_bonus CASCADE;
CREATE TABLE hr_bonus (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "reason" TEXT,
  "amount" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_bonus IS '人事-奖金';

DROP TABLE IF EXISTS hr_pension CASCADE;
CREATE TABLE hr_pension (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "month" TEXT,
  "pension_base" NUMERIC(12,2),
  "fund_base" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_pension IS '人事-社保公积金';

DROP TABLE IF EXISTS hr_social_security CASCADE;
CREATE TABLE hr_social_security (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "month" TEXT,
  "amount" NUMERIC(12,2),
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_social_security IS '人事-社保';

DROP TABLE IF EXISTS hr_probation CASCADE;
CREATE TABLE hr_probation (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "start_date" DATE,
  "end_date" DATE,
  "passed" BOOLEAN,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_probation IS '人事-试用期';

DROP TABLE IF EXISTS hr_transfer CASCADE;
CREATE TABLE hr_transfer (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "from_dept" TEXT,
  "to_dept" TEXT,
  "eff_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_transfer IS '人事-调岗';

DROP TABLE IF EXISTS hr_exit CASCADE;
CREATE TABLE hr_exit (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "exit_date" DATE,
  "reason" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_exit IS '人事-离职';

DROP TABLE IF EXISTS hr_employee_document CASCADE;
CREATE TABLE hr_employee_document (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_type" TEXT,
  "file_path" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE hr_employee_document IS '人事-员工档案';

DROP TABLE IF EXISTS erp_purchase_order CASCADE;
CREATE TABLE erp_purchase_order (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "po_no" TEXT,
  "supplier_id" INT,
  "order_date" DATE,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_purchase_order IS 'ERP-采购订单';

DROP TABLE IF EXISTS erp_purchase_order_item CASCADE;
CREATE TABLE erp_purchase_order_item (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "po_no" TEXT,
  "sku" TEXT,
  "qty" INT,
  "price" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_purchase_order_item IS 'ERP-采购订单行';

DROP TABLE IF EXISTS erp_supplier CASCADE;
CREATE TABLE erp_supplier (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "supplier_code" TEXT,
  "contact" TEXT,
  "level" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_supplier IS 'ERP-供应商';

DROP TABLE IF EXISTS erp_supplier_eval CASCADE;
CREATE TABLE erp_supplier_eval (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "supplier_code" TEXT,
  "score" NUMERIC(5,2),
  "dimension" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_supplier_eval IS 'ERP-供应商评估';

DROP TABLE IF EXISTS erp_inventory CASCADE;
CREATE TABLE erp_inventory (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "qty" INT,
  "warehouse" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_inventory IS 'ERP-库存';

DROP TABLE IF EXISTS erp_inventory_txn CASCADE;
CREATE TABLE erp_inventory_txn (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "txn_type" TEXT,
  "qty" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_inventory_txn IS 'ERP-库存交易';

DROP TABLE IF EXISTS erp_bom CASCADE;
CREATE TABLE erp_bom (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "product_code" TEXT,
  "material_code" TEXT,
  "qty" NUMERIC(10,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_bom IS 'ERP-物料清单';

DROP TABLE IF EXISTS erp_production_plan CASCADE;
CREATE TABLE erp_production_plan (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "plan_no" TEXT,
  "product_code" TEXT,
  "plan_qty" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_production_plan IS 'ERP-生产计划';

DROP TABLE IF EXISTS erp_work_order CASCADE;
CREATE TABLE erp_work_order (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "wo_no" TEXT,
  "product_code" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_work_order IS 'ERP-工单';

DROP TABLE IF EXISTS erp_quality_inspect CASCADE;
CREATE TABLE erp_quality_inspect (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "wo_no" TEXT,
  "result" TEXT,
  "defect_rate" NUMERIC(5,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_quality_inspect IS 'ERP-质检';

DROP TABLE IF EXISTS erp_material CASCADE;
CREATE TABLE erp_material (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "material_code" TEXT,
  "name" TEXT,
  "unit" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_material IS 'ERP-物料';

DROP TABLE IF EXISTS erp_material_category CASCADE;
CREATE TABLE erp_material_category (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cat_code" TEXT,
  "parent" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_material_category IS 'ERP-物料类别';

DROP TABLE IF EXISTS erp_warehouse CASCADE;
CREATE TABLE erp_warehouse (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "wh_code" TEXT,
  "location" TEXT,
  "capacity" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_warehouse IS 'ERP-仓库';

DROP TABLE IF EXISTS erp_sales_order CASCADE;
CREATE TABLE erp_sales_order (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "so_no" TEXT,
  "customer" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_sales_order IS 'ERP-销售订单';

DROP TABLE IF EXISTS erp_sales_order_item CASCADE;
CREATE TABLE erp_sales_order_item (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "so_no" TEXT,
  "sku" TEXT,
  "qty" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_sales_order_item IS 'ERP-销售订单行';

DROP TABLE IF EXISTS erp_invoice CASCADE;
CREATE TABLE erp_invoice (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "inv_no" TEXT,
  "amount" NUMERIC(14,2),
  "tax_rate" NUMERIC(4,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_invoice IS 'ERP-发票';

DROP TABLE IF EXISTS erp_payment CASCADE;
CREATE TABLE erp_payment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "pay_no" TEXT,
  "amount" NUMERIC(14,2),
  "method" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_payment IS 'ERP-付款';

DROP TABLE IF EXISTS erp_receipt CASCADE;
CREATE TABLE erp_receipt (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "rcpt_no" TEXT,
  "amount" NUMERIC(14,2),
  "method" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_receipt IS 'ERP-收款';

DROP TABLE IF EXISTS erp_cost_center CASCADE;
CREATE TABLE erp_cost_center (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cc_code" TEXT,
  "budget" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_cost_center IS 'ERP-成本中心';

DROP TABLE IF EXISTS erp_budget CASCADE;
CREATE TABLE erp_budget (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "year" INT,
  "cc_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_budget IS 'ERP-预算';

DROP TABLE IF EXISTS erp_gl_account CASCADE;
CREATE TABLE erp_gl_account (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "acc_code" TEXT,
  "acc_name" TEXT,
  "direction" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_gl_account IS 'ERP-总账科目';

DROP TABLE IF EXISTS erp_voucher CASCADE;
CREATE TABLE erp_voucher (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "voucher_no" TEXT,
  "acc_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE erp_voucher IS 'ERP-凭证';

DROP TABLE IF EXISTS crm_customer CASCADE;
CREATE TABLE crm_customer (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "industry" TEXT,
  "level" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_customer IS 'CRM-客户';

DROP TABLE IF EXISTS crm_customer_contact CASCADE;
CREATE TABLE crm_customer_contact (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "contact_name" TEXT,
  "phone" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_customer_contact IS 'CRM-客户联系人';

DROP TABLE IF EXISTS crm_lead CASCADE;
CREATE TABLE crm_lead (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "source" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_lead IS 'CRM-线索';

DROP TABLE IF EXISTS crm_opportunity CASCADE;
CREATE TABLE crm_opportunity (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "opp_no" TEXT,
  "customer_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_opportunity IS 'CRM-商机';

DROP TABLE IF EXISTS crm_opportunity_stage CASCADE;
CREATE TABLE crm_opportunity_stage (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "opp_no" TEXT,
  "stage" TEXT,
  "probability" NUMERIC(4,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_opportunity_stage IS 'CRM-商机阶段';

DROP TABLE IF EXISTS crm_activity CASCADE;
CREATE TABLE crm_activity (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "act_type" TEXT,
  "act_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_activity IS 'CRM-活动';

DROP TABLE IF EXISTS crm_campaign CASCADE;
CREATE TABLE crm_campaign (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "camp_name" TEXT,
  "channel" TEXT,
  "cost" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_campaign IS 'CRM-营销活动';

DROP TABLE IF EXISTS crm_contract CASCADE;
CREATE TABLE crm_contract (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "contract_no" TEXT,
  "customer_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_contract IS 'CRM-合同';

DROP TABLE IF EXISTS crm_contract_item CASCADE;
CREATE TABLE crm_contract_item (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "contract_no" TEXT,
  "item" TEXT,
  "qty" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_contract_item IS 'CRM-合同明细';

DROP TABLE IF EXISTS crm_quote CASCADE;
CREATE TABLE crm_quote (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "quote_no" TEXT,
  "customer_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_quote IS 'CRM-报价单';

DROP TABLE IF EXISTS crm_quote_item CASCADE;
CREATE TABLE crm_quote_item (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "quote_no" TEXT,
  "item" TEXT,
  "price" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_quote_item IS 'CRM-报价明细';

DROP TABLE IF EXISTS crm_complaint CASCADE;
CREATE TABLE crm_complaint (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "complaint_no" TEXT,
  "level" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_complaint IS 'CRM-投诉';

DROP TABLE IF EXISTS crm_satisfaction CASCADE;
CREATE TABLE crm_satisfaction (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "score" INT,
  "nps" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_satisfaction IS 'CRM-满意度';

DROP TABLE IF EXISTS crm_segment CASCADE;
CREATE TABLE crm_segment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "seg_name" TEXT,
  "criteria" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_segment IS 'CRM-客户分群';

DROP TABLE IF EXISTS crm_tag CASCADE;
CREATE TABLE crm_tag (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "tag" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_tag IS 'CRM-客户标签';

DROP TABLE IF EXISTS crm_interaction CASCADE;
CREATE TABLE crm_interaction (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "channel" TEXT,
  "content" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_interaction IS 'CRM-互动记录';

DROP TABLE IF EXISTS crm_task CASCADE;
CREATE TABLE crm_task (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "owner" TEXT,
  "due_date" DATE,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_task IS 'CRM-任务';

DROP TABLE IF EXISTS crm_visit CASCADE;
CREATE TABLE crm_visit (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "visit_date" DATE,
  "summary" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_visit IS 'CRM-拜访';

DROP TABLE IF EXISTS crm_partner CASCADE;
CREATE TABLE crm_partner (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "partner_code" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_partner IS 'CRM-合作伙伴';

DROP TABLE IF EXISTS crm_channel CASCADE;
CREATE TABLE crm_channel (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "channel_name" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_channel IS 'CRM-渠道';

DROP TABLE IF EXISTS crm_price_book CASCADE;
CREATE TABLE crm_price_book (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "list_price" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_price_book IS 'CRM-价格手册';

DROP TABLE IF EXISTS crm_subscription CASCADE;
CREATE TABLE crm_subscription (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "customer_code" TEXT,
  "plan" TEXT,
  "renew_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE crm_subscription IS 'CRM-订阅';

DROP TABLE IF EXISTS wms_warehouse CASCADE;
CREATE TABLE wms_warehouse (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "wh_code" TEXT,
  "location" TEXT,
  "type" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_warehouse IS 'WMS-仓库';

DROP TABLE IF EXISTS wms_zone CASCADE;
CREATE TABLE wms_zone (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "wh_code" TEXT,
  "zone_code" TEXT,
  "zone_type" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_zone IS 'WMS-库区';

DROP TABLE IF EXISTS wms_location CASCADE;
CREATE TABLE wms_location (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "zone_code" TEXT,
  "loc_code" TEXT,
  "capacity" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_location IS 'WMS-库位';

DROP TABLE IF EXISTS wms_sku CASCADE;
CREATE TABLE wms_sku (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "sku" TEXT,
  "name" TEXT,
  "uom" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_sku IS 'WMS-库存单位';

DROP TABLE IF EXISTS wms_inbound CASCADE;
CREATE TABLE wms_inbound (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ib_no" TEXT,
  "supplier" TEXT,
  "status" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_inbound IS 'WMS-入库单';

DROP TABLE IF EXISTS wms_inbound_line CASCADE;
CREATE TABLE wms_inbound_line (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ib_no" TEXT,
  "sku" TEXT,
  "qty" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_inbound_line IS 'WMS-入库明细';

DROP TABLE IF EXISTS wms_outbound CASCADE;
CREATE TABLE wms_outbound (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ob_no" TEXT,
  "customer" TEXT,
  "status" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_outbound IS 'WMS-出库单';

DROP TABLE IF EXISTS wms_outbound_line CASCADE;
CREATE TABLE wms_outbound_line (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ob_no" TEXT,
  "sku" TEXT,
  "qty" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_outbound_line IS 'WMS-出库明细';

DROP TABLE IF EXISTS wms_stock CASCADE;
CREATE TABLE wms_stock (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "loc_code" TEXT,
  "qty" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_stock IS 'WMS-库存';

DROP TABLE IF EXISTS wms_stock_move CASCADE;
CREATE TABLE wms_stock_move (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "from_loc" TEXT,
  "to_loc" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_stock_move IS 'WMS-库存移动';

DROP TABLE IF EXISTS wms_cycle_count CASCADE;
CREATE TABLE wms_cycle_count (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "loc_code" TEXT,
  "count_date" DATE,
  "diff" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_cycle_count IS 'WMS-循环盘点';

DROP TABLE IF EXISTS wms_picking_task CASCADE;
CREATE TABLE wms_picking_task (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ob_no" TEXT,
  "picker" TEXT,
  "status" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_picking_task IS 'WMS-拣货任务';

DROP TABLE IF EXISTS wms_packing CASCADE;
CREATE TABLE wms_packing (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ob_no" TEXT,
  "pack_type" TEXT,
  "weight" NUMERIC(8,2),
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_packing IS 'WMS-打包';

DROP TABLE IF EXISTS wms_shipping CASCADE;
CREATE TABLE wms_shipping (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ob_no" TEXT,
  "carrier" TEXT,
  "track_no" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_shipping IS 'WMS-发货';

DROP TABLE IF EXISTS wms_receiving CASCADE;
CREATE TABLE wms_receiving (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ib_no" TEXT,
  "qty" INT,
  "damaged" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_receiving IS 'WMS-收货';

DROP TABLE IF EXISTS wms_return CASCADE;
CREATE TABLE wms_return (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "return_no" TEXT,
  "sku" TEXT,
  "reason" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_return IS 'WMS-退货';

DROP TABLE IF EXISTS wms_reservation CASCADE;
CREATE TABLE wms_reservation (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "qty" INT,
  "expire" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_reservation IS 'WMS-预留';

DROP TABLE IF EXISTS wms_lot CASCADE;
CREATE TABLE wms_lot (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "lot_no" TEXT,
  "sku" TEXT,
  "prod_date" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_lot IS 'WMS-批次';

DROP TABLE IF EXISTS wms_serial CASCADE;
CREATE TABLE wms_serial (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "serial_no" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_serial IS 'WMS-序列号';

DROP TABLE IF EXISTS wms_inventory_adj CASCADE;
CREATE TABLE wms_inventory_adj (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "adj_qty" INT,
  "reason" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_inventory_adj IS 'WMS-库存调整';

DROP TABLE IF EXISTS wms_cross_dock CASCADE;
CREATE TABLE wms_cross_dock (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ib_no" TEXT,
  "ob_no" TEXT,
  "sku" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_cross_dock IS 'WMS-越库';

DROP TABLE IF EXISTS wms_putaway CASCADE;
CREATE TABLE wms_putaway (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ib_no" TEXT,
  "loc_code" TEXT,
  "qty" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE wms_putaway IS 'WMS-上架';

DROP TABLE IF EXISTS am_asset CASCADE;
CREATE TABLE am_asset (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "asset_name" TEXT,
  "category" TEXT,
  "value" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset IS '资产管理-资产';

DROP TABLE IF EXISTS am_asset_category CASCADE;
CREATE TABLE am_asset_category (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cat_code" TEXT,
  "parent" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_category IS '资产管理-资产类别';

DROP TABLE IF EXISTS am_asset_depreciation CASCADE;
CREATE TABLE am_asset_depreciation (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "period" TEXT,
  "amount" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_depreciation IS '资产管理-资产折旧';

DROP TABLE IF EXISTS am_asset_maintenance CASCADE;
CREATE TABLE am_asset_maintenance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "m_date" DATE,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_maintenance IS '资产管理-资产保养';

DROP TABLE IF EXISTS am_asset_repair CASCADE;
CREATE TABLE am_asset_repair (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "fault" TEXT,
  "cost" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_repair IS '资产管理-资产维修';

DROP TABLE IF EXISTS am_asset_check CASCADE;
CREATE TABLE am_asset_check (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "check_date" DATE,
  "result" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_check IS '资产管理-资产盘点';

DROP TABLE IF EXISTS am_asset_disposal CASCADE;
CREATE TABLE am_asset_disposal (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "method" TEXT,
  "amount" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_disposal IS '资产管理-资产处置';

DROP TABLE IF EXISTS am_asset_transfer CASCADE;
CREATE TABLE am_asset_transfer (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "from_loc" TEXT,
  "to_loc" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_transfer IS '资产管理-资产调拨';

DROP TABLE IF EXISTS am_asset_lease CASCADE;
CREATE TABLE am_asset_lease (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "lessor" TEXT,
  "rent" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_lease IS '资产管理-资产租赁';

DROP TABLE IF EXISTS am_asset_warranty CASCADE;
CREATE TABLE am_asset_warranty (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "start_date" DATE,
  "months" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_warranty IS '资产管理-资产保修';

DROP TABLE IF EXISTS am_asset_insurance CASCADE;
CREATE TABLE am_asset_insurance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "insurer" TEXT,
  "premium" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_insurance IS '资产管理-资产保险';

DROP TABLE IF EXISTS am_asset_location CASCADE;
CREATE TABLE am_asset_location (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "building" TEXT,
  "floor" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_location IS '资产管理-资产位置';

DROP TABLE IF EXISTS am_asset_supplier CASCADE;
CREATE TABLE am_asset_supplier (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "supplier" TEXT,
  "contact" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_supplier IS '资产管理-资产供应商';

DROP TABLE IF EXISTS am_asset_lifecycle CASCADE;
CREATE TABLE am_asset_lifecycle (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "stage" TEXT,
  "ts" TIMESTAMP,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_lifecycle IS '资产管理-资产生命周期';

DROP TABLE IF EXISTS am_asset_valuation CASCADE;
CREATE TABLE am_asset_valuation (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "val_date" DATE,
  "value" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_valuation IS '资产管理-资产估值';

DROP TABLE IF EXISTS am_asset_utilization CASCADE;
CREATE TABLE am_asset_utilization (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "month" TEXT,
  "rate" NUMERIC(5,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_utilization IS '资产管理-资产利用率';

DROP TABLE IF EXISTS am_asset_image CASCADE;
CREATE TABLE am_asset_image (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "url" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_image IS '资产管理-资产图片';

DROP TABLE IF EXISTS am_asset_doc CASCADE;
CREATE TABLE am_asset_doc (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "doc_type" TEXT,
  "path" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_doc IS '资产管理-资产文档';

DROP TABLE IF EXISTS am_asset_tag CASCADE;
CREATE TABLE am_asset_tag (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "tag" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_tag IS '资产管理-资产标签';

DROP TABLE IF EXISTS am_asset_loan CASCADE;
CREATE TABLE am_asset_loan (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "borrower" TEXT,
  "return_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_loan IS '资产管理-资产借用';

DROP TABLE IF EXISTS am_asset_calibration CASCADE;
CREATE TABLE am_asset_calibration (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "cal_date" DATE,
  "result" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_calibration IS '资产管理-资产校准';

DROP TABLE IF EXISTS am_asset_license CASCADE;
CREATE TABLE am_asset_license (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "license_no" TEXT,
  "expire" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE am_asset_license IS '资产管理-资产许可';

DROP TABLE IF EXISTS pm_project_task CASCADE;
CREATE TABLE pm_project_task (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "task_code" TEXT,
  "project_code" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_project_task IS '项目管理-项目任务';

DROP TABLE IF EXISTS pm_task_dependency CASCADE;
CREATE TABLE pm_task_dependency (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "task_code" TEXT,
  "dep_task" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_task_dependency IS '项目管理-任务依赖';

DROP TABLE IF EXISTS pm_milestone CASCADE;
CREATE TABLE pm_milestone (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "project_code" TEXT,
  "name" TEXT,
  "date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_milestone IS '项目管理-里程碑';

DROP TABLE IF EXISTS pm_timesheet CASCADE;
CREATE TABLE pm_timesheet (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "emp_code" TEXT,
  "task_code" TEXT,
  "hours" NUMERIC(5,1),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_timesheet IS '项目管理-工时表';

DROP TABLE IF EXISTS pm_issue CASCADE;
CREATE TABLE pm_issue (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "issue_no" TEXT,
  "severity" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_issue IS '项目管理-问题';

DROP TABLE IF EXISTS pm_risk CASCADE;
CREATE TABLE pm_risk (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "risk_no" TEXT,
  "level" TEXT,
  "mitigation" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_risk IS '项目管理-风险';

DROP TABLE IF EXISTS pm_change_request CASCADE;
CREATE TABLE pm_change_request (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cr_no" TEXT,
  "reason" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_change_request IS '项目管理-变更请求';

DROP TABLE IF EXISTS pm_meeting CASCADE;
CREATE TABLE pm_meeting (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "title" TEXT,
  "date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_meeting IS '项目管理-会议';

DROP TABLE IF EXISTS pm_deliverable CASCADE;
CREATE TABLE pm_deliverable (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "project_code" TEXT,
  "name" TEXT,
  "status" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_deliverable IS '项目管理-交付物';

DROP TABLE IF EXISTS pm_resource CASCADE;
CREATE TABLE pm_resource (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "res_code" TEXT,
  "type" TEXT,
  "cost" NUMERIC(10,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_resource IS '项目管理-资源';

DROP TABLE IF EXISTS pm_resource_allocation CASCADE;
CREATE TABLE pm_resource_allocation (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "res_code" TEXT,
  "qty" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_resource_allocation IS '项目管理-资源分配';

DROP TABLE IF EXISTS pm_budget CASCADE;
CREATE TABLE pm_budget (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_budget IS '项目管理-项目预算';

DROP TABLE IF EXISTS pm_expense CASCADE;
CREATE TABLE pm_expense (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "category" TEXT,
  "amount" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_expense IS '项目管理-项目费用';

DROP TABLE IF EXISTS pm_document CASCADE;
CREATE TABLE pm_document (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "doc_type" TEXT,
  "path" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_document IS '项目管理-项目文档';

DROP TABLE IF EXISTS pm_comment CASCADE;
CREATE TABLE pm_comment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "task_code" TEXT,
  "author" TEXT,
  "content" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_comment IS '项目管理-评论';

DROP TABLE IF EXISTS pm_sprint CASCADE;
CREATE TABLE pm_sprint (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "project_code" TEXT,
  "name" TEXT,
  "start_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_sprint IS '项目管理-迭代';

DROP TABLE IF EXISTS pm_backlog CASCADE;
CREATE TABLE pm_backlog (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "title" TEXT,
  "priority" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_backlog IS '项目管理-需求池';

DROP TABLE IF EXISTS pm_epic CASCADE;
CREATE TABLE pm_epic (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "project_code" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_epic IS '项目管理-史诗';

DROP TABLE IF EXISTS pm_stakeholder CASCADE;
CREATE TABLE pm_stakeholder (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "project_code" TEXT,
  "name" TEXT,
  "role" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_stakeholder IS '项目管理-干系人';

DROP TABLE IF EXISTS pm_quality_gate CASCADE;
CREATE TABLE pm_quality_gate (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "gate" TEXT,
  "passed" BOOLEAN,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_quality_gate IS '项目管理-质量门';

DROP TABLE IF EXISTS pm_lessons CASCADE;
CREATE TABLE pm_lessons (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "project_code" TEXT,
  "content" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_lessons IS '项目管理-经验教训';

DROP TABLE IF EXISTS pm_portfolio CASCADE;
CREATE TABLE pm_portfolio (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "pf_code" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pm_portfolio IS '项目管理-项目组合';

DROP TABLE IF EXISTS pd_product_spec CASCADE;
CREATE TABLE pd_product_spec (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "spec_name" TEXT,
  "spec_value" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_product_spec IS '产品管理-产品规格';

DROP TABLE IF EXISTS pd_product_feature CASCADE;
CREATE TABLE pd_product_feature (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "sku" TEXT,
  "name" TEXT,
  "status" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_product_feature IS '产品管理-产品特性';

DROP TABLE IF EXISTS pd_product_version CASCADE;
CREATE TABLE pd_product_version (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "version" TEXT,
  "release_date" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_product_version IS '产品管理-产品版本';

DROP TABLE IF EXISTS pd_product_roadmap CASCADE;
CREATE TABLE pd_product_roadmap (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "quarter" TEXT,
  "goal" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_product_roadmap IS '产品管理-产品路线图';

DROP TABLE IF EXISTS pd_requirement CASCADE;
CREATE TABLE pd_requirement (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "req_no" TEXT,
  "title" TEXT,
  "priority" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_requirement IS '产品管理-需求';

DROP TABLE IF EXISTS pd_user_story CASCADE;
CREATE TABLE pd_user_story (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "req_no" TEXT,
  "story" TEXT,
  "points" INT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_user_story IS '产品管理-用户故事';

DROP TABLE IF EXISTS pd_release CASCADE;
CREATE TABLE pd_release (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "release_no" TEXT,
  "sku" TEXT,
  "date" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_release IS '产品管理-发布';

DROP TABLE IF EXISTS pd_release_note CASCADE;
CREATE TABLE pd_release_note (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "release_no" TEXT,
  "content" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_release_note IS '产品管理-发布说明';

DROP TABLE IF EXISTS pd_competitor CASCADE;
CREATE TABLE pd_competitor (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "comp_code" TEXT,
  "name" TEXT,
  "strength" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_competitor IS '产品管理-竞品';

DROP TABLE IF EXISTS pd_market_analysis CASCADE;
CREATE TABLE pd_market_analysis (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "region" TEXT,
  "share" NUMERIC(5,2),
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_market_analysis IS '产品管理-市场分析';

DROP TABLE IF EXISTS pd_pricing CASCADE;
CREATE TABLE pd_pricing (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "price" NUMERIC(12,2),
  "currency" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_pricing IS '产品管理-定价';

DROP TABLE IF EXISTS pd_lifecycle CASCADE;
CREATE TABLE pd_lifecycle (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "stage" TEXT,
  "date" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_lifecycle IS '产品管理-产品生命周期';

DROP TABLE IF EXISTS pd_bug CASCADE;
CREATE TABLE pd_bug (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "bug_no" TEXT,
  "severity" TEXT,
  "status" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_bug IS '产品管理-缺陷';

DROP TABLE IF EXISTS pd_feedback CASCADE;
CREATE TABLE pd_feedback (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "channel" TEXT,
  "content" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_feedback IS '产品管理-用户反馈';

DROP TABLE IF EXISTS pd_review CASCADE;
CREATE TABLE pd_review (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "reviewer" TEXT,
  "result" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_review IS '产品管理-产品评审';

DROP TABLE IF EXISTS pd_catalog CASCADE;
CREATE TABLE pd_catalog (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "cat_code" TEXT,
  "name" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_catalog IS '产品管理-产品目录';

DROP TABLE IF EXISTS pd_category CASCADE;
CREATE TABLE pd_category (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cat_code" TEXT,
  "parent" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_category IS '产品管理-产品类别';

DROP TABLE IF EXISTS pd_attribute CASCADE;
CREATE TABLE pd_attribute (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "attr_code" TEXT,
  "name" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_attribute IS '产品管理-产品属性';

DROP TABLE IF EXISTS pd_attribute_value CASCADE;
CREATE TABLE pd_attribute_value (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "attr_code" TEXT,
  "value" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_attribute_value IS '产品管理-属性值';

DROP TABLE IF EXISTS pd_bundle CASCADE;
CREATE TABLE pd_bundle (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "bundle_code" TEXT,
  "sku" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_bundle IS '产品管理-产品组合';

DROP TABLE IF EXISTS pd_channel_product CASCADE;
CREATE TABLE pd_channel_product (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "channel" TEXT,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_channel_product IS '产品管理-渠道产品';

DROP TABLE IF EXISTS pd_launch CASCADE;
CREATE TABLE pd_launch (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "region" TEXT,
  "launch_date" DATE,
  "product_id" BIGINT REFERENCES product(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE pd_launch IS '产品管理-产品上市';

DROP TABLE IF EXISTS ar_document CASCADE;
CREATE TABLE ar_document (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "title" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_document IS '档案管理-文档';

DROP TABLE IF EXISTS ar_folder CASCADE;
CREATE TABLE ar_folder (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "folder_code" TEXT,
  "parent" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_folder IS '档案管理-文件夹';

DROP TABLE IF EXISTS ar_file CASCADE;
CREATE TABLE ar_file (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "file_code" TEXT,
  "folder_code" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_file IS '档案管理-文件';

DROP TABLE IF EXISTS ar_archive CASCADE;
CREATE TABLE ar_archive (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "arc_code" TEXT,
  "title" TEXT,
  "year" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_archive IS '档案管理-档案';

DROP TABLE IF EXISTS ar_metadata CASCADE;
CREATE TABLE ar_metadata (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "key" TEXT,
  "value" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_metadata IS '档案管理-元数据';

DROP TABLE IF EXISTS ar_permission CASCADE;
CREATE TABLE ar_permission (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "role" TEXT,
  "level" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_permission IS '档案管理-权限';

DROP TABLE IF EXISTS ar_audit_log CASCADE;
CREATE TABLE ar_audit_log (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "actor" TEXT,
  "action" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_audit_log IS '档案管理-审计日志';

DROP TABLE IF EXISTS ar_classification CASCADE;
CREATE TABLE ar_classification (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "level" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_classification IS '档案管理-密级';

DROP TABLE IF EXISTS ar_retention CASCADE;
CREATE TABLE ar_retention (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "years" INT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_retention IS '档案管理-保管期限';

DROP TABLE IF EXISTS ar_version CASCADE;
CREATE TABLE ar_version (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "ver" TEXT,
  "author" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_version IS '档案管理-版本';

DROP TABLE IF EXISTS ar_template CASCADE;
CREATE TABLE ar_template (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "tpl_code" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_template IS '档案管理-模板';

DROP TABLE IF EXISTS ar_contract_doc CASCADE;
CREATE TABLE ar_contract_doc (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "party" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_contract_doc IS '档案管理-合同文档';

DROP TABLE IF EXISTS ar_policy CASCADE;
CREATE TABLE ar_policy (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "policy_code" TEXT,
  "title" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_policy IS '档案管理-制度';

DROP TABLE IF EXISTS ar_procedure CASCADE;
CREATE TABLE ar_procedure (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "proc_code" TEXT,
  "title" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_procedure IS '档案管理-流程';

DROP TABLE IF EXISTS ar_form CASCADE;
CREATE TABLE ar_form (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "form_code" TEXT,
  "name" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_form IS '档案管理-表单';

DROP TABLE IF EXISTS ar_report CASCADE;
CREATE TABLE ar_report (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "report_code" TEXT,
  "title" TEXT,
  "period" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_report IS '档案管理-报告';

DROP TABLE IF EXISTS ar_email_archive CASCADE;
CREATE TABLE ar_email_archive (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "mail_code" TEXT,
  "subject" TEXT,
  "date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_email_archive IS '档案管理-邮件归档';

DROP TABLE IF EXISTS ar_image CASCADE;
CREATE TABLE ar_image (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "img_code" TEXT,
  "url" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_image IS '档案管理-图片档案';

DROP TABLE IF EXISTS ar_video CASCADE;
CREATE TABLE ar_video (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "vid_code" TEXT,
  "url" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_video IS '档案管理-视频档案';

DROP TABLE IF EXISTS ar_knowledge CASCADE;
CREATE TABLE ar_knowledge (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "kb_code" TEXT,
  "title" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_knowledge IS '档案管理-知识库';

DROP TABLE IF EXISTS ar_tag CASCADE;
CREATE TABLE ar_tag (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "tag" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_tag IS '档案管理-标签';

DROP TABLE IF EXISTS ar_share CASCADE;
CREATE TABLE ar_share (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "doc_code" TEXT,
  "to_user" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE ar_share IS '档案管理-共享';

DROP TABLE IF EXISTS fin_account CASCADE;
CREATE TABLE fin_account (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "acc_code" TEXT,
  "acc_name" TEXT,
  "type" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_account IS '财务-会计科目';

DROP TABLE IF EXISTS fin_journal CASCADE;
CREATE TABLE fin_journal (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "j_no" TEXT,
  "acc_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_journal IS '财务-日记账';

DROP TABLE IF EXISTS fin_ledger CASCADE;
CREATE TABLE fin_ledger (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "acc_code" TEXT,
  "period" TEXT,
  "balance" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_ledger IS '财务-分类账';

DROP TABLE IF EXISTS fin_voucher CASCADE;
CREATE TABLE fin_voucher (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "voucher_no" TEXT,
  "acc_code" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_voucher IS '财务-凭证';

DROP TABLE IF EXISTS fin_receivable CASCADE;
CREATE TABLE fin_receivable (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cust_code" TEXT,
  "amount" NUMERIC(14,2),
  "due_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_receivable IS '财务-应收';

DROP TABLE IF EXISTS fin_payable CASCADE;
CREATE TABLE fin_payable (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "supplier_code" TEXT,
  "amount" NUMERIC(14,2),
  "due_date" DATE,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_payable IS '财务-应付';

DROP TABLE IF EXISTS fin_payment CASCADE;
CREATE TABLE fin_payment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "pay_no" TEXT,
  "amount" NUMERIC(14,2),
  "method" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_payment IS '财务-付款';

DROP TABLE IF EXISTS fin_receipt CASCADE;
CREATE TABLE fin_receipt (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "rcpt_no" TEXT,
  "amount" NUMERIC(14,2),
  "method" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_receipt IS '财务-收款';

DROP TABLE IF EXISTS fin_invoice CASCADE;
CREATE TABLE fin_invoice (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "inv_no" TEXT,
  "amount" NUMERIC(14,2),
  "tax" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_invoice IS '财务-发票';

DROP TABLE IF EXISTS fin_tax CASCADE;
CREATE TABLE fin_tax (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "tax_type" TEXT,
  "period" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_tax IS '财务-税务';

DROP TABLE IF EXISTS fin_budget CASCADE;
CREATE TABLE fin_budget (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "year" INT,
  "dept" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_budget IS '财务-预算';

DROP TABLE IF EXISTS fin_cost CASCADE;
CREATE TABLE fin_cost (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cost_type" TEXT,
  "amount" NUMERIC(14,2),
  "period" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_cost IS '财务-成本';

DROP TABLE IF EXISTS fin_revenue CASCADE;
CREATE TABLE fin_revenue (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "rev_type" TEXT,
  "amount" NUMERIC(14,2),
  "period" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_revenue IS '财务-收入';

DROP TABLE IF EXISTS fin_expense CASCADE;
CREATE TABLE fin_expense (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "exp_type" TEXT,
  "amount" NUMERIC(12,2),
  "period" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_expense IS '财务-费用';

DROP TABLE IF EXISTS fin_asset_ledger CASCADE;
CREATE TABLE fin_asset_ledger (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "asset_code" TEXT,
  "value" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_asset_ledger IS '财务-资产台账';

DROP TABLE IF EXISTS fin_bank CASCADE;
CREATE TABLE fin_bank (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "bank_code" TEXT,
  "name" TEXT,
  "balance" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_bank IS '财务-银行';

DROP TABLE IF EXISTS fin_cash_flow CASCADE;
CREATE TABLE fin_cash_flow (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cf_type" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_cash_flow IS '财务-现金流';

DROP TABLE IF EXISTS fin_salary CASCADE;
CREATE TABLE fin_salary (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "emp_code" TEXT,
  "gross" NUMERIC(12,2),
  "net" NUMERIC(12,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_salary IS '财务-工资';

DROP TABLE IF EXISTS fin_dividend CASCADE;
CREATE TABLE fin_dividend (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "shareholder" TEXT,
  "amount" NUMERIC(14,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_dividend IS '财务-分红';

DROP TABLE IF EXISTS fin_loan CASCADE;
CREATE TABLE fin_loan (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "loan_no" TEXT,
  "amount" NUMERIC(14,2),
  "rate" NUMERIC(5,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_loan IS '财务-借款';

DROP TABLE IF EXISTS fin_investment CASCADE;
CREATE TABLE fin_investment (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "inv_code" TEXT,
  "amount" NUMERIC(14,2),
  "return_rate" NUMERIC(5,2),
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_investment IS '财务-投资';

DROP TABLE IF EXISTS fin_report CASCADE;
CREATE TABLE fin_report (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "rep_code" TEXT,
  "name" TEXT,
  "period" TEXT,
  "dept_id" BIGINT REFERENCES department(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE fin_report IS '财务-报表';

DROP TABLE IF EXISTS sec_asset CASCADE;
CREATE TABLE sec_asset (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "asset_code" TEXT,
  "name" TEXT,
  "criticality" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_asset IS '网络安全-安全资产';

DROP TABLE IF EXISTS sec_vulnerability CASCADE;
CREATE TABLE sec_vulnerability (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "vuln_no" TEXT,
  "severity" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_vulnerability IS '网络安全-漏洞';

DROP TABLE IF EXISTS sec_incident CASCADE;
CREATE TABLE sec_incident (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "inc_no" TEXT,
  "type" TEXT,
  "level" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_incident IS '网络安全-安全事件';

DROP TABLE IF EXISTS sec_alert CASCADE;
CREATE TABLE sec_alert (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "alert_no" TEXT,
  "rule" TEXT,
  "severity" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_alert IS '网络安全-安全告警';

DROP TABLE IF EXISTS sec_firewall_rule CASCADE;
CREATE TABLE sec_firewall_rule (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "fw_no" TEXT,
  "src" TEXT,
  "dst" TEXT,
  "action" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_firewall_rule IS '网络安全-防火墙规则';

DROP TABLE IF EXISTS sec_access_log CASCADE;
CREATE TABLE sec_access_log (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "user" TEXT,
  "resource" TEXT,
  "ts" TIMESTAMP,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_access_log IS '网络安全-访问日志';

DROP TABLE IF EXISTS sec_user_account CASCADE;
CREATE TABLE sec_user_account (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "acc" TEXT,
  "status" TEXT,
  "mfa" BOOLEAN,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_user_account IS '网络安全-账号';

DROP TABLE IF EXISTS sec_auth_event CASCADE;
CREATE TABLE sec_auth_event (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "acc" TEXT,
  "result" TEXT,
  "ts" TIMESTAMP,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_auth_event IS '网络安全-认证事件';

DROP TABLE IF EXISTS sec_threat_intel CASCADE;
CREATE TABLE sec_threat_intel (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ti_code" TEXT,
  "ioc" TEXT,
  "type" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_threat_intel IS '网络安全-威胁情报';

DROP TABLE IF EXISTS sec_policy CASCADE;
CREATE TABLE sec_policy (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "policy_code" TEXT,
  "title" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_policy IS '网络安全-安全策略';

DROP TABLE IF EXISTS sec_control CASCADE;
CREATE TABLE sec_control (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "ctrl_code" TEXT,
  "name" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_control IS '网络安全-安全控制';

DROP TABLE IF EXISTS sec_audit CASCADE;
CREATE TABLE sec_audit (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "audit_no" TEXT,
  "scope" TEXT,
  "result" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_audit IS '网络安全-安全审计';

DROP TABLE IF EXISTS sec_scan CASCADE;
CREATE TABLE sec_scan (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "scan_no" TEXT,
  "target" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_scan IS '网络安全-扫描';

DROP TABLE IF EXISTS sec_patch CASCADE;
CREATE TABLE sec_patch (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "patch_no" TEXT,
  "asset_code" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_patch IS '网络安全-补丁';

DROP TABLE IF EXISTS sec_certificate CASCADE;
CREATE TABLE sec_certificate (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cert_no" TEXT,
  "cn" TEXT,
  "expire" DATE,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_certificate IS '网络安全-证书';

DROP TABLE IF EXISTS sec_endpoint CASCADE;
CREATE TABLE sec_endpoint (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ep_code" TEXT,
  "os" TEXT,
  "compliant" BOOLEAN,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_endpoint IS '网络安全-终端';

DROP TABLE IF EXISTS sec_network_device CASCADE;
CREATE TABLE sec_network_device (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "dev_code" TEXT,
  "type" TEXT,
  "ip" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_network_device IS '网络安全-网络设备';

DROP TABLE IF EXISTS sec_intrusion CASCADE;
CREATE TABLE sec_intrusion (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ids_no" TEXT,
  "src_ip" TEXT,
  "dst_ip" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_intrusion IS '网络安全-入侵检测';

DROP TABLE IF EXISTS sec_malware CASCADE;
CREATE TABLE sec_malware (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "mal_no" TEXT,
  "name" TEXT,
  "type" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_malware IS '网络安全-恶意代码';

DROP TABLE IF EXISTS sec_phishing CASCADE;
CREATE TABLE sec_phishing (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "ph_no" TEXT,
  "target" TEXT,
  "blocked" BOOLEAN,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_phishing IS '网络安全-钓鱼';

DROP TABLE IF EXISTS sec_backup CASCADE;
CREATE TABLE sec_backup (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "bk_no" TEXT,
  "target" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_backup IS '网络安全-备份';

DROP TABLE IF EXISTS sec_compliance CASCADE;
CREATE TABLE sec_compliance (
  id BIGSERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "cmp_code" TEXT,
  "standard" TEXT,
  "status" TEXT,
  "owner_emp_id" BIGINT REFERENCES employee(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE sec_compliance IS '网络安全-合规';
