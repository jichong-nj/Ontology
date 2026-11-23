-- ============================================================
-- 企业数据治理（模拟）— 样例数据
-- 场景：部门 / 人员 / 产品 / 设备 / 项目 + 关系 + 监控日志
-- 执行：
--   psql "postgresql://ontology:ontology@localhost:5432/enterprise_biz" -f packages/enterprise-biz/sql/seed.sql
-- 可重复执行：先清空再插入（TRUNCATE ... CASCADE）。
-- ============================================================

TRUNCATE department, employee, product, device, project,
         project_member, project_product, device_department, monitor_log
         RESTART IDENTITY CASCADE;

-- ---------- 部门（含层级） ----------
INSERT INTO department (id, code, name, parent_id, location) VALUES
  (1, 'D00', '总部',           NULL, '南京'),
  (2, 'D01', '研发中心',       1,    '南京'),
  (3, 'D02', '生产制造部',     1,    '苏州'),
  (4, 'D03', '市场部',         1,    '上海'),
  (5, 'D11', '软件研发组',     2,    '南京'),
  (6, 'D12', '硬件研发组',     2,    '南京');

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
  (12, 'E0012', '朱琳',   'F', 'zhulin@corp.com',     '13800000012', '市场经理',     4, 4,    '2019-09-09', 8.0,  'active');

-- 补部门负责人
UPDATE department SET manager_id = 1 WHERE id = 1;
UPDATE department SET manager_id = 2 WHERE id = 2;
UPDATE department SET manager_id = 3 WHERE id = 3;
UPDATE department SET manager_id = 4 WHERE id = 4;
UPDATE department SET manager_id = 5 WHERE id = 5;
UPDATE department SET manager_id = 8 WHERE id = 6;

-- ---------- 产品 ----------
INSERT INTO product (id, sku, name, category, owner_dept_id, status, launch_date) VALUES
  (1, 'P1001', '智能网关 A1',     '物联网设备', 2, 'active', '2021-05-01'),
  (2, 'P1002', '边缘计算盒子 B2', '物联网设备', 2, 'active', '2022-03-15'),
  (3, 'P1003', '资产管理平台 V1', '软件产品',   2, 'active', '2020-11-20'),
  (4, 'P1004', '工业传感器 S2',   '硬件配件',   3, 'active', '2021-08-10'),
  (5, 'P1005', '旧型号网关 A0',   '物联网设备', 2, 'eol',    '2018-01-01');

-- ---------- 设备 ----------
INSERT INTO device (id, asset_code, name, type, model, product_id, status, purchase_date) VALUES
  (1,  'DEV-0001', '网关-A1-01', '网关',   'A1', 1, 'in_use',      '2021-06-01'),
  (2,  'DEV-0002', '网关-A1-02', '网关',   'A1', 1, 'in_use',      '2021-06-01'),
  (3,  'DEV-0003', '边缘盒-B2-01','边缘计算','B2', 2, 'in_use',      '2022-04-01'),
  (4,  'DEV-0004', '传感器-S2-01','传感器', 'S2', 4, 'maintenance', '2021-09-01'),
  (5,  'DEV-0005', '传感器-S2-02','传感器', 'S2', 4, 'idle',        '2021-09-01'),
  (6,  'DEV-0006', '旧网关-A0-01','网关',   'A0', 5, 'retired',     '2018-02-01');

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
