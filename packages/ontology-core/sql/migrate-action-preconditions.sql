-- Step 3 配套迁移：action_type 增加 preconditions 列（Action 内嵌校验规则，对标 Palantir Action 自带 rules）
-- 变更：新增 preconditions JSONB，承载 Action 执行前的逐条前置校验声明。
-- 说明：纯增量 ADD COLUMN，无删除操作，可安全重复执行（IF NOT EXISTS）。

ALTER TABLE IF EXISTS action_type ADD COLUMN IF NOT EXISTS preconditions JSONB NOT NULL DEFAULT '[]'::jsonb;
