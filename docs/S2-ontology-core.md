# S2 Ontology 内核子系统 — 需求文档

> 对标 Palantir：Ontology（Object Types / Link Types / Action Types / Functions / Interfaces）
> 定位：**本平台的核心与单一事实来源**。所有上层子系统（分析、应用、AI、治理）都读写同一份 Ontology 元数据。

## 1. 概述

S2 是平台的语义中枢。它把现实世界的实体与关系建模为**对象类型（Object Type）**、**关系类型（Link Type）**、**动作类型（Action Type）** 与**函数（Function）**，并以"定义即数据"的方式版本化管理。S1 提供的数据映射被 S2 引用为对象实例的来源。

设计原则：**元数据驱动、版本化、可复用**。所有建模元素都是带 `version` 的记录，被 S3/S4/S5/S6 共同消费，保证全平台语义一致。

## 2. 边界与依赖

### 上游
- **S1 数据接入与映射**：提供 `ObjectMapping`，声明对象实例来自哪个源。
- **S6 权限与治理**：对象/属性的可见性受 S6 策略约束。

### 下游 / 被依赖
- S3 分析、S4 应用、S5 AI、S6 治理——全部依赖 S2 的元数据。
- 存储：**元数据统一存 PostgreSQL（邻接表表达图拓扑）**，不引入独立图库。详见 `S0-storage-design.md`。

### 不在范围内
- ❌ 对象实例的批量计算（由 S1 映射 + 查询层处理，实例数据在数据中台）。
- ❌ UI 渲染逻辑（由 S3/S4 负责）。

## 3. 一级功能需求

### F2.1 对象类型建模
**用户故事**：作为领域建模师，我想定义一个"客户"对象类型，包含姓名、注册时间等属性，并关联到源映射。

**输入**：`apiName`、`displayName`、`properties`、`implementsInterfaces`、关联 `ObjectMapping`。
**输出**：`ObjectType` 记录（带 `version`）。

**规则**：
- `apiName` 全局唯一、不可变（改名=新建版本）。
- 属性变更走版本管理，旧版本可追溯。
- 必须至少关联一个 S1 映射才能实例化。
- **发布门禁（与 S1 协同）**：对象类型发布到可用状态（非 `draft`）时，其关联的所有 `ObjectMapping` 的 `qualityStatus` 不得为 `failed`；严重不一致由 S1 标记，S2 在发布环节校验拦截（责任方：S1 负责质量标记与阻断信号，S2 负责实例化/发布时校验）。

### F2.2 关系类型建模
**用户故事**：作为建模师，我想定义"客户-下单-订单"的关系，让对象间可互相关联分析。

**输入**：`sourceType`、`targetType`、`cardinality`。
**输出**：`LinkType` 记录。

**规则**：
- 两端必须是已存在的 `ObjectType`。
- 支持多对多、一对多基数声明。
- 关系实例来源 `instanceSource`：
  - `'source'`：实例来自数据中台源表，需在 S1 额外配置关系映射（经 `link_instance` 缓存/索引，不复制全量）；
  - `'managed'`：实例由本平台在 `link_instance` 表中维护（如用户标注的关联）。

### F2.3 属性与派生属性
**用户故事**：作为分析师，我希望某些属性是从其他属性计算得出的（如"客单价=总金额/订单数"），无需重复存储。

**输入**：基础属性 + 派生定义（`reducer` 或表达式）。
**输出**：`PropertyDef`，标记为 `derived`。

**规则**：
- 派生属性只读，由引擎计算，**不落库**。
- 计算方式二选一（见 `PropertyDef`）：`reducerFn` 引用一个 `OntologyFunction.apiName`（推荐，可复用、可沙箱），或 `reducer` 内联安全表达式。二者至少其一；
- 引用函数时，函数的 `outputs` 须与属性 `type` 一致；类型校验在建模时执行。

### F2.4 接口多态建模（含行为/方法）
**用户故事**：作为建模师，我想定义"可定位（Locatable）"接口，让"门店"和"仓库"都实现它，从而统一建模地理相关能力；并且接口能声明行为（如 `getCoordinates()`），由各实现对象提供不同实现，供 S5 智能体/S2 函数多态调用。

