# Automation（自动化）功能设计文档

- 状态：**Implemented（Phase 1 + Phase 2 核心）**
- 日期：2026-11-26（初稿）/ 2026-11-26（实施记录）
- 范围：把现有「规则中心（Rules）」演进为 Palantir Automate 模式的独立 Automation 模块
- 非目标（本期不做）：完整 RBAC、跨租户隔离、复杂工作流编排（BPMN）

---

## 1. 背景与目标

### 1.1 背景

现在系统里已有「规则中心」：

- `rule` 表：`trigger` + `condition` + `action`
- 后台 `RuleScheduler`：周期触发；`onObjectWrite` 事件触发（去抖 1s）
- 动作是 function-backed Action
- UI 在 `/s2/rules`

它能跑（离职风险告警、邮件通知、定时重算），但产品形态上仍是「规则」，不是 Palantir 那种独立的 **Automate** 应用：

- 没有独立的 Automation 概念与菜单；
- 一个 automation 只能挂一个 action，没有多 effect；
- 没有运行历史、重试、fallback、并发控制；
- 没有级联防护（A 写对象触发 B，B 再写回 A）；
- 没有 staged writes（人工确认后写入）。

### 1.2 目标

1. **概念独立**：Automation 作为与 Object Types 并列的独立模块；
2. **模型完整**：Trigger + Condition + Effects[] + Execution Policy；
3. **可观测**：每次运行有 run 记录（触发、命中、每个 effect 结果、耗时、错误）；
4. **可治理**：重试、fallback、并发、链深度/循环保护；
5. **可演进**：后续支持 change-aware 触发、通知/Webhook、staged writes、权限审计。

### 1.3 成功标准

- 现有 3 条规则**行为不变**；
- 新增 automation 可配置多个 effect，并能看到运行历史；
- 级联 A→B 可运行，超过深度/检测到循环时停止并记录；
- effect 失败可重试/fallback，run 状态可区分成功/失败/部分成功。

---

## 2. 现状盘点

### 2.1 已有能力

| 能力 | 位置 |
|---|---|
| 规则定义 | `rule` 表（`apps/server` 通过 `repo.createRule` 等） |
| 触发 | schedule（intervalSeconds）；event（object_write + objectType） |
| 条件 | `conditionFunction`（函数）或 `condition`（property/aggregate/all/any/function） |
| 效果 | 单个 `actionApiName`（function-backed） |
| 调度 | `RuleScheduler`（10s tick）；`onObjectWrite` 去抖 1s |
| 级联 | 动作写对象 → 事件 → 其它 event 规则（无防护） |
| 预览 | `POST /api/s2/rules/preview` |
| UI | 规则列表、编辑、预览、运行全部 |

### 2.2 差距

1. 无 Automation 实体/菜单（只是 Rules 页）；
2. 单 effect，无 notify/webhook 原语；
3. 无 run 历史（只有手动 `runAll` 返回值）；
4. 无重试/fallback/超时；
5. 无并发/批量控制；
6. 无 chainId/depth/循环保护；
7. 事件不携带 changeType（新增/修改/删除）；
8. 无 staged writes / 人工确认；
9. 无执行身份、权限、审计。

---

## 3. 总体架构

```
┌────────────────────────────────────────────────────────┐
│ 应用层：Workshop / AIP / 外部 MCP                       │
└────────────────────────────────────────────────────────┘
                     ▲
┌────────────────────────────────────────────────────────┐
│ Automation 模块（独立）                                 │
│  - Automation 定义（trigger/condition/effects/policy）  │
│  - 运行历史（automation_run）                           │
│  - 监控 / 启停 / 手动运行                               │
└────────────────────────────────────────────────────────┘
                     ▲ 引用
┌────────────────────────────────────────────────────────┐
│ Ontology 层                                             │
│  Object Types / Link Types / Actions / Functions        │
└────────────────────────────────────────────────────────┘
                     ▲
┌────────────────────────────────────────────────────────┐
│ 数据层：数据集 / 对象存储（object_write / link_instance）│
└────────────────────────────────────────────────────────┘
```

运行时：

```
Trigger（cron/interval/object event/dataset）
   → 创建 run（chainId, depth）
   → Condition 求值（命中对象集）
   → Effect Executor（串行/并行、retry、fallback）
   → 写回对象 → 发出 change event（带 chainId/depth）
   → 下游 automation 触发（受 chain guard 约束）
   → 完成 run（状态/结果/耗时）
```

---

## 4. 概念模型

### 4.1 Automation

```ts
interface Automation {
  apiName: string;              // 唯一
  displayName: string;
  description?: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  condition?: RuleCondition;    // 现有声明式条件
  conditionFunction?: string;   // 兼容旧规则
  params?: Record<string, unknown>;
  effects: AutomationEffect[];  // 多个效果
  execution?: ExecutionPolicy;
  version: number;
}
```

