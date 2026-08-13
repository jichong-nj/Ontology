-- S0 Ontology Platform — 统一 PostgreSQL 存储 DDL
-- 适用范围：S2 元数据（图拓扑）+ S1 映射配置。
-- 执行：psql "$DATABASE_URL" -f packages/ontology-core/sql/schema.sql
-- 说明：测试可重复执行（先 DROP）。生产应改为迁移脚本（如 drizzle/prisma）。

DROP TABLE IF EXISTS interface_method_impl CASCADE;
DROP TABLE IF EXISTS object_interface CASCADE;
DROP TABLE IF EXISTS object_write CASCADE;
DROP TABLE IF EXISTS link_instance CASCADE;
DROP TABLE IF EXISTS ontology_function CASCADE;
DROP TABLE IF EXISTS action_type CASCADE;
DROP TABLE IF EXISTS interface_def CASCADE;
DROP TABLE IF EXISTS link_type CASCADE;
DROP TABLE IF EXISTS object_mapping CASCADE;
DROP TABLE IF EXISTS source_connection CASCADE;
DROP TABLE IF EXISTS object_type CASCADE;

-- ---------- S2 元数据（图拓扑） ----------

CREATE TABLE object_type (
  api_name             TEXT PRIMARY KEY,
  display_name         TEXT NOT NULL,
  description          TEXT,
  properties           JSONB NOT NULL,          -- PropertyDef[]
  -- S1 映射内嵌：对象类型直接携带其来源（源连接 + 源表），不再依赖独立的映射管理层。
  -- 字段级映射记录在 properties[].sourceMapping 上，源实例由 S1 下推（instanceSource='source'）。
  source_connection_id TEXT REFERENCES source_connection(id),
  source_table         TEXT,
  explore_config       JSONB NOT NULL DEFAULT '{}'::jsonb,  -- 探索页配置: { charts: string[] } 每对象类型一套独立图表
  version              INT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 共享属性：跨多个对象类型复用的属性元数据（元数据集中，数据由各自实例持有）
-- 注意：required（是否必填）由各对象类型在"引用"处自行配置，共享侧只定义通用元数据。
CREATE TABLE shared_property (
  api_name     TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  type         TEXT NOT NULL,   -- PropertyType
  description  TEXT,
  version      INT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE link_type (
  api_name        TEXT PRIMARY KEY,
  display_name    TEXT NOT NULL,
  source_type     TEXT NOT NULL REFERENCES object_type(api_name),
  target_type     TEXT NOT NULL REFERENCES object_type(api_name),
  cardinality     TEXT NOT NULL CHECK (cardinality IN ('one-to-one','one-to-many','many-to-many')),
  instance_source TEXT NOT NULL CHECK (instance_source IN ('source','managed')),
  version         INT  NOT NULL
);

CREATE TABLE link_instance (
  id          BIGSERIAL PRIMARY KEY,
  link_type   TEXT NOT NULL REFERENCES link_type(api_name),
  source_rid  TEXT NOT NULL,
  target_rid  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON link_instance (link_type, source_rid);
CREATE INDEX ON link_instance (link_type, target_rid);

CREATE TABLE object_write (
  id          BIGSERIAL PRIMARY KEY,
  object_type TEXT NOT NULL,
  object_rid  TEXT NOT NULL,
  patch       JSONB NOT NULL,
  actor       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- 每个对象实例在可写侧仅保留一行；修改属性时合并而非覆盖。
CREATE UNIQUE INDEX uq_object_write_inst ON object_write (object_type, object_rid);

CREATE TABLE interface_def (
  api_name     TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  properties   JSONB NOT NULL,
  methods      JSONB NOT NULL,          -- InterfaceMethod[]
  version      INT  NOT NULL
);

CREATE TABLE object_interface (
  object_api_name    TEXT NOT NULL REFERENCES object_type(api_name),
  interface_api_name TEXT NOT NULL REFERENCES interface_def(api_name),
  PRIMARY KEY (object_api_name, interface_api_name)
);

CREATE TABLE ontology_function (
  api_name TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('typescript','python')),
  entry    TEXT NOT NULL,
  inputs   JSONB NOT NULL,
  outputs  JSONB NOT NULL,
  -- 函数说明：描述函数作用与入参含义，便于使用者理解。
  description TEXT,
  -- 函数体源码（TS：运行时 new Function 编译注册；为空则沿用 seed 注入的注册式实现，此时只读不可编辑）。python 暂不支持运行时执行。
  body     TEXT,
  version  INT NOT NULL
);

CREATE TABLE interface_method_impl (
  object_api_name    TEXT NOT NULL REFERENCES object_type(api_name),
  interface_api_name TEXT NOT NULL REFERENCES interface_def(api_name),
  method_api_name    TEXT NOT NULL,
  function_api_name  TEXT NOT NULL REFERENCES ontology_function(api_name),
  PRIMARY KEY (object_api_name, interface_api_name, method_api_name)
);

CREATE TABLE action_type (
  api_name         TEXT PRIMARY KEY,
  display_name     TEXT NOT NULL,
  parameters       JSONB NOT NULL,
  validation_rules JSONB NOT NULL,
  effect           JSONB NOT NULL,
  version          INT NOT NULL
);

-- ---------- 告警规则（后台定时任务；条件命中后由 Action 生成告警对象） ----------
CREATE TABLE alert_rule (
  api_name          TEXT PRIMARY KEY,
  display_name      TEXT NOT NULL,
  enabled           BOOLEAN NOT NULL DEFAULT TRUE,
  interval_seconds  INT NOT NULL DEFAULT 60,
  function_api_name TEXT NOT NULL REFERENCES ontology_function(api_name),
  action_api_name   TEXT NOT NULL REFERENCES action_type(api_name),
  params            JSONB NOT NULL DEFAULT '{}'::jsonb,
  alert_object_type TEXT NOT NULL,
  version           INT NOT NULL DEFAULT 1
);

-- ---------- S1 映射配置（只读接入 + 对象↔源映射） ----------

CREATE TABLE source_connection (
  id              TEXT PRIMARY KEY,
  display_name    TEXT NOT NULL,
  kind            TEXT NOT NULL CHECK (kind IN ('database','warehouse','api','file')),
  read_only       BOOLEAN NOT NULL DEFAULT TRUE,   -- 强制只读
  connection_meta JSONB NOT NULL,
  secret_ref      TEXT NOT NULL,                   -- 指向密钥库，非明文
  status          TEXT NOT NULL CHECK (status IN ('connected','error','pending')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE object_mapping (
  id                   TEXT PRIMARY KEY,
  -- 注：object_type 不强制外键：映射是配置，质量门禁允许目标对象类型暂不存在（quality_status='failed'）。
  -- 质量校验由 MappingService 在创建时推导（见 S1）。
  object_type          TEXT NOT NULL,
  source_connection_id TEXT NOT NULL REFERENCES source_connection(id),
  source_table         TEXT NOT NULL,
  field_mappings       JSONB NOT NULL,             -- {property, sourceColumn}[]
  incremental_meta     JSONB NOT NULL,
  quality_status       TEXT NOT NULL CHECK (quality_status IN ('unknown','passed','warning','failed')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 自动维护
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_object_type_updated BEFORE UPDATE ON object_type
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_source_connection_updated BEFORE UPDATE ON source_connection
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_object_mapping_updated BEFORE UPDATE ON object_mapping
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
