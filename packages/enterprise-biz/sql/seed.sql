-- ============================================================
-- 企业数据治理（模拟）— 样例数据
-- 场景：单位 / 部门 / 人员 / 产品 / 设备 / 项目 + 关系 + 监控日志
-- 执行：
--   psql "postgresql://ontology:ontology@localhost:5432/enterprise_biz" -f packages/enterprise-biz/sql/seed.sql
-- 可重复执行：先清空再插入（TRUNCATE ... CASCADE）。
-- ============================================================

TRUNCATE department, employee, product, device, project,
         project_member, project_product, device_department, monitor_log,
         leave_record, organization
         RESTART IDENTITY CASCADE;

-- ---------- 单位（集团 → 子单位） ----------
INSERT INTO organization (id, code, name, short_name, org_type, parent_id, credit_code, leader_name, location, established_date) VALUES
  (1, 'ORG001', '中衡科技集团有限公司',           '中衡集团',   'group',      NULL, '91320100MA1K00001A', '张伟', '南京', '2010-05-18'),
  (2, 'ORG002', '中衡软件科技有限公司',           '中衡软件',   'subsidiary', 1,    '91320100MA1K00002B', '李娜', '南京', '2015-03-02'),
  (3, 'ORG003', '中衡智能制造（苏州）有限公司',   '中衡智造',   'subsidiary', 1,    '91320500MA1K00003C', '王强', '苏州', '2016-06-15'),
  (4, 'ORG004', '中衡市场营销（上海）有限公司',   '中衡市场',   'subsidiary', 1,    '91310000MA1K00004D', '刘洋', '上海', '2017-02-08'),
  (5, 'ORG005', '中衡科技集团有限公司华南分公司', '华南分公司', 'branch',     1,    '91440100MA1K00005E', '高远', '广州', '2019-09-01');
SELECT setval('organization_id_seq', 5);

-- ---------- 部门（含层级；org_id=所属单位，部门层级限本单位内） ----------
INSERT INTO department (id, code, name, org_id, parent_id, location) VALUES
  -- 集团本级
  (1,  'D00', '总部',           1, NULL, '南京'),
  (7,  'D07', '集团综合办公室', 1, NULL, '南京'),
  (8,  'D08', '集团财务部',     1, NULL, '南京'),
  -- 中衡软件（研发）
  (2,  'D01', '研发中心',       2, NULL, '南京'),
  (5,  'D11', '软件研发组',     2, 2,    '南京'),
  (6,  'D12', '硬件研发组',     2, 2,    '南京'),
  (9,  'D21', '测试发布组',     2, 2,    '南京'),
  (10, 'D22', '算法实验室',     2, 2,    '南京'),
  -- 中衡智造（制造）
  (3,  'D02', '生产制造部',     3, NULL, '苏州'),
  (11, 'D31', '产线一组',       3, 3,    '苏州'),
  (12, 'D32', '产线二组',       3, 3,    '苏州'),
  (13, 'D33', '质检组',         3, 3,    '苏州'),
  -- 中衡市场（营销）
  (4,  'D03', '市场部',         4, NULL, '上海'),
  (14, 'D41', '品牌组',         4, 4,    '上海'),
  (15, 'D42', '渠道组',         4, 4,    '上海'),
  -- 华南分公司
  (16, 'D51', '华南销售部',     5, NULL, '广州'),
  (17, 'D52', '华南售后服务部', 5, NULL, '广州');
SELECT setval('department_id_seq', 17);