### 4.2 Trigger

```ts
type AutomationTrigger =
  | { kind: 'schedule'; intervalSeconds?: number; cron?: string }
  | { kind: 'event'; on: 'object_write'; objectType: string }
  | { kind: 'object_change'; objectType: string; changeType: 'added' | 'modified' | 'removed' }
  | { kind: 'dataset'; table: string };
```

> Phase 1 只支持 schedule / event；`object_change`、`dataset` 在 Phase 2/3。

### 4.3 Condition

复用现有 `RuleCondition`：

```ts
type RuleCondition =
  | { kind: 'function'; function: string; params?: object }
  | { kind: 'property'; objectType: string; property: string; operator: string; value: unknown }
  | { kind: 'aggregate'; objectType: string; aggregation: string; property?: string; operator: string; value: number }
  | { kind: 'all' | 'any'; conditions: RuleCondition[] };
```

Phase 2 增加 change-aware 条件（如"本次修改把 status 从 active 改成 inactive"）。

### 4.4 Effect

```ts
type AutomationEffect =
  | { kind: 'action'; actionApiName: string; params?: object }
  | { kind: 'function'; function: string; params?: object }
  | { kind: 'notify'; channel: 'email' | 'webhook'; to?: string; template?: string }
  | { kind: 'webhook'; url: string; method?: 'POST' | 'PUT'; headers?: object };
```

每个 effect 可带：

```ts
interface EffectOptions {
  retry?: { maxAttempts: number; backoffMs: number };
  fallback?: AutomationEffect;   // 主 effect 失败时执行
  timeoutMs?: number;
  staging?: boolean;             // Phase 3：先暂存，人工确认后执行
}
```

### 4.5 Execution Policy

```ts
interface ExecutionPolicy {
  mode: 'sequential' | 'parallel';  // 多 effect 执行方式，默认 sequential
  maxRetries?: number;              // 全局默认重试
  timeoutMs?: number;
  chainDepthLimit?: number;         // 默认 5
  cooldownSeconds?: number;         // 同一 automation + 对象冷却
  staging?: boolean;                // Phase 3
}
```

### 4.6 Run

```ts
interface AutomationRun {
  id: string;
  automationApiName: string;
  triggerKind: string;
  triggerContext: object;     // 对象/rid/时间/事件
  status: 'running' | 'succeeded' | 'failed' | 'partial' | 'skipped';
  matchedCount: number;
  effectResults: EffectResult[];
  error?: string;
  chainId: string;
  depth: number;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
}
```

---

## 5. 数据模型

### 5.1 方案选择

| 方案 | 说明 | 结论 |
|---|---|---|
| A. 保留 `rule` 表，新增 `effects/execution` 列 | 改动小，兼容现有 3 条规则 | ✅ Phase 1 采用 |
| B. 新建 `automation` 表并迁移 | 模型干净，但要改 scheduler/repo/API/UI | Phase 3 可选 |

> 对外 API/UI 统一叫 **Automation**；数据库表 Phase 1 仍叫 `rule`，避免一次性迁移风险。

### 5.2 Phase 1 表变更

```sql
ALTER TABLE rule ADD COLUMN effects JSONB NOT NULL DEFAULT '[]';
ALTER TABLE rule ADD COLUMN execution JSONB NOT NULL DEFAULT '{}';
ALTER TABLE rule ADD COLUMN description TEXT;

CREATE TABLE automation_run (
  id            TEXT PRIMARY KEY,
  automation_api_name TEXT NOT NULL REFERENCES rule(api_name),
  trigger_kind  TEXT NOT NULL,
  trigger_context JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL,
  matched_count INT NOT NULL DEFAULT 0,
  effect_results JSONB NOT NULL DEFAULT '[]',
  error         TEXT,
  chain_id      TEXT,
  depth         INT NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  duration_ms   INT
);
CREATE INDEX idx_automation_run_api ON automation_run(automation_api_name, started_at DESC);
```

迁移：现有 `rule.actionApiName` → `effects = [{kind:'action', actionApiName}]`（启动时或迁移脚本回填）。

### 5.3 后续（Phase 2/3）

- `automation_run_effect`（如需按 effect 查询）；
- `automation_staged_write`（staged writes）；
- `automation_audit` / 权限表。

---

