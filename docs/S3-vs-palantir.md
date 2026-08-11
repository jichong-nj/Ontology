# 对标 Palantir Foundry Ontology（公开资料）实现差距分析

> 依据 Palantir 公开资料（Foundry Ontology 五原语 / 三层级：Semantic、Kinetic、Dynamic；
> Action Types、Functions、Interfaces、AIP Logic、OSDK、Ontology MCP 等）对当前实现做差距盘点。
> 结论先行：**核心建模能力（对象/关系/派生/动作/函数/接口）与原语一一对应，方向正确；
> 差距集中在"生产级完备性"而非"架构概念"**——即 Palantir 把这些原语做成平台能力，
> 而我们目前是单租户、内存沙箱、单库落地的可运行原型。

## 1. 原语映射对照（已实现 vs Palantir）

| Palantir 原语 | 我们的实现 | 状态 | 备注 |
|---|---|---|---|
| Object Types | `ObjectType` + `object_write`（可写侧）/ 源表（只读侧） | ✅ 对应 | 区分只读源端与本体制可写侧，符合"源端只读、动作不回写"约束 |
| Properties / Derived Properties | `PropertyDef.derived` + `reducer`（`countLinks`/`avgLinks`） | ✅ 对应 | Palantir 派生属性同样由函数/聚合计算、不落库；我们已实现 avgLinks 聚合对端属性 |
| Link Types | `LinkType` + `link_instance` | ✅ 对应 | 仅支持 one-to-one/one-to-many/many-to-many（缺 many-to-one，因源外键语义） |
| Action Types | `ActionType` + `effect{kind:function\|write}` | ⚠️ 部分 | 缺 `validationNotifications`、`formedFrom`、`parameters` 的运行时校验与回填 |
| Functions | `OntologyFunction` + `TypeScriptFunctionSandbox` | ⚠️ 部分 | 仅 TS 可执行；缺 Python 运行时、缺"函数即本体一等公民"的 UI/版本治理 |
| Interfaces | `InterfaceDef` + 接口方法 | ✅ 框架在 | 多态运行时引擎在，但无实际接口/实现样例落地 |
| Scheduling / Automation | `AlertRule` + `AlertScheduler` | 🆕 新增 | Palantir 由 Pipeline/Action 调度或 AIP Automate 承担；我们用规则表+定时轮询实现闭环 |

## 2. 关键差距（按重要性排序）

### G1. 派生属性的"实时性"与 Palantir 有差异
- Palantir 派生属性是**查询时计算**（物化视图/函数式），始终最新。
- 我们 `avgWorkHours` 在 `computeDerived` 时实时算（✅），但离职风险标记 `dimissionRisk`
  是**被函数写入 `object_write` 的快照值**，不会随 `workHours` 变化自动失效。
- **问题**：快照属性与源数据可能不一致（脏读风险）。
- **建议**：要么把 `dimissionRisk` 也做成派生属性（`expression`/`function` 算子），要么在源数据
  变更时触发函数重算（需要 CDC / 写入钩子，目前没有）。

### G2. 告警调度器是"轮询"而非"事件驱动"
- Palantir 的自动化通常由数据更新事件或 Pipeline 调度驱动（事件驱动）。
- 我们是 `setInterval` 轮询 + 节流，**新增/变更实例后最多延迟一个 `intervalSeconds` 才发现**。
- **建议**：增加"实例写入即触发"钩子（`writeObjectPatch` 后发布事件），让规则可订阅事件而非纯轮询。

### G3. 函数沙箱安全边界不足
- Palantir Functions 运行在强隔离（受限 IO、受限资源、禁止任意网络/文件系统）。
- 我们 `TypeScriptFunctionSandbox` 用 `new Function` 动态执行，**未限制 IO/资源/网络**，且无超时熔断。
- **风险**：一个恶意/失控函数可拖垮服务；生产不可用。
- **建议**：加执行超时、禁用 `require`/网络、资源配额，或迁入独立 worker 进程（已是 F2.6 二期规划）。

### G4. Action 的治理与回填缺失
- Palantir Action 支持：`validationNotifications`（提交前校验并回显）、`parameters` 默认值/级联、
  `formedFrom`（从对象预填）、`webhooks`、`versioned history`。
- 我们 Action 仅有 `effect{kind,ref}`，**无校验、无表单回填、无审计历史**。
- **建议**：`write` 类动作应支持字段级校验与审计；`function` 类动作应可被 Workshop 式表单触发。

### G5. 多租户 / 权限 / 版本治理
- Palantir 是强多租户 + 列级权限（S6）+ 对象版本时间旅行。
- 我们单库、`object_type.version` 仅占位、无权限校验、无时间旅行。
- **建议**：权限与版本是"企业级"底线，原型阶段可接受，但需在设计文档明确"不在范围内"。

### G6. 可观测与编排
- Palantir 有 Action 执行历史、函数调用链路、AIP Logic 可视化编排。
- 我们仅有 `AlertScheduler` 的 `AlertEvaluationResult` 返回，无持久化执行日志/链路追踪。

## 3. 已做到位、且对标正确的部分
1. **源端只读、本体可写侧分离**：`object_write` 不回写 S1 映射源，符合 Palantir "Ontology 是操作层、源是只读真相源"的约束。
2. **Action/Functions 解耦 + 规则化调度**：`AlertRule` 仅引用 `functionApiName`/`actionApiName`，逻辑与调度分离——与 Foundry "Action 调用 Function、Schedule 驱动"一致。
3. **派生属性不落库、聚合对端**：`avgLinks` 跨 `link_instance` 聚合对端 `workHours`，是 Palantir 派生属性的标准形态。
4. **告警对象落本体可写侧**：生成 `Alert` 实例而非改源数据，符合"动势层(Kinetic)产生新对象"的语义。

## 4. 优先级建议
- P0（正确性）：G1 派生/快照一致性、G3 沙箱超时与隔离。
- P1（生产化）：G2 事件驱动、G4 Action 校验/回填、G6 执行日志。
- P2（企业级）：G5 多租户/权限/版本、Python 运行时、可视化编排。

> 一句话：架构概念对齐 Palantir 无问题；问题在"原型 → 生产"的工程化完备度，
> 尤其函数隔离、事件驱动、Action 治理三点。