-- ---------- 人员（manager_id 暂置 NULL，结尾统一更新） ----------
INSERT INTO employee (id, emp_code, name, gender, email, phone, title, department_id, manager_id, hire_date, work_hours, status) VALUES
  (1,  'E0001', '张伟',   'M', 'zhangwei@corp.com',   '13800000001', 'CEO',          1, NULL, '2015-03-01', 9.0,  'active'),
  (2,  'E0002', '李娜',   'F', 'lina@corp.com',       '13800000002', '研发总监',     2, 1,    '2016-07-12', 8.5,  'active'),
  (3,  'E0003', '王强',   'M', 'wangqiang@corp.com',  '13800000003', '制造总监',     3, 1,    '2016-09-01', 7.5,  'active'),
  (4,  'E0004', '刘洋',   'M', 'liuyang@corp.com',    '13800000004', '市场总监',     4, 1,    '2017-01-15', 8.8,  'active'),
  (5,  'E0005', '陈静',   'F', 'chenjing@corp.com',   '13800000005', '软件组长',     5, 2,    '2018-04-20', 5.0,  'active'),  -- 低工时：预警候选（软件研发组平均约 6.67）
  (6,  'E0006', '杨帆',   'M', 'yangfan@corp.com',    '13800000006', '软件工程师',   5, 5,    '2019-06-10', 7.2,  'active'),
  (7,  'E0007', '赵磊',   'M', 'zhaolei@corp.com',    '13800000007', '软件工程师',   5, 5,    '2020-02-18', 7.8,  'active'),
  (8,  'E0008', '周敏',   'F', 'zhoumin@corp.com',    '13800000008', '硬件组长',     6, 2,    '2018-05-22', 4.5,  'active'),  -- 低工时：预警候选（硬件研发组平均约 5.75）
  (9,  'E0009', '吴昊',   'M', 'wuhao@corp.com',      '13800000009', '硬件工程师',   6, 8,    '2020-08-30', 7.0,  'active'),
  (10, 'E0010', '孙丽',   'F', 'sunli@corp.com',      '13800000010', '生产主管',     3, 3,    '2017-11-05', 8.2,  'active'),
  (11, 'E0011', '马涛',   'M', 'matao@corp.com',      '13800000011', '产线工人',     3, 10,   '2021-03-14', 8.6,  'active'),
  (12, 'E0012', '朱琳',   'F', 'zhulin@corp.com',     '13800000012', '市场经理',     4, 4,    '2019-09-09', 8.0,  'active'),
  -- 集团本级新增
  (13, 'E0013', '郑芸',   'F', 'zhengyun@corp.com',   '13800000013', '综合办主任',   7, 1,    '2016-04-01', 8.0,  'active'),
  (14, 'E0014', '韩雪',   'F', 'hanxue@corp.com',     '13800000014', '财务经理',     8, 1,    '2015-09-10', 8.1,  'active'),
  -- 中衡软件新增
  (15, 'E0015', '冯晓',   'M', 'fengxiao@corp.com',   '13800000015', '测试组长',     9, 2,    '2019-03-18', 7.6,  'active'),
  (16, 'E0016', '陈晨',   'F', 'chenchen@corp.com',   '13800000016', '测试工程师',   9, 15,   '2021-07-05', 7.3,  'active'),
  (17, 'E0017', '秦朗',   'M', 'qinlang@corp.com',    '13800000017', '算法专家',     10, 2,   '2020-05-11', 8.8,  'active'),
  (18, 'E0018', '曹阳',   'M', 'caoyang@corp.com',    '13800000018', '算法工程师',   10, 17,  '2022-02-14', 8.2,  'active'),
  -- 中衡智造新增
  (19, 'E0019', '韩磊',   'M', 'hanlei@corp.com',     '13800000019', '产线一组组长', 11, 10,  '2018-08-01', 8.4,  'active'),
  (20, 'E0020', '贾童',   'F', 'jiatong@corp.com',    '13800000020', '产线工人',     11, 19,  '2021-11-20', 8.5,  'active'),
  (21, 'E0021', '邵兵',   'M', 'shaobing@corp.com',   '13800000021', '产线二组组长', 12, 10,  '2017-06-22', 8.3,  'active'),
  (22, 'E0022', '陶艺',   'F', 'taoyi@corp.com',      '13800000022', '产线工人',     12, 21,  '2022-04-08', 8.7,  'active'),
  (23, 'E0023', '何平',   'F', 'heping@corp.com',     '13800000023', '质检组长',     13, 10,  '2019-10-15', 7.9,  'active'),
  -- 中衡市场新增
  (24, 'E0024', '徐若曦', 'F', 'xuruoxi@corp.com',    '13800000024', '品牌经理',     14, 4,   '2020-01-06', 8.2,  'active'),
  (25, 'E0025', '崔明',   'M', 'cuiming@corp.com',    '13800000025', '渠道经理',     15, 4,   '2018-12-03', 8.0,  'active'),
  -- 华南分公司新增
  (26, 'E0026', '高远',   'M', 'gaoyuan@corp.com',    '13800000026', '华南销售总监', 16, 4,   '2019-09-15', 8.6,  'active'),
  (27, 'E0027', '林蔓',   'F', 'linman@corp.com',     '13800000027', '销售专员',     16, 26,  '2022-06-01', 7.8,  'active'),
  (28, 'E0028', '罗斌',   'M', 'luobin@corp.com',     '13800000028', '售后主管',     17, 26,  '2020-03-09', 8.0,  'active');
