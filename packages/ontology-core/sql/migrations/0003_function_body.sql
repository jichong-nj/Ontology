-- Migration 0003: ontology_function 增加 body 列（函数源码存库，前端可编辑）
-- 手动执行：psql -U <user> -d <db> -f packages/ontology-core/sql/migrations/0003_function_body.sql

ALTER TABLE ontology_function ADD COLUMN IF NOT EXISTS body TEXT;
