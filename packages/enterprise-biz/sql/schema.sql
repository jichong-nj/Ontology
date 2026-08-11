-- ============================================================
-- 企业数据治理（模拟）— 业务库 DDL
-- 场景：人员 / 部门 / 产品 / 设备 / 项目
-- 设计原则：治理完成后的“干净数据”，含主键、外键、约束、注释。
-- 执行：
--   createdb enterprise_biz
--   psql "postgresql://ontology:ontology@localhost:5432/enterprise_biz" -f packages/enterprise-biz/sql/schema.sql
-- 可重复执行（先 DROP）。
-- ============================================================

DROP TABLE IF EXISTS project_member        CASCADE;
DROP TABLE IF EXISTS project_product       CASCADE;
DROP TABLE IF EXISTS device_department     CASCADE;
DROP TABLE IF EXISTS monitor_log           CASCADE;
DROP TABLE IF EXISTS device                CASCADE;
DROP TABLE IF EXISTS product               CASCADE;
DROP TABLE IF EXISTS project               CASCADE;
DROP TABLE IF EXISTS employee              CASCADE;
DROP TABLE IF EXISTS department            CASCADE;

-- ---------- 部门 ----------
CREATE TABLE department (
  id            BIGSERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,        -- 部门编码（治理后统一编码）
  name          TEXT NOT NULL,
  parent_id     BIGINT REFERENCES department(id),  -- 自引用：上下级部门
  manager_id    BIGINT,                      -- 部门负责人（指向 employee.id），建表后补 FK
  location      TEXT,                        -- 办公地点
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE  department IS '部门信息（含层级：parent_id 自引用）';
COMMENT ON COLUMN department.code IS '治理统一部门编码';

-- ---------- 人员 ----------
CREATE TABLE employee (
  id            BIGSERIAL PRIMARY KEY,
  emp_code      TEXT UNIQUE NOT NULL,        -- 工号
  name          TEXT NOT NULL,
  gender        TEXT CHECK (gender IN ('M','F','U')),  -- 性别枚举，U=未知
  email         TEXT,
  phone         TEXT,
  title         TEXT,                        -- 职位
  department_id BIGINT NOT NULL REFERENCES department(id),
  manager_id    BIGINT REFERENCES employee(id),        -- 直属上级
  hire_date     DATE,
  work_hours    NUMERIC(5,2),                  -- 日均上班时长（小时）
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','leave','dimission')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE  employee IS '人员基本信息';
COMMENT ON COLUMN employee.emp_code IS '治理统一工号';

-- 补 department.manager_id 外键（避免循环依赖）
ALTER TABLE department
  ADD CONSTRAINT fk_department_manager
  FOREIGN KEY (manager_id) REFERENCES employee(id);

CREATE INDEX ON employee (department_id);
CREATE INDEX ON employee (manager_id);

-- ---------- 产品 ----------
CREATE TABLE product (
  id            BIGSERIAL PRIMARY KEY,
  sku           TEXT UNIQUE NOT NULL,        -- 产品编码
  name          TEXT NOT NULL,
  category      TEXT,                        -- 产品类别
  owner_dept_id BIGINT REFERENCES department(id),  -- 负责部门
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','eol','draft')),  -- eol=停产
  launch_date   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE  product IS '产品信息';
COMMENT ON COLUMN product.sku IS '治理统一产品编码';

CREATE INDEX ON product (owner_dept_id);

-- ---------- 设备 ----------
CREATE TABLE device (
  id            BIGSERIAL PRIMARY KEY,
  asset_code    TEXT UNIQUE NOT NULL,        -- 资产编码
  name          TEXT NOT NULL,
  type          TEXT,                        -- 设备类型
  model         TEXT,                        -- 型号
  product_id    BIGINT REFERENCES product(id),  -- 关联生产/对应产品
  status        TEXT NOT NULL DEFAULT 'in_use'
                CHECK (status IN ('in_use','idle','maintenance','retired')),
  purchase_date DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE  device IS '设备信息';
COMMENT ON COLUMN device.asset_code IS '治理统一资产编码';

CREATE INDEX ON device (product_id);

-- 设备 <-> 部门 多对多（使用/归属）
CREATE TABLE device_department (
  device_id     BIGINT NOT NULL REFERENCES device(id)     ON DELETE CASCADE,
  department_id BIGINT NOT NULL REFERENCES department(id) ON DELETE CASCADE,
  usage_type    TEXT NOT NULL DEFAULT 'used'
                CHECK (usage_type IN ('used','owned')),   -- 使用 / 归属
  PRIMARY KEY (device_id, department_id)
);
COMMENT ON TABLE device_department IS '设备与部门的多对多关系';

-- ---------- 项目 ----------
CREATE TABLE project (
  id            BIGSERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,        -- 项目编码
  name          TEXT NOT NULL,
  dept_id       BIGINT NOT NULL REFERENCES department(id),  -- 牵头部门
  lead_emp_id   BIGINT REFERENCES employee(id),  -- 项目负责人
  start_date    DATE,
  end_date      DATE,
  budget        NUMERIC(14,2),
  status        TEXT NOT NULL DEFAULT 'running'
                CHECK (status IN ('planning','running','done','closed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE  project IS '项目信息';
COMMENT ON COLUMN project.code IS '治理统一项目编码';

CREATE INDEX ON project (dept_id);
CREATE INDEX ON project (lead_emp_id);

-- 项目成员 多对多（人员 <-> 项目）
CREATE TABLE project_member (
  project_id    BIGINT NOT NULL REFERENCES project(id)    ON DELETE CASCADE,
  employee_id   BIGINT NOT NULL REFERENCES employee(id)   ON DELETE CASCADE,
  role          TEXT,                        -- 项目中角色
  joined_at     DATE,
  PRIMARY KEY (project_id, employee_id)
);
COMMENT ON TABLE project_member IS '项目成员关系';

-- 项目交付产品 多对多（项目 <-> 产品）
CREATE TABLE project_product (
  project_id    BIGINT NOT NULL REFERENCES project(id)    ON DELETE CASCADE,
  product_id    BIGINT NOT NULL REFERENCES product(id)    ON DELETE CASCADE,
  PRIMARY KEY (project_id, product_id)
);
COMMENT ON TABLE project_product IS '项目与产品的多对多关系';

-- ---------- 监控日志（设备运行日志，治理后结构化） ----------
CREATE TABLE monitor_log (
  id            BIGSERIAL PRIMARY KEY,
  device_id     BIGINT NOT NULL REFERENCES device(id)     ON DELETE CASCADE,
  event_time    TIMESTAMPTZ NOT NULL DEFAULT now(),
  metric        TEXT NOT NULL,              -- 指标名（如 temperature/cpu_usage）
  value         NUMERIC,                    -- 指标值
  level         TEXT NOT NULL DEFAULT 'info'
                CHECK (level IN ('info','warn','error')),
  message       TEXT
);
COMMENT ON TABLE  monitor_log IS '设备监控日志（结构化治理数据）';

CREATE INDEX ON monitor_log (device_id, event_time);

-- ---------- updated_at 自动维护 ----------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_department_updated  BEFORE UPDATE ON department  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_employee_updated    BEFORE UPDATE ON employee    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_product_updated     BEFORE UPDATE ON product     FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_device_updated      BEFORE UPDATE ON device      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_project_updated     BEFORE UPDATE ON project     FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
