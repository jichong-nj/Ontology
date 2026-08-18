-- 0004: 对象类型新增「父子明细映射」列（主表 + 明细表纵向关联）。
-- 明细行按 parentKey 外键聚合为数组/计数属性，挂到主对象上。
-- 执行：psql "$DATABASE_URL" -f packages/ontology-core/sql/migrations/0004_child_table_mappings.sql
ALTER TABLE object_type
  ADD COLUMN IF NOT EXISTS child_table_mappings JSONB;