SELECT setval('employee_id_seq', 28);

-- 补部门负责人
UPDATE department SET manager_id = 1 WHERE id = 1;
UPDATE department SET manager_id = 2 WHERE id = 2;
UPDATE department SET manager_id = 3 WHERE id = 3;
UPDATE department SET manager_id = 4 WHERE id = 4;
UPDATE department SET manager_id = 5 WHERE id = 5;
UPDATE department SET manager_id = 8 WHERE id = 6;
-- 新增部门负责人
UPDATE department SET manager_id = 13 WHERE id = 7;
UPDATE department SET manager_id = 14 WHERE id = 8;
UPDATE department SET manager_id = 15 WHERE id = 9;
UPDATE department SET manager_id = 17 WHERE id = 10;
UPDATE department SET manager_id = 19 WHERE id = 11;
UPDATE department SET manager_id = 21 WHERE id = 12;
UPDATE department SET manager_id = 23 WHERE id = 13;
UPDATE department SET manager_id = 24 WHERE id = 14;
UPDATE department SET manager_id = 25 WHERE id = 15;
UPDATE department SET manager_id = 26 WHERE id = 16;
UPDATE department SET manager_id = 28 WHERE id = 17;

-- ---------- 请假记录（Employee 派生属性「年请假天数」数据源） ----------
INSERT INTO leave_record (id, emp_code, leave_type, start_date, duration_days, reason) VALUES
  (1,  'E0005', 'annual',   '2026-02-10', 3.5, '春节返乡'),
  (2,  'E0005', 'personal', '2026-07-03', 0.5, '办理证件'),
  (3,  'E0006', 'sick',     '2026-03-12', 2.0, '感冒发烧'),
  (4,  'E0006', 'annual',   '2026-08-01', 5.0, '年假'),
  (5,  'E0007', 'annual',   '2026-04-20', 1.0, '短途旅行'),
  (6,  'E0008', 'sick',     '2026-05-06', 1.5, '腰椎不适'),
  (7,  'E0009', 'annual',   '2026-06-15', 2.0, '陪家人'),
  (8,  'E0010', 'personal', '2026-01-08', 0.5, '家事'),
  (9,  'E0012', 'marriage', '2026-09-09', 5.0, '婚假'),
  (10, 'E0013', 'annual',   '2026-04-02', 2.5, '清明'),
  (11, 'E0015', 'sick',     '2026-02-25', 1.0, '体检'),
  (12, 'E0019', 'annual',   '2026-07-20', 3.0, '避暑'),
  (13, 'E0023', 'personal', '2026-06-30', 1.0, '搬家'),
  (14, 'E0026', 'annual',   '2026-05-11', 2.0, '回老家');
SELECT setval('leave_record_id_seq', 14);

-- ---------- 产品 ----------
INSERT INTO product (id, sku, name, category, owner_dept_id, status, launch_date) VALUES
  (1, 'P1001', '智能网关 A1',     '物联网设备', 2, 'active', '2021-05-01'),
  (2, 'P1002', '边缘计算盒子 B2', '物联网设备', 2, 'active', '2022-03-15'),
  (3, 'P1003', '资产管理平台 V1', '软件产品',   2, 'active', '2020-11-20'),
  (4, 'P1004', '工业传感器 S2',   '硬件配件',   3, 'active', '2021-08-10'),
  (5, 'P1005', '旧型号网关 A0',   '物联网设备', 2, 'eol',    '2018-01-01');

