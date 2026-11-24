// S2 Ontology 内核 — 核心类型与版本化模型
// 被 S1~S6 所有子系统复用，是平台的单一事实来源（"定义即数据"）。

export type PropertyType =
  | 'string' | 'integer' | 'float' | 'boolean'
  | 'date' | 'timestamp' | 'geopoint' | 'array' | 'object';
// 注：geopoint 类型保留供接口/数据建模使用；地图可视化已裁剪（S3 不含 Map），仅作为坐标数据承载。

// 实例查询过滤条件（对齐 Palantir properties.{prop}.{operator} 思路）
export type InstanceFilterOperator =
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'isNull';

export interface InstanceFilter {
  property: string;
  operator: InstanceFilterOperator;
  value?: unknown; // isNull 时表示是否为空（true=空，false=非空）
}

export interface InstanceQuery {
  filter?: InstanceFilter[];
  pageSize?: number;    // 默认 100，上限 1000
  pageToken?: string;   // 上一页 nextPageToken（按 object_rid 游标）
}

export interface PropertyAllowedValue {
  value: string;          // 实际存储值（如 'high'）
  label?: string;         // 展示名（如 '高风险'）
  description?: string;   // 该取值的含义
}

export interface PropertyDef {
  apiName: string;
  displayName: string;
  type: PropertyType;
  required: boolean;
  description?: string;                 // 属性语义说明
  allowedValues?: PropertyAllowedValue[]; // 枚举取值（可选）
  valueType?: string;                   // 引用值类型 apiName（可选；约束在写入时校验）
  derived?: boolean;
  // 派生属性的两种计算方式（二选一）：
  // - reducerFn: 引用一个 OntologyFunction.apiName，由函数引擎计算（推荐，可复用、可沙箱）；
  // - reducer: 内联安全表达式字符串（轻量场景）。本平台用 reducer 承载结构化 DerivedSpec 的 JSON 序列化。
  reducer?: string;
  reducerFn?: string;      // 关联 OntologyFunction.apiName（派生属性↔函数 闭环）
  sourceMapping?: string;  // 关联 S1 fieldMapping（基础属性来源）
  // 共享属性引用：指向 SharedProperty.apiName；存在则为"引用共享属性"
  sharedRef?: string;
  overridden?: boolean;    // displayName/required 是否与 sharedRef 基准不同（本地覆盖）
}