## 6. API 设计

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/s2/automations` | 列表（keyword/limit/offset） |
| GET | `/api/s2/automations/:apiName` | 详情 |
| POST | `/api/s2/automations` | 创建 |
| PUT | `/api/s2/automations/:apiName` | 更新 |
| DELETE | `/api/s2/automations/:apiName` | 删除 |
| POST | `/api/s2/automations/:apiName/enable` | 启用/禁用 |
| POST | `/api/s2/automations/:apiName/run` | 手动运行一次 |
| GET | `/api/s2/automations/:apiName/runs` | 运行历史（分页） |
| GET | `/api/s2/automation-runs/:id` | 单次运行详情 |

Phase 1 保留 `/api/s2/rules/*` 作为兼容别名，内部转发。

---

## 7. 运行时设计

### 7.1 触发

- `RuleScheduler` 轮询 schedule 规则（Phase 1 复用）；
- `onObjectWrite` → 事件规则（去抖）；
- Phase 2：writeObjectPatch 增加 `changeType`（insert/update）、`previousPatch`，支持 `object_change` 触发；
- Phase 3：同步/数据集更新事件 → `dataset` 触发。

### 7.2 条件求值

- 复用 `evaluateRuleCondition`（function/property/aggregate/all/any）；
- 返回 `{ matched, items }`；items 作为 effect 输入；
- 条件异常 → run 状态 failed，记录 error，不执行 effects。

### 7.3 Effect 执行

```
for effect of effects:
  if staged: 写 staged 记录，跳过实际执行（Phase 3）
  try:
    result = execute(effect)
    record success
  catch:
    if retry: retry with backoff
    if fallback: execute fallback
    record failure
if 全部成功 → succeeded
if 部分成功 → partial
if 全部失败 → failed
```

### 7.4 级联与循环

- 每次 run 生成 `chainId`；
- 由 action/function 写入对象时，事件携带 `chainId`、`depth+1`；
- 事件规则触发前检查：
  - `depth > chainDepthLimit` → skip + 记录 `skipped(chain_depth)`；
  - 同一 `(automation, chainId, objectRid)` 已执行过 → skip（幂等）；
- 事件去抖窗口保留，用于合并批量写入。

### 7.5 并发与冷却

- 同一 automation 默认串行（`running` 标记）；
- `cooldownSeconds` 内同一 automation + 同一对象只执行一次；
- 多 effect：`sequential` 默认，`parallel` 可选。

### 7.6 失败与回滚

- 不做跨 effect 事务回滚（与 Palantir 一致，action 写入即生效）；
- 失败通过 fallback/通知/run 记录暴露；
- Phase 3 可对 staged writes 做确认后批量应用。

---

## 8. UI 设计

### 8.1 导航

- 资源区 `Rules` → **Automation**（`/s2/automations`，`/s2/rules` 重定向）；
- 与 Object Types / Link Types / Functions / Actions 并列。

### 8.2 列表页

列：

| 列 | 内容 |
|---|---|
| Automation | apiName + displayName |
| 启用 | switch |
| 触发 | 周期 3600s / 写入 Employee |
| 条件 | 函数名 / 表达式摘要 |
| 效果 | `1 个动作` / `动作 + 通知` + 展开 |
| 最近运行 | 状态 + 时间（成功/失败/部分） |
| 操作 | 运行、编辑、删除 |

### 8.3 编辑页（Drawer/Tabs）

1. **基本信息**：apiName、显示名、描述、启用；
2. **触发**：schedule（interval/cron，Phase 2 cron）、event（objectType）、object_change（Phase 2）；
3. **条件**：函数 / 表达式构建器（复用现有递归组件）；
4. **效果**：列表，可添加 action/function/notify/webhook；每个 effect 可配参数、重试、fallback；
5. **执行策略**：串行/并行、超时、链深度、冷却；
6. **预览**：命中对象表格（复用现有）；
7. **运行历史**：最近 N 次 run（状态、命中、effect 结果、耗时）。

### 8.4 运行历史页

- 过滤：automation、状态、时间；
- 列表：runId、automation、触发、状态、命中数、effects、耗时；
- 详情：每个 effect 的输入/输出/错误、chainId/depth。

---

## 9. 迁移方案

### Phase 1（兼容优先）

- `rule` 表加列，回填 `effects`；
- API 新增 `/automations`，内部复用 rule repo；
- UI 菜单改名，列表/编辑沿用现有逻辑 + 效果数量展示；
- 新增 run 记录：scheduler/event 执行时写 `automation_run`；
- 现有 3 条规则零改动。

### Phase 2

- 多 effect 执行器、retry/fallback、notify/webhook；
- chain guard；
- changeType 事件；
- 运行历史 UI。

### Phase 3

- staged writes、审批；
- 权限/执行身份/审计；
- dataset 触发、监控/链路可视化；
- 表重命名为 `automation`（可选）。

---

## 10. 测试策略

| 层级 | 用例 |
|---|---|
| 单元 | 条件求值、effect 重试/fallback、chain guard、冷却 |
| 集成 | schedule 运行、event 触发、A→B 级联、循环被阻止、多 effect 部分成功 |
| 回归 | 现有 3 条规则输出不变 |
| UI | 列表、编辑、预览、运行历史、启停 |
| 性能 | 批量对象触发（100/1000）、链深度上限 |

关键场景：

1. A 写 Alert → B 监听 Alert 执行通知（成功）；
2. A 写对象触发 B，B 又写回 A 监听对象（循环被 depth 阻止）；
3. effect 失败 → retry → fallback → run=partial/failed；
4. 同一对象短时间多次写入 → 冷却/去抖只执行一次。

---

## 11. 里程碑（估算）

| 阶段 | 内容 | 估算 |
|---|---|---|
| M1 | 独立菜单 + 模型加列 + run 历史 + 列表/编辑展示 | 1~2 天 |
| M2 | 多 effect + notify/webhook + retry/fallback + chain guard | 3~5 天 |
| M3 | change-aware 触发 + staged writes + 权限/审计 + 监控 | 1~2 周 |

---

## 12. 风险与开放问题

### 风险

1. **循环级联**：多 effect + 事件触发容易打转，必须先有 chain guard；
2. **兼容**：现有规则不能断，Phase 1 只加列不改语义；
3. **事件语义**：当前 writeObjectPatch 不区分 insert/update，change-aware 触发需要改事件模型；
4. **事务边界**：effect 之间无事务，失败可能留下部分写入；
5. **权限**：无执行身份，自动化以平台身份运行，审计困难。

### 待确认问题

1. 数据库表是否 Phase 1 就改名为 `automation`，还是保留 `rule`？
2. Phase 1 是否就要支持多 effect / 通知 / Webhook，还是先只做 run 历史？
3. 是否需要 staged writes（人工确认后写入）作为第一期能力？
4. 运行历史保留多久？是否需要导出/审计？
5. 自动化执行身份：平台身份，还是配置一个"服务账号"？
6. 是否需要 cron 表达式（而不只是 intervalSeconds）？

---

## 13. 实施记录（2026-11-26）

### 13.1 已确认的决策

1. 数据库表直接由 `rule` 改名为 `automation`（`automation_run` 为运行历史）；
2. 支持多 effect：action / function / notify(inapp|webhook) / webhook；
3. staged writes（人工确认后写入）暂不做；
4. 运行历史永久保留，提供 UI 审计/维护；删除 automation 不删除历史（去掉 FK）；
5. 执行身份：平台身份；
6. 支持 5 字段 cron（Palantir Automate 的 time condition 支持 cron）。

### 13.2 已实现

- 表：`rule` → `automation`，新增 `effects` / `execution` / `description`；旧规则自动回填 effects；
- `automation_run`：每次评估记录状态、命中数、每个 effect 结果、耗时、错误；
- 多 effect 执行器：串行/并行、重试、fallback（API 支持；UI 暂只暴露串行/重试/超时）；
- notify(inapp)：写 `notification` 表；notify(webhook)/webhook：HTTP POST；
- cron：`cron.ts` 5 字段解析 + 调度器按分钟匹配；
- API：`/api/s2/automations` CRUD / run / runs / automation-runs/:id / notifications；
- UI：菜单 `Automation`、效果列表编辑、cron 输入、执行策略、运行历史弹窗；
- **级联防护**：chainId/depth/path 随对象写入事件传递，检测循环（path 重复）与深度超限；
  - AsyncLocalStorage 在 effect 执行期间携带链路，`writeObjectPatch` 写入事件附带 chain；
  - 拦截时写 `automation_run(status=skipped, error=chain_cycle|chain_depth)`；
  - 同一 automation + 对象支持 `cooldownSeconds` 冷却。

### 13.3 实测

| 用例 | 结果 |
|---|---|
| 现有 3 条规则手动运行 | ✅ 全部 succeeded |
| 多 effect（inapp + webhook） | ✅ succeeded，2 个 effect 都执行 |
| webhook 失败 | ✅ run=partial，attempts/error 记录 |
| cron `* * * * *` 调度 | ✅ 10s tick 内自动执行 |
| 删除 automation | ✅ 运行历史保留 |
| 运行历史 UI | ✅ 列表/弹窗可查看 |
| A→B 链路 | ✅ B 的 run 携带 A 的 chainId，depth=1 |
| 自循环 A→A | ✅ 第二次执行被 skipped，error=chain_cycle |
| 深度限制 chainDepthLimit=0 | ✅ 递归执行被 skipped，error=chain_depth |

### 13.4 仍待实现

1. change-aware 触发（新增/修改/删除、字段变化）；
2. dataset 触发；
3. staged writes / 人工确认；
4. 权限、执行身份、审计；
5. 通知中心 UI（当前 inapp 通知仅 API/DB 可见）；
6. effect 参数/重试/fallback 的可视化编辑（当前 API 支持，UI 仅基础字段）。
