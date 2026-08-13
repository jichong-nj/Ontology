# 通用规则引擎（Rule Engine）重构设计

> 目标：把当前"告警专属"的 `alert_rule` 机制，抽象为"当满足条件就执行动作"的通用自动化规则（Automation Rule），
> 与 Palantir Foundry/AIP 的 **Watchdog + Action Type + Schedule** 三者同构。
> 本文件为设计基线，Step 1 为概念解耦（零 DB 迁移），Step 2 为能力扩展（事件触发 + 多 effect 动作）。

---

## 1. 现状与问题

当前 `alert_rule` 把两个应分开的概念焊在一张表里：

| 概念 | 含义 | 现状 |
|---|---|---|
| **何时触发一个动作** | 通用编排能力（定时周期 + 条件函数 + 落地动作） | 已有，但命名为 `alert_rule`，让人误以为只为告警 |
| **生成告警** | 众多动作里的一种 | `actionApiName` 硬编码指向 `createDimissionAlert`，落点对象写死 `Alert` |

证据：
- `ActionType.effect: { kind: 'function' | 'write'; ref }`（`ontology-core/src/types.ts`）**已是通用动作模型**，动作可指向任意函数，不限于告警。
- `AlertScheduler` 本质是"定时跑条件函数 → 拿命中列表 → 调动作函数"的通用引擎，只是名字与 UI 把它限制在告警垂直场景。

结论：**引擎已经是通用的，只是命名与 UI 限制了它。** 离职风险评分、数据质量校验、到期提醒、自动归档等"满足条件就执行动作"的诉求，都能复用，不应各自造轮子。

---

## 2. 目标抽象（对齐 Palantir）

Palantir Foundry/AIP 的对应物分三层：

| 概念 | Palantir | 本平台（目标） |
|---|---|---|
| **Schedule / Trigger** | Schedule (cron / 流式事件) | `Rule.trigger`: `{kind:'schedule',intervalSeconds}`（Step1）/ `{kind:'event',...}`（Step2） |
| **Function（条件）** | Ontology Functions（编译进本体，可在线编辑） | `OntologyFunction.body`（已实现在线编辑 ✅） |
| **Action（落地）** | **Action Types**：参数化、带校验、可附通知/邮件/审批/写入 | `ActionType.effect`（Step1 仅 function/write；Step2 扩展 notify/approval 等） |
| **规则编排** | **Watchdog / Object Health Checks**："当 X 满足条件，跑某 Action" | `AutomationRule`：引用条件函数 + 引用动作，规则本身不绑定"告警"语义 |

**关键抽象**：
- **Action Type 是一等公民，与"告警"正交。** Action 可以是写对象、发通知、起审批。告警仅是 Action 的一个副作用类型，不是必选项。
- **Watchdog（健康规则）** 是对"出现什么情况就做什么动作"的直接对应物：引用 Function 做条件、引用 Action 做响应，规则不关心动作是啥。
- **Schedule 与 Trigger 解耦**：规则可定时跑（cron），也可由对象写入事件触发（Step 2）。

---

## 3. 目标数据模型（Step 2 完整形态，Step 1 先做子集）

```ts
interface AutomationRule {
  apiName: string;
  displayName: string;
  enabled: boolean;
  // 触发器：本期仅实现 schedule；event 触发留扩展点
  trigger:
    | { kind: 'schedule'; intervalSeconds: number }
    | { kind: 'event'; on: 'object_write'; objectType: string; conditionProperty?: string };
  conditionFunction: string;   // 原 functionApiName；返回 { flagged: [{rid, ...}] }
  actionApiName: string;       // 不变；动作不再假定是告警
  params: Record<string, unknown>;  // 传给 conditionFunction
  targetObjectType: string;    // 原 alertObjectType；动作的落点对象（Alert 只是其中一种）
  version: number;
}
```

**语义收敛**：
- `Alert` 对象的生成**下沉为 `createDimissionAlert` 这个 Action 的职责**；规则本身不知道自己会产生告警。
- 这样新增"数据质量规则→写质检对象""到期规则→发通知"都不用改引擎。