// 共享属性：跨多个对象类型复用的属性元数据（元数据集中，数据各自实例持有）
// 注意：required（是否必填）由各对象类型在"引用"处自行配置，共享侧只定义通用元数据。
export interface SharedProperty {
  apiName: string;       // 全局唯一，如 "status"
  displayName: string;
  type: PropertyType;
  description?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 派生属性计算规格（序列化为 PropertyDef.reducer 的 JSON 字符串）。
// 支持算子（对齐 Palantir Derived Properties 的聚合能力）：
// - countLinks : 统计某关系类型中以本对象为 source/target 的实例数量（如"部门人数"）。
// - avgLinks   : 通过某关系聚合对端对象的某一数值属性求平均值（如"部门平均工时"）。
// - sumLinks   : 对端数值属性求和（如"部门总预算"）。
// - minLinks   : 对端数值属性取最小值。
// - maxLinks   : 对端数值属性取最大值。
// - collectLinks: 收集对端某属性为数组（Collect list/set，如"部门成员姓名列表"）。
// - expression : 轻量占位表达式（第一期不执行）。
export interface DerivedSpec {
  op: 'countLinks' | 'avgLinks' | 'sumLinks' | 'minLinks' | 'maxLinks' | 'collectLinks' | 'expression';
  // 关系相关算子(count/avg/sum/min/max/collect) 专用
  linkType?: string;        // 关系类型 apiName
  side?: 'source' | 'target'; // 本对象在关系中的角色（部门人数：target）
  prop?: string;            // avg/sum/min/max/collect 专用：对端对象上聚合/收集的属性 apiName
  distinct?: boolean;       // countLinks 专用：是否按对端对象去重计数（Exact cardinality）
  // collectLinks 专用
  limit?: number;           // 收集最多 N 个值
  asSet?: boolean;          // 收集为集合（去重）而非列表
  single?: boolean;         // single: 单链接取标量（如 Project 的 Lead engineer name），仅当关系为 1:1/1:N 唯一端时返回一个值而非数组
  // expression 专用（轻量、仅占位，第一期不执行）
  expr?: string;
}

export function parseDerivedSpec(reducer?: string): DerivedSpec | null {
  if (!reducer) return null;
  try {
    const v = JSON.parse(reducer);
    if (v && typeof v === 'object' && 'op' in v) return v as DerivedSpec;
  } catch {
    // 兼容旧版纯表达式字符串
    return { op: 'expression', expr: reducer };
  }
  return null;
}

// 写入 patch 的校验钩子（由 server 注入；可抛出异常拒绝写入）
export type PatchValidator = (objectType: string, patch: Record<string, unknown>, actor: string) => void | Promise<void>;

export interface ObjectType {
  apiName: string;         // 全局唯一、不可变
  displayName: string;
  description?: string;
  properties: PropertyDef[];
  implementsInterfaces: string[];
  // 内嵌 S1 映射：对象类型直接携带其来源（由 with-mapping 创建时写入）。
  // 字段级映射记录在 properties[].sourceMapping；源实例由 S1 下推（instanceSource='source'）。
  sourceConnectionId?: string;
  sourceTable?: string;
  // 父子明细映射（对齐 Palantir MDO 的"主表 + 明细表"纵向关联）：
  // 明细表的行按 parentKey 外键聚合为数组/计数属性，挂到主对象上。
  // 明细表与主表同连接（复用 sourceConnectionId）。
  childTableMappings?: ChildTableMapping[];
  // 用于实例展示的"显示名"属性（如人员选 姓名/工号），展示该对象时优先显示此属性值。
  titleProperty?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 父子明细映射：明细表某列（childColumn）按 parentKey 外键聚合到主对象的属性。
// 一个明细表可贡献多个聚合属性（如同时收集成员名列表 + 成员计数）。
export interface ChildAggregation {
  property: string;         // 主对象上承载聚合结果的属性 apiName（须已声明在 properties）
  agg: 'collect' | 'count'; // collect=收集为数组；count=计数（行数）
  childColumn?: string;     // agg='collect' 时：明细表中被收集的列（如 name）
  asSet?: boolean;          // collect 是否去重（集合）
  limit?: number;           // collect 收集条数上限
}

export interface ChildTableMapping {
  table: string;            // 明细源表（与主表同一 sourceConnectionId）
  parentKey: string;        // 明细表中引用主对象的外键列（如 department_id）
  displayName?: string;     // 明细表显示名
  aggregations: ChildAggregation[];
}

export interface ValueTypeConstraint {
  kind: 'range' | 'regex';
  min?: number;
  max?: number;
  pattern?: string;
}

// 值类型：跨对象复用的语义类型 + 约束（Palantir Value Type）
export interface ValueType {
  apiName: string;
  displayName: string;
  baseType: PropertyType;
  description?: string;
  allowedValues?: PropertyAllowedValue[];
  constraint?: ValueTypeConstraint;
  failureMessage?: string;
  example?: string;
  version: number;
}

export interface LinkType {
  apiName: string;
  displayName: string;
  sourceType: string;          // 源端对象类型 apiName
  targetType: string;          // 目标端对象类型 apiName
  sourceCardinality: 'one' | 'many';   // 源端基数（One / Many）
  targetCardinality: 'one' | 'many';   // 目标端基数（One / Many）
  primaryKey?: string;         // 源端主键属性（对应源对象类型的某个属性）
  foreignKey?: string;         // 目标端外键属性（对应目标对象类型的某个属性）
  pluralName?: string;         // 复数显示名
  visibility?: string;         // 可见性：Normal / Internal 等
  // 关系实例来源：
  // - 'source': 实例来自数据中台源表（需在 S1 额外配置 link 映射，见 S0 link_instance 表）；
  // - 'managed': 实例由本平台在 link_instance 表中维护（如用户标注的关联）。
  instanceSource: 'source' | 'managed';
  version: number;
  // 多对多 join 表后备（可选）：与 foreignKey 二选一。
  // junctionTable 非空时，关系实例从该表读取：source_column -> sourceType 主键，target_column -> targetType 主键。
  junctionTable?: string;
  sourceColumn?: string;
  targetColumn?: string;
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
  // 实现约束：引用一个 OntologyFunction.apiName（由实现该接口的对象提供）
  // 解析时按 `objectType.apiName + '.' + method.apiName` 定位具体实现
  implementedBy: 'object-function';
}

export interface ActionParameter {
  name: string;
  type: PropertyType;
  required: boolean;
  description?: string;
  allowedValues?: PropertyAllowedValue[];
  valueType?: string;       // 引用值类型约束
}

// 动作效果（与"告警"正交；告警只是 effect 的一种副作用，非必选）：
// - function: 调用一个 OntologyFunction（读写本体侧由函数决定）；
// - write: 写入本体侧可写表（object_write），不写回只读的数据中台源端；
// - notify: 触发通知（如站内信/邮件/Webhook），对接通知系统（Step 2 新增）；
// - approval: 发起审批流（Step 2 新增，对接审批系统）。
// 注：源端为只读（见 S1），动作不得写回映射源；需要落库的写操作统一走本体可写侧。
export interface ActionEffect {
  kind: 'function' | 'write' | 'notify' | 'approval';
  ref?: string; // kind='function' 时指向函数 apiName；kind='write' 时指向对象类型 apiName；notify/approval 可省略
}

export interface ActionType {
  apiName: string;
  displayName: string;
  kind?: 'standard' | 'llm';   // llm 表示 LLM 函数（见 S5）
  parameters: ActionParameter[];
  validationRules?: string[];
  effect: ActionEffect;
  // 内嵌校验规则（对标 Palantir Action 自带的前置校验/rules）：动作执行前逐条校验命中对象，
  // 不满足的记录被跳过并在结果中标注 skippedByPrecondition。例如「flagged 对象必须含 riskScore」「riskScore 必须 > 0」。
  // 这把"动作能否落地"的约束声明化，FDE 可自助配置，无需改代码。
  preconditions?: ActionPrecondition[];
  version: number;
}

// Action 前置校验：作用于每个被动作处理的对象（如 rule 的 flagged 项）
export interface ActionPrecondition {
  // requiredProperty: 属性必须存在且非空；minValue/maxValue: 数值比较；notEmpty: 数组/字符串非空
  kind: 'requiredProperty' | 'minValue' | 'maxValue' | 'notEmpty';
  property: string;
  value?: number; // minValue / maxValue 时使用
  message: string; // 不满足时返回的说明
}

export interface OntologyFunction {
  apiName: string;
  displayName: string;
  // 第一期仅 'typescript' 可经 FunctionSandbox 真实执行；'python' 仅保留枚举与占位（resolve 可见、invoke 不可执行）。
  language: 'typescript' | 'python';
  entry: string;
  inputs: ActionParameter[];
  outputs: PropertyType[];
  // 函数说明：描述函数作用、入参含义、使用场景，便于其他开发者/使用者理解。
  description?: string | null;
  // 函数体源码（TS：运行时 new Function 编译注册；空则沿用 seed 注入的注册式实现，此时为只读、不可在线编辑）。python 暂不支持运行时执行。
  body?: string | null;
  version: number;
}

// ---- 存储抽象（统一 PG，未来可切换实现）----
// 内核只依赖此接口，不写具体 SQL；当前实现为 PostgreSQL 邻接表（见 docs/S0-storage-design.md）。
export interface MetadataRepository {
  // 对象类型
  listObjectTypes(opts?: { objectTypes?: string[] }): Promise<ObjectType[]>;
  getObjectType(apiName: string): Promise<ObjectType | null>;
  createObjectType(def: ObjectType): Promise<void>;
  updateObjectType(apiName: string, def: ObjectType): Promise<void>;
  deleteObjectType(apiName: string): Promise<void>;
  // 共享属性（跨对象类型复用的属性元数据）
  listSharedProperties(): Promise<SharedProperty[]>;
  getSharedProperty(apiName: string): Promise<SharedProperty | null>;
  createSharedProperty(def: SharedProperty): Promise<void>;
  updateSharedProperty(apiName: string, patch: Partial<SharedProperty>): Promise<void>;
  deleteSharedProperty(apiName: string): Promise<void>;
  // 把某对象类型内嵌的属性"提升"为共享属性（对齐 Foundry convert existing property）
  convertPropertyToShared(objectType: string, propApiName: string): Promise<void>;
  // 在某对象类型上应用共享属性（引用，可选本地覆盖 displayName / required）
  applySharedToObjectType(sharedApiName: string, objectType: string, override?: { displayName?: string; required?: boolean }): Promise<void>;
  // 探索页配置：每对象类型一套独立的图表（含图形样式 kind）
  getExploreConfig(apiName: string): Promise<{ apiName: string; kind: string }[]>;
  saveExploreConfig(apiName: string, charts: { apiName: string; kind: string }[]): Promise<void>;
  // 关系类型
  listLinkTypes(): Promise<LinkType[]>;
  getLinkType(apiName: string): Promise<LinkType | null>;
  createLinkType(def: LinkType): Promise<void>;
  updateLinkType(apiName: string, patch: Partial<LinkType>): Promise<void>;
  deleteLinkType(apiName: string): Promise<void>;
  // 关系实例（本体侧维护，供 S3 图谱探索）
  createLinkInstance(linkType: string, sourceRid: string, targetRid: string): Promise<void>;
  listLinkInstances(linkType: string, sourceRid?: string): Promise<{ sourceRid: string; targetRid: string }[]>;
  // 本体可写侧：Action effect.kind='write' 落此处（不写回只读源端）
  writeObjectPatch(objectType: string, objectRid: string, patch: unknown, actor: string): Promise<void>;
  // 清空某对象类型的全部可写侧实例（演示数据重灌用，生产应由 Action 驱动）
  clearObjectWrites(objectType: string): Promise<void>;
  // 清空某关系类型的全部实例
  clearLinkInstances(linkType: string): Promise<void>;
  // 计算派生属性（countLinks / avgLinks / expression 等）
  computeDerived(objectType: string, propApiName: string, objectRid: string): Promise<{ value: unknown }>;
  // 读取某对象类型下所有实例的（最新一次 patch 合并后的）属性，供函数/动作读取实例数据
  listObjectProperties(objectType: string): Promise<{ objectRid: string; properties: Record<string, unknown> }[]>;
  // 实例查询（对齐 Palantir）：属性级条件过滤 + 游标分页
  listInstances(
    objectType: string,
    opts?: InstanceQuery,
  ): Promise<{ data: { objectRid: string; properties: Record<string, unknown> }[]; nextPageToken: string | null }>;
  // 按属性分组计数（分类属性的分布条形图）
  aggregateByProperty(objectType: string, property: string, topN?: number): Promise<{ key: string; count: number }[]>;
  // 数值属性的直方图分桶（分布图）
  histogramByProperty(objectType: string, property: string, bucketCount?: number): Promise<{ bucket: number; min: number; max: number; count: number }[]>;
  // 接口与实现
  listInterfaces(): Promise<InterfaceDef[]>;
  setObjectInterface(objectApi: string, interfaceApi: string): Promise<void>;
  // 接口方法实现绑定（多态）
  bindInterfaceMethod(objectApi: string, interfaceApi: string, methodApi: string, functionApi: string): Promise<void>;
  // 解析多态调用：返回应执行的 OntologyFunction apiName
  resolveInterfaceMethod(objectApi: string, interfaceApi: string, methodApi: string): Promise<string | null>;
  // 影响分析（递归 CTE）：返回实现某接口的所有对象类型
  getObjectsImplementing(interfaceApi: string): Promise<string[]>;
  // 动作 / 函数
  createAction(def: ActionType): Promise<void>;
  getAction(apiName: string): Promise<ActionType | null>;
  listActions(): Promise<ActionType[]>;
  updateAction(apiName: string, patch: Partial<ActionType>): Promise<void>;
  deleteAction(apiName: string): Promise<void>;
  createFunction(def: OntologyFunction): Promise<void>;
  getFunction(apiName: string): Promise<OntologyFunction | null>;
  listFunctions(): Promise<OntologyFunction[]>;
  updateFunction(apiName: string, patch: Partial<OntologyFunction>): Promise<void>;
  deleteFunction(apiName: string): Promise<void>;
  // 自动化规则（通用「满足条件→执行动作」；后台定时/事件触发，条件命中后由可配置 Action 落地）
  createRule(def: AutomationRule): Promise<void>;
  getRule(apiName: string): Promise<AutomationRule | null>;
  listRules(): Promise<AutomationRule[]>;
  updateRule(apiName: string, patch: Partial<AutomationRule>): Promise<void>;
  deleteRule(apiName: string): Promise<void>;
}

// 触发器：决定「何时触发一次规则评估」。
// - schedule: 按间隔周期轮询（对应 Palantir Schedule / cron）；
// - event: 由对象写入事件触发（对应 Palantir 流式/对象事件触发，Step 2 新增）。
export type RuleTrigger =
  | { kind: 'schedule'; intervalSeconds: number }
  | { kind: 'event'; on: 'object_write'; objectType: string; conditionProperty?: string };

// 自动化规则：通用的「满足条件就执行动作」编排单元（对齐 Palantir Watchdog + Action Type + Schedule）。
// 规则本身不绑定"告警"语义——告警仅是 createDimissionAlert 这个 Action 的产物之一。
export interface AutomationRule {
  apiName: string;
  displayName: string;
  enabled: boolean;
  // 触发器：本期支持 schedule（周期）与 event（对象写入事件）。
  // 替代原 intervalSeconds 单一字段，使触发方式与条件/动作正交。
  trigger: RuleTrigger;
  // 可配置的条件评估函数（必须是已注册的 OntologyFunction apiName），返回 { flagged: [{rid, ...}] }
  conditionFunction: string;
  // 可配置的动作：命中后由该 Action 落地（写对象/通知/审批等）。
  actionApiName: string;
  // 传入条件函数的参数（如 threshold）
  params?: Record<string, unknown>;
  // 动作的落点对象类型（如 Alert）。仅当 Action 是写对象类动作时使用；通知/审批可忽略。
  targetObjectType: string;
  version: number;
}

// ---------- AIP Provider / Model / Agent 三层体系 ----------
// 模型供应商（接入点）。一个 provider 下可挂多个 model。
export interface AIPProvider {
  id: string;
  name: string;                 // 显示名，如 "本地 LM Studio"
  baseUrl: string;              // OpenAI 兼容端点，如 http://localhost:1234/v1（运行时由用户配置）
  apiKey: string;               // 可能为空（本地）
  protocol: string;             // 'openai-compatible' 等
  isDefault?: boolean;          // 默认供应商
  createdAt?: string;
  updatedAt?: string;
}

// 模型：归属某个 provider，参数可探测后修改。
export interface AIPModel {
  id: string;
  providerId: string;           // 外键 → aip_provider.id
  apiName: string;              // 调用 API 时用的模型名，如 qwen3.6-35b-a3b
  displayName: string;
  isReasoning?: boolean;        // 是否推理模型（带 reasoning_content），探测启发式 + 可改
  contextWindow?: number;       // 上下文窗口
  maxTokens?: number;           // 单次最大生成 token（推理模型需较大值）
  extra?: Record<string, unknown>; // 探测返回的其他字段
  createdAt?: string;
  updatedAt?: string;
}

// Agent：绑定 model 子集（模型范围），默认用其中一个；对话时可切换子集内模型。
export interface AIPAgentConfig {
  id: string;
  displayName: string;
  systemPrompt: string;
  modelScope: string[];         // 可用模型 id 列表（模型范围）
  defaultModelId: string;       // 默认模型 id（必须 ∈ modelScope）
  temperature: number;
  // 启用能力集合（对应本体工具分组）
  enabledTools: string[]; // 可选值: 'functions' | 'actions' | 'rules' | 'explore' | 'alerts'
  // 可访问的对象类型白名单（空数组 = 不限制，可访问全部）。
  // 约束 list_object_types / get_instances / get_object_links / aggregate / histogram 等探索工具。
  objectTypes: string[];
  maxSteps: number;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 探测返回的模型条目（来自 /v1/models）
export interface ProbeModelItem {
  id: string;                   // 模型名（API 用）
  owned_by?: string;
  created?: number;
  isReasoning?: boolean;        // 启发式推断
}

// ---------- AIP 会话管理（无 memory：仅持久化多轮对话历史） ----------
// 会话：归属某个 Agent
export interface AIPConversation {
  id: string;
  agentId: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// 消息：归属某个会话；timeline 保存结构化过程（思考/工具调用）
export interface AIPMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'ai';
  content: string;
  timeline?: unknown[];     // 思考/工具调用等过程条目（仅 ai）
  createdAt?: string;
}

// ---- 接口方法运行时引擎契约 ----
// 执行上下文：调用某个对象实例的接口方法
export interface MethodInvocationContext {
  objectType: string;        // 对象类型 apiName（决定多态分派）
  objectRid: string;         // 具体对象实例标识
  interfaceApi: string;      // 接口 apiName
  methodApi: string;         // 方法 apiName
  args: Record<string, unknown>;  // 调用入参（须符合方法 inputs）
}

// 执行结果
export interface MethodInvocationResult {
  ok: boolean;
  value?: unknown;           // 返回值（须符合方法 outputs）
  error?: string;            // 执行失败原因
  executedFunction?: string; // 实际分派到的 OntologyFunction apiName（可追溯）
}

// 函数沙箱：隔离执行 OntologyFunction（限制资源与 IO，详见 S2 F2.6）
// 分期：第一期 execute 仅对 language='typescript' 执行；language='python' 抛"未实现"（接口保留）。
export type TsFn = (args: Record<string, unknown>) => unknown | Promise<unknown>;
export interface FunctionSandbox {
  register(fnApiName: string, fn: TsFn): void;
  execute(fnApiName: string, args: Record<string, unknown>): Promise<unknown>;
}

// 运行时引擎：解析多态绑定 + 沙箱执行
export interface InterfaceMethodEngine {
  // 解析并调用：对象实例 → 接口方法 → 绑定 Function → 沙箱执行
  invoke(ctx: MethodInvocationContext): Promise<MethodInvocationResult>;
  // 仅解析不执行：返回应执行的 Function（供 S5 智能体规划步骤）
  resolve(ctx: MethodInvocationContext): Promise<string | null>;
}