**输入**：`Interface` 定义（属性集合 + 方法签名 `InterfaceMethod[]`）。
**输出**：对象类型 `implements` 接口，并为每个接口方法绑定一个 `OntologyFunction` 实现。

**规则**：
- 实现接口的对象必须补齐接口要求的属性。
- 接口支持被多对象类型共享（多态）。
- 接口方法只声明签名（inputs/outputs），**不写逻辑**；具体逻辑由各实现对象的 `OntologyFunction` 提供，记录在 `interface_method_impl`。
- 调用方按"对象实例 → 其对象类型 → 实现的接口方法 → 绑定的 OntologyFunction"解析，实现运行时多态。

### F2.5 动作类型与治理约束
**用户故事**：作为业务负责人，我想定义一个"审批订单"动作，包含参数与校验规则，约束谁能执行、执行后果是什么。

**输入**：`parameters`、`validationRules`、`effect`（调用 Function / 写回映射源）。
**输出**：`ActionType` 记录。

**规则**：
- 动作执行受 S6 权限约束。
- 校验失败阻断执行，并留审计（见 S6）。
- 动作效果 `effect`：`function` 调用一个 `OntologyFunction`；`write` 写入**本体侧可写表 `object_write`**（见 S0），**绝不写回只读的映射源端**（源端只读，见 S1）。

### F2.6 函数（业务逻辑）
**用户故事**：作为开发者，我想用 TypeScript/Python 编写复杂业务逻辑，供动作或派生属性调用。

**输入**：`language`、`entry`、`inputs`、`outputs`。
**输出**：`OntologyFunction` 记录。

**规则**：
- 函数在隔离沙箱中执行，限制资源与 IO。
- 可被 Action / 派生属性 / S5 智能体调用。
- **运行时分期决策**：第一期 `FunctionSandbox` 仅执行 `language: 'typescript'`；`language: 'python'` 仅保留 `OntologyFunction.language` 枚举占位与 `resolve` 可见性，`invoke` 暂不可执行（沙箱对 python 返回"未实现"）。第二期再评估接入 Python 进程隔离运行时（如独立 worker / gRPC 子进程）。

### F2.7 接口方法运行时引擎（多态调用）
**用户故事**：作为 S5 智能体或 S2 调用方，我想对一个对象实例调用其接口方法（如 `Locatable.getCoordinates()`），由平台按对象类型自动分派到正确的 `OntologyFunction` 实现并执行，无需调用方关心具体类型。

**输入**：`MethodInvocationContext`（对象类型 + 实例标识 + 接口/方法 + 入参）。
**输出**：`MethodInvocationResult`（执行结果 / 实际分派的 Function / 错误）。

**规则**：
- 引擎先经 `MetadataRepository.resolveInterfaceMethod` 做多态解析，再经 `FunctionSandbox` 隔离执行。
- 解析失败（未绑定实现）返回明确错误，不静默 fallback。
- 执行全程受 S6 权限约束（调用前校验调用方对该对象/方法的权限）。
- S5 智能体可仅调用 `resolve` 做步骤规划，再决定是否 `invoke` 执行。

### F2.8 通用自动化规则（规则引擎 / 可观测）
**用户故事**：作为治理运营，我想配置一条「自动化规则」——周期性（或事件触发，Step 2）调用某个**可配置的条件评估函数**判断对象是否满足条件；当满足条件时，调用某个**可配置的动作**落地（如生成告警对象、写属性、发通知），从而把"评估 + 发现 + 落地"自动化。

**输入**：`rule`（通用规则存储）（`apiName`、`enabled`、`trigger`、`conditionFunction`、`actionApiName`、`params`、`targetObjectType`）。`trigger` 支持 `schedule`（周期轮询）与 `event`（对象写入事件触发，Step 2 新增）。
**输出**：在 `object_write` 写入动作产物对象（当前为 `Alert`，但动作可扩展为其他类型 / 通知 / 审批）。

