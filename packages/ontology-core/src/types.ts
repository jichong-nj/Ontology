// S2 Ontology 内核 — 核心类型与版本化模型
// 被 S1~S6 所有子系统复用，是平台的单一事实来源（"定义即数据"）。

export type PropertyType =
  | 'string' | 'integer' | 'float' | 'boolean'
  | 'date' | 'timestamp' | 'geopoint' | 'array' | 'object';
// 注：geopoint 类型保留供接口/数据建模使用；地图可视化已裁剪（S3 不含 Map），仅作为坐标数据承载。

export interface PropertyDef {
  apiName: string;
  displayName: string;
  type: PropertyType;
  required: boolean;
  derived?: boolean;
  // 派生属性的两种计算方式（二选一）：
  // - reducerFn: 引用一个 OntologyFunction.apiName，由函数引擎计算（推荐，可复用、可沙箱）；
  // - reducer: 内联安全表达式字符串（轻量场景）。
  reducer?: string;
  reducerFn?: string;      // 关联 OntologyFunction.apiName（派生属性↔函数 闭环）
  sourceMapping?: string;  // 关联 S1 fieldMapping（基础属性来源）
}

export interface ObjectType {
  apiName: string;         // 全局唯一、不可变
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
  // 关系实例来源：
  // - 'source': 实例来自数据中台源表（需在 S1 额外配置 link 映射，见 S0 link_instance 表）；
  // - 'managed': 实例由本平台在 link_instance 表中维护（如用户标注的关联）。
  instanceSource: 'source' | 'managed';
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
  // 实现约束：引用一个 OntologyFunction.apiName（由实现该接口的对象提供）
  // 解析时按 `objectType.apiName + '.' + method.apiName` 定位具体实现
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
  kind?: 'standard' | 'llm';   // llm 表示 LLM 函数（见 S5）
  parameters: ActionParameter[];
  validationRules: string[];
  // 动作效果：
  // - function: 调用一个 OntologyFunction（读写本体侧由函数决定）；
  // - write: 写入本体侧可写表（object_write），不写回只读的数据中台源端。
  // 注：源端为只读（见 S1），动作不得写回映射源；需要落库的写操作统一走本体可写侧。
  effect: { kind: 'function' | 'write'; ref: string };
  version: number;
}

export interface OntologyFunction {
  apiName: string;
  displayName: string;
  // 第一期仅 'typescript' 可经 FunctionSandbox 真实执行；'python' 仅保留枚举与占位（resolve 可见、invoke 不可执行）。
  language: 'typescript' | 'python';
  entry: string;
  inputs: ActionParameter[];
  outputs: PropertyType[];
  version: number;
}

// ---- 存储抽象（统一 PG，未来可切换实现）----
// 内核只依赖此接口，不写具体 SQL；当前实现为 PostgreSQL 邻接表（见 docs/S0-storage-design.md）。
export interface MetadataRepository {
  // 对象类型
  listObjectTypes(): Promise<ObjectType[]>;
  getObjectType(apiName: string): Promise<ObjectType | null>;
  createObjectType(def: ObjectType): Promise<void>;
  // 关系类型
  listLinkTypes(): Promise<LinkType[]>;
  createLinkType(def: LinkType): Promise<void>;
  // 关系实例（本体侧维护，供 S3 图谱探索）
  createLinkInstance(linkType: string, sourceRid: string, targetRid: string): Promise<void>;
  listLinkInstances(linkType: string, sourceRid?: string): Promise<{ sourceRid: string; targetRid: string }[]>;
  // 本体可写侧：Action effect.kind='write' 落此处（不写回只读源端）
  writeObjectPatch(objectType: string, objectRid: string, patch: unknown, actor: string): Promise<void>;
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
  createFunction(def: OntologyFunction): Promise<void>;
  getFunction(apiName: string): Promise<OntologyFunction | null>;
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
export interface FunctionSandbox {
  execute(fnApiName: string, args: Record<string, unknown>): Promise<unknown>;
}

// 运行时引擎：解析多态绑定 + 沙箱执行
export interface InterfaceMethodEngine {
  // 解析并调用：对象实例 → 接口方法 → 绑定 Function → 沙箱执行
  invoke(ctx: MethodInvocationContext): Promise<MethodInvocationResult>;
  // 仅解析不执行：返回应执行的 Function（供 S5 智能体规划步骤）
  resolve(ctx: MethodInvocationContext): Promise<string | null>;
}