-- ---------- 设备 ----------
INSERT INTO device (id, asset_code, name, type, model, product_id, owner_emp_id, status, purchase_date) VALUES
  (1,  'DEV-0001', '网关-A1-01', '网关',   'A1', 1, 6,  'in_use',      '2021-06-01'),
  (2,  'DEV-0002', '网关-A1-02', '网关',   'A1', 1, 6,  'in_use',      '2021-06-01'),
  (3,  'DEV-0003', '边缘盒-B2-01','边缘计算','B2', 2, 5,  'in_use',      '2022-04-01'),
  (4,  'DEV-0004', '传感器-S2-01','传感器', 'S2', 4, 11, 'maintenance', '2021-09-01'),
  (5,  'DEV-0005', '传感器-S2-02','传感器', 'S2', 4, 11, 'idle',        '2021-09-01'),
  (6,  'DEV-0006', '旧网关-A0-01','网关',   'A0', 5, 10, 'retired',     '2018-02-01');

-- 设备 <-> 部门（使用/归属）
INSERT INTO device_department (device_id, department_id, usage_type) VALUES
  (1, 5, 'used'), (2, 5, 'used'),
  (3, 5, 'used'),
  (4, 3, 'used'), (5, 3, 'used'),
  (6, 3, 'owned');

-- ---------- 项目 ----------
INSERT INTO project (id, code, name, dept_id, lead_emp_id, start_date, end_date, budget, status) VALUES
  (1, 'PRJ-001', '智能工厂一期',   3, 3,  '2022-01-01', '2023-06-30', 5000000.00, 'done'),
  (2, 'PRJ-002', '资产平台升级',   2, 5,  '2023-02-01', NULL,         2000000.00, 'running'),
  (3, 'PRJ-003', '边缘AI试点',     2, 8,  '2023-07-01', NULL,         1500000.00, 'running'),
  (4, 'PRJ-004', '华东市场推广',   4, 12, '2023-03-01', '2024-02-28', 800000.00,  'closed');

-- 项目成员
INSERT INTO project_member (project_id, employee_id, role, joined_at) VALUES
  (1, 3,  '负责人',  '2022-01-01'),
  (1, 10, '执行',    '2022-01-01'),
  (1, 11, '执行',    '2022-01-01'),
  (2, 5,  '负责人',  '2023-02-01'),
  (2, 6,  '开发',    '2023-02-01'),
  (2, 7,  '开发',    '2023-02-01'),
  (3, 8,  '负责人',  '2023-07-01'),
  (3, 9,  '开发',    '2023-07-01'),
  (4, 12, '负责人',  '2023-03-01'),
  (4, 4,  '指导',    '2023-03-01');

-- 项目交付产品
INSERT INTO project_product (project_id, product_id) VALUES
  (1, 1), (1, 4),
  (2, 3),
  (3, 2),
  (4, 1);

-- ---------- 监控日志（设备运行日志） ----------
INSERT INTO monitor_log (device_id, event_time, metric, value, level, message) VALUES
  (1, '2026-08-10 08:00:00', 'temperature', 42.5, 'info',  '温度正常'),
  (1, '2026-08-10 09:00:00', 'cpu_usage',   65.0, 'info',  'CPU 负载正常'),
  (1, '2026-08-10 10:00:00', 'temperature', 78.0, 'warn',  '温度偏高'),
  (2, '2026-08-10 08:30:00', 'cpu_usage',   55.0, 'info',  'CPU 负载正常'),
  (3, '2026-08-10 08:00:00', 'temperature', 39.0, 'info',  '温度正常'),
  (3, '2026-08-10 11:00:00', 'disk_usage',  91.0, 'error', '磁盘使用率超过阈值'),
  (4, '2026-08-10 07:45:00', 'temperature', 30.0, 'info',  '维护中采样'),
  (5, '2026-08-10 07:45:00', 'temperature', 28.0, 'info',  '闲置采样');
