-- Step 2 迁移：alert_rule -> rule（通用自动化规则）
-- 变更：
--   1. 表名 alert_rule -> rule
--   2. 列 alert_object_type -> target_object_type
--   3. 新增 trigger JSONB（承载 schedule / event 触发器，替代单一 interval_seconds）
--   4. 列 function_api_name -> condition_function
-- 旧数据迁移：
--   - interval_seconds -> trigger = {kind:'schedule', intervalSeconds: interval_seconds}
--   - function_api_name -> condition_function（值不变）
-- 注意：迁移为可逆的等价转换；执行前请备份。

-- 1) 表重命名
ALTER TABLE IF EXISTS alert_rule RENAME TO rule;

-- 2) 列重命名：alert_object_type -> target_object_type
ALTER TABLE IF EXISTS rule RENAME COLUMN alert_object_type TO target_object_type;

-- 3) 列重命名：function_api_name -> condition_function
ALTER TABLE IF EXISTS rule RENAME COLUMN function_api_name TO condition_function;

-- 4) 新增 trigger 列（JSONB）
ALTER TABLE IF EXISTS rule ADD COLUMN IF NOT EXISTS trigger JSONB NOT NULL DEFAULT '{"kind":"schedule","intervalSeconds":60}'::jsonb;

-- 5) 旧 interval_seconds 数据迁移进 trigger（仅当 trigger 仍是默认值且原 interval_seconds 存在）
UPDATE rule
SET trigger = jsonb_build_object('kind', 'schedule', 'intervalSeconds', interval_seconds)
WHERE trigger = '{"kind":"schedule","intervalSeconds":60}'::jsonb
  AND interval_seconds IS NOT NULL;

-- 6) 清理：interval_seconds 旧列不再需要（trigger 已承载）。保留注释以说明历史。
--    若需保留历史记录，可注释掉下一行；否则删除旧列。
ALTER TABLE IF EXISTS rule DROP COLUMN IF EXISTS interval_seconds;

-- 7) 索引：按 enabled 查询加速（可选）
CREATE INDEX IF NOT EXISTS idx_rule_enabled ON rule (enabled);