**规则**：
- `conditionFunction` 与 `actionApiName` 均通过 `apiName` 解耦引用，逻辑与调度分离，可热替换（对标 Foundry Ontology 的 Functions + Actions + Scheduling，以及 Watchdog + Action Type）。
- 调度器 `RuleScheduler` 按 `trigger` 决定触发方式：schedule 类按 `intervalSeconds` 节流轮询；event 类由对象写入事件 `handleObjectWrite` 驱动；`enabled=false` 的规则被跳过。
- 条件函数返回形如 `{ flagged: [{rid, ...}] }` 的命中集合；调度器提取命中项后调用 `actionApiName` 落地。告警仅是 `createDimissionAlert` 这一 Action 的产物，规则本身不绑定"告警"语义。
- 源端只读，动作产物只写本体可写侧 `object_write`。
- 详见 `docs/RULE-ENGINE-DESIGN.md`。

### 实现状态（截至 2026-08-11）
- ✅ 派生属性：支持 `countLinks`（部门人数）、`avgLinks`（部门平均上班时间）算子，配置即生效（`Department.employeeCount` / `Department.avgWorkHours`）。
- ✅ 离职风险函数 `evaluateDimissionRisk`：按部门计算平均上班时间，低于阈值（默认 80%）置 `Employee.dimissionRisk=true`。
- ✅ 告警规则 `dimissionRiskRule` + 动作 `createDimissionAlert`：后台定时（60s）巡检，命中后生成 `Alert` 对象（已实现端到端，含 9 项 e2e 测试）。
- ✅ 派生属性 API：`GET /api/s2/object-types/:apiName/derived/:propApiName?rid=`
- ✅ 函数触发 API：`POST /api/s2/functions/:fnApiName/invoke`
- ✅ 规则 API：`GET /api/s2/rules`、`POST /api/s2/rules`、`POST /api/s2/rules/run`、`GET /api/s2/alerts`

## 4. 接口契约