---

## 4. 实施步骤

### Step 1（概念提升，零 DB 迁移）—— 已完成
- 调度器类 `AlertScheduler` → `RuleScheduler`（文件 `rule-scheduler.ts`），内部不假定告警，逻辑不变。
- 路由 `/api/s2/alert-rules` → `/api/s2/rules`（后端 + 前端 api 同步）；当时底层仍读 `alert_rule` 表，**不改表名、不改列名**，规避迁移风险（Step 2 才改名）。
- 前端"告警中心" → "规则中心"概念文案通用化，去掉告警专属暗示；保留 Alert 列表（仍是当前 action 产物）。
- `definitions.ts` 的 `alertRules` 补注释强调"通用规则，动作不限于告警"；`ActionType.createDimissionAlert` 明确其职责是"生成 Alert 对象"。
- **行为完全不变，仅命名与概念层解耦。**

### Step 2（能力扩展）—— 已完成（2026-08-13）
- ✅ 表 `alert_rule` → `rule`；列 `alert_object_type` → `target_object_type`、`function_api_name` → `condition_function`；新增 `trigger` JSONB 列（`schedule` / `event`），支持对象写入事件触发（迁移脚本：`packages/ontology-core/sql/migrate-alert-rule-to-rule.sql`）。
- ✅ `AutomationRule` 类型替代 `AlertRule`；`trigger` 取代单一 `intervalSeconds`，使触发方式与条件/动作正交。
- ✅ `RuleScheduler` 适配 `trigger`：schedule 类按 `intervalSeconds` 节流轮询，event 类由 `handleObjectWrite(objectType, rid, patch)` 入口驱动（实际接线由各业务层挂载）。
- ✅ `ActionType.effect` 扩展 `notify` / `approval` 种类（对接通知/审批系统，预留）。
- ✅ 前端规则中心支持选择 trigger 类型（schedule 周期 / event 监听对象类型）与查看/编辑；保留删除确认。
- ⏳ 后续：通知/审批系统的实际对接（effect=notify/approval 的落地实现）、event 触发器与 object_write 写入链路的实际挂载。

### Step 3（体验与治理增强）—— 已完成（2026-08-13）
- ✅ **Action 内嵌校验规则（preconditions）**：`ActionType` 新增 `preconditions`（对标 Palantir Action 自带 rules）。每条声明式校验（`requiredProperty`/`minValue`/`maxValue`/`notEmpty`）作用于被动作处理的命中对象；调度器 `RuleScheduler.evaluateRule` 在调用 Action 前逐条校验，不满足者跳过并计入 `skippedByPrecondition`。`action_type` 表新增 `preconditions` JSONB 列（迁移脚本 `migrate-action-preconditions.sql`）。
- ✅ **可视化 Rule logic（降低 FDE 门槛）**：规则中心编辑抽屉的条件参数由裸 JSON 改为**按所选函数 inputs 自动生成的结构化表单**（数字/文本控件），并支持「预览命中对象」（调用函数 invoke 展示将命中的对象 rid），保留「高级 JSON」双向编辑入口。前端还透明展示所选 Action 的内嵌校验规则。
- 端到端验证：precondition 正常路径 `flagged=17, skipped=0, actionsInvoked=17`；属性缺失场景 `skipped=17, actionsInvoked=0`。

---

## 5. 风险与回退
- Step 1 不触达数据库 schema，可通过回退代码立即还原，无数据风险。
- Step 2 涉及 schema 变更，已提供手动 psql 迁移脚本（`packages/ontology-core/sql/migrate-alert-rule-to-rule.sql`，项目约定：DB 迁移手动应用增量），脚本保留旧表数据等价迁移（interval_seconds → trigger.schedule.intervalSeconds）。
- Step 3 仅新增 `action_type.preconditions` 列（ADD COLUMN，无删除）与前端可视化；回退只需撤销列与代码，无数据丢失风险。