```typescript
// packages/ontology-core/src/types.ts

export type PropertyType =
  | 'string' | 'integer' | 'float' | 'boolean'
  | 'date' | 'timestamp' | 'geopoint' | 'array' | 'object';

export interface PropertyDef {
  apiName: string;
  displayName: string;
  type: PropertyType;
  required: boolean;
  derived?: boolean;
  reducer?: string;        // 派生表达式
  sourceMapping?: string;  // 关联 S1 fieldMapping
}

export interface ObjectType {
  apiName: string;
  displayName: string;
  description?: string;
  properties: PropertyDef[];
  implementsInterfaces: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinkType {
  apiName: string;
  displayName: string;
  sourceType: string;
  targetType: string;
  cardinality: 'one-to-one' | 'one-to-many' | 'many-to-many';
  version: number;
}

export interface InterfaceDef {
  apiName: string;
  displayName: string;
  properties: PropertyDef[];
  methods: InterfaceMethod[];   // 接口行为：由实现对象各自提供实现
  version: number;
}

// 接口方法定义：声明签名，实现对象必须提供同名 OntologyFunction 作为实现
export interface InterfaceMethod {
  apiName: string;
  displayName: string;
  inputs: ActionParameter[];
  outputs: PropertyType[];
  implementedBy: 'object-function';
}

export interface ActionParameter {
  name: string;
  type: PropertyType;
  required: boolean;
}

export interface ActionType {
  apiName: string;
  displayName: string;
  kind?: 'standard' | 'llm';
  parameters: ActionParameter[];
  validationRules: string[];
  effect: { kind: 'function' | 'write'; ref: string };  // write: 落本体可写侧 object_write，不写回只读源端
  version: number;
}

export interface OntologyFunction {
  apiName: string;
  displayName: string;
  language: 'typescript' | 'python';
  entry: string;
  inputs: ActionParameter[];
  outputs: PropertyType[];
  version: number;
}

// ---- 存储抽象（统一 PG，未来可切换实现）----
// 内核只依赖此接口，不写具体 SQL；当前实现为 PostgreSQL 邻接表。
export interface MetadataRepository {
  // 对象类型
  listObjectTypes(): Promise<ObjectType[]>;
  getObjectType(apiName: string): Promise<ObjectType | null>;
  createObjectType(def: ObjectType): Promise<void>;
  // 关系类型
  listLinkTypes(): Promise<LinkType[]>;
  createLinkType(def: LinkType): Promise<void>;
  // 接口与实现
  listInterfaces(): Promise<InterfaceDef[]>;
  setObjectInterface(objectApi: string, interfaceApi: string): Promise<void>;
  // 接口方法实现绑定（多态）：对象类型 + 接口方法 → 具体 OntologyFunction
  bindInterfaceMethod(objectApi: string, interfaceApi: string, methodApi: string, functionApi: string): Promise<void>;
  // 解析多态调用：给定对象类型与接口方法，返回应执行的 OntologyFunction
  resolveInterfaceMethod(objectApi: string, interfaceApi: string, methodApi: string): Promise<string | null>;
  // 影响分析（递归 CTE）：返回实现某接口的所有对象类型
  getObjectsImplementing(interfaceApi: string): Promise<string[]>;
  // 动作 / 函数
  createAction(def: ActionType): Promise<void>;
  getAction(apiName: string): Promise<ActionType | null>;
  createFunction(def: OntologyFunction): Promise<void>;
  // 自动化规则（通用「满足条件→执行动作」，schedule/event 触发）
  createRule(def: AutomationRule): Promise<void>;
  listRules(): Promise<AutomationRule[]>;
}

// ---- 接口方法运行时引擎契约 ----
export interface MethodInvocationContext {
  objectType: string;        // 对象类型 apiName（决定多态分派）
  objectRid: string;         // 具体对象实例标识
  interfaceApi: string;      // 接口 apiName
  methodApi: string;         // 方法 apiName
  args: Record<string, unknown>;
}

export interface MethodInvocationResult {
  ok: boolean;
  value?: unknown;
  error?: string;
  executedFunction?: string; // 实际分派到的 OntologyFunction（可追溯）
}

export interface FunctionSandbox {
  register(fnApiName: string, fn: TsFn): void;
  execute(fnApiName: string, args: Record<string, unknown>): Promise<unknown>;
}

// 自动化规则：通用「满足条件→执行动作」。由 trigger 决定 schedule/event 触发，
// conditionFunction 评估条件，actionApiName 落地（写对象/通知/审批等）。
export interface AutomationRule {
  apiName: string;
  displayName: string;
  enabled: boolean;
  trigger: RuleTrigger;      // {kind:'schedule',intervalSeconds} | {kind:'event',on,objectType}
  conditionFunction: string;   // 可配置的条件评估函数
  actionApiName: string;     // 可配置的落地动作
  params?: Record<string, unknown>;
  targetObjectType: string;   // 动作落点对象类型（写类动作使用，如 Alert）
  version: number;
}

export interface InterfaceMethodEngine {
  invoke(ctx: MethodInvocationContext): Promise<MethodInvocationResult>;
  resolve(ctx: MethodInvocationContext): Promise<string | null>;
}

// REST 契约（示意）
// GET    /api/s2/object-types
// POST   /api/s2/object-types
// GET    /api/s2/object-types/:apiName
// POST   /api/s2/object-types/:apiName/versions  新建版本
// GET    /api/s2/link-types
// POST   /api/s2/link-types
// GET    /api/s2/interfaces
// POST   /api/s2/actions
// POST   /api/s2/functions
// GET    /api/s2/object-types/:apiName/derived/:propApiName?rid=
// POST   /api/s2/functions/:fnApiName/invoke
// GET    /api/s2/alert-rules
// POST   /api/s2/alert-rules/run
// GET    /api/s2/alerts
```

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| Object Types / Link Types | ✅ 完整保留 |
| Properties / Derived Properties | ✅ 保留，派生走沙箱表达式，不落库 |
| Interfaces（多态） | ✅ 保留 |
| Action Types（含治理约束） | ✅ 保留核心，复杂编排留接口 |
| Functions（TS/Py） | ✅ 保留，沙箱化执行 |
| Ontology 版本与迁移工具 | ⚠️ 保留基础版本化，复杂迁移工具裁剪 |
| 多租户 Ontology 隔离 | ⚠️ 暂以 S6 权限做逻辑隔离，不做物理多租户 |
| 元数据专用/图存储 | ⚠️ 统一 PG 邻接表，不引入独立图库（见 S0） |

> 核心原则：S2 是**不可妥协的核心**，尽量完整；仅在"运维型工具链"（迁移、多租户、独立图库）上做裁剪。
