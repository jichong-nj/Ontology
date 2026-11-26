// 前端 API 客户端：封装 S1/S2 后端端点
import axios from 'axios';

const http = axios.create({ baseURL: '/api' });

// ---------- S1 ----------
// 映射已内嵌到对象类型（S2），S1 仅提供数据源连接与表结构探测能力。
export type SourceKind = 'database' | 'warehouse' | 'api' | 'file';
export type DbType = 'postgres' | 'mysql';
export type ConnStatus = 'connected' | 'error' | 'pending';

// S1 源连接参数：含账号/密码与数据库类型（演示用明文；生产走 secretRef）
export interface ConnectionMeta {
  dbType?: DbType;
  host?: string;
  port?: string | number;
  database?: string;
  user?: string;
  password?: string;
  [key: string]: unknown;
}

// S1 源连接：只读接入已治理数据，仅做映射（参照核心契约）
export interface SourceConnection {
  id: string;
  displayName: string;
  kind: SourceKind;
  readOnly: true;                 // 强制只读，禁止写回源端
  connectionMeta: ConnectionMeta;
  secretRef: string;              // 指向 S6 托管的凭据引用（非明文）
  status: ConnStatus;
  icon?: string;                  // 数据源卡片图标（emoji）
}
export interface FieldMapping {
  property: string;
  sourceColumn: string;
}
export interface ProbeColumn {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}
export interface ProbeTable {
  table: string;
  columns: ProbeColumn[];
}
export interface TestResult {
  reachable: boolean;
  error?: string;
  dbType?: DbType;
  tables: ProbeTable[];
}

// S1 数据源浏览：打开表 → 查看真实数据（只读分页预览）
export interface TablePreview {
  schema: string;
  table: string;
  dbType: DbType;
  columns: { name: string; dataType: string }[];
  rows: Record<string, unknown>[];
  total: number;
  limit: number;
  offset: number;
}

export const s1 = {
  listConnections: () => http.get<SourceConnection[]>('/s1/connections').then((r) => r.data),
  getConnection: (id: string) => http.get<SourceConnection>(`/s1/connections/${id}`).then((r) => r.data),
  createConnection: (c: SourceConnection) => http.post('/s1/connections', c).then((r) => r.data),
  updateConnection: (id: string, c: SourceConnection) =>
    http.put(`/s1/connections/${id}`, c).then((r) => r.data),
  deleteConnection: (id: string) => http.delete(`/s1/connections/${id}`).then((r) => r.data),
  // 探测只读源库的表与字段（创建对象类型时选表/映射字段用）
  probe: (connId: string) => http.get<TestResult>(`/s1/connections/${connId}/probe`).then((r) => r.data),
  // 浏览：列出连接库内可见 schema
  listSchemas: (connId: string) =>
    http.get<{ schemas: string[] }>(`/s1/connections/${connId}/schemas`).then((r) => r.data),
  // 浏览：指定 schema 下的表（含字段列）
  listTables: (connId: string, schema?: string) =>
    http.get<TestResult>(`/s1/connections/${connId}/tables`, { params: { schema } }).then((r) => r.data),
  // 浏览：打开表 → 查看真实数据（limit 上限 500）
  tableRows: (connId: string, table: string, opts: { schema?: string; limit?: number; offset?: number } = {}) =>
    http
      .get<TablePreview>(`/s1/connections/${connId}/tables/${encodeURIComponent(table)}/rows`, { params: opts })
      .then((r) => r.data),
  // 仅测试连接连通性（不列举表）
  testConnection: (connId: string) => http.post<TestResult>(`/s1/connections/${connId}/test`).then((r) => r.data),
  // 参数化测试（用表单当前值，未保存也可用）
  testByParams: (meta: ConnectionMeta) =>
    http.post<TestResult>('/s1/connections/test', { connectionMeta: meta }).then((r) => r.data),
  // 列出现有数据库（测试通过后选择库/schema 用）
  listDatabases: (meta: ConnectionMeta) =>
    http.post<{ databases: string[] }>('/s1/connections/databases', { connectionMeta: meta }).then((r) => r.data),
};

// ---------- S2 值类型 ----------
export interface ValueTypeDTO {
  apiName: string;
  displayName: string;
  baseType: string;
  description?: string;
  allowedValues?: { value: string; label?: string; description?: string }[];
  constraint?: { kind: 'range' | 'regex'; min?: number; max?: number; pattern?: string };
  failureMessage?: string;
  example?: string;
  version?: number;
}

export const valtype = {
  list: () => http.get<ValueTypeDTO[]>('/s2/value-types').then((r) => r.data),
  create: (v: ValueTypeDTO) => http.post('/s2/value-types', v).then((r) => r.data),
  update: (apiName: string, v: Partial<ValueTypeDTO>) =>
    http.put(`/s2/value-types/${apiName}`, v).then((r) => r.data),
  remove: (apiName: string) => http.delete(`/s2/value-types/${apiName}`).then((r) => r.data),
};

// ---------- S2 ----------
export interface OntologyProperty {
  apiName: string;
  displayName: string;
  type: string;
  required: boolean;
  sourceMapping?: string;
  // 派生属性配置
  derived?: boolean;
  reducer?: string;            // DerivedSpec 的 JSON 序列化
  reducerFn?: string;          // 引用已注册函数 apiName（与 reducer 二选一，优先级更高）
  // 共享属性引用
  sharedRef?: string;          // 引用 SharedProperty.apiName
  overridden?: boolean;        // 本地覆盖共享基准
  derivation?: any;            // 派生口径（function/linkAggregation/expression）
}

export interface SharedProperty {
  apiName: string;
  displayName: string;
  type: string;
  description?: string;
  valueType?: string;
  allowedValues?: { value: string; label?: string; description?: string }[];
  unit?: string;
  format?: string;
  defaultValue?: unknown;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 派生属性计算规格（与后端 ontology-core DerivedSpec 对应）
export interface DerivedSpec {
  op: 'countLinks' | 'avgLinks' | 'sumLinks' | 'minLinks' | 'maxLinks' | 'collectLinks' | 'expression';
  linkType?: string;
  side?: 'source' | 'target';
  prop?: string;
  distinct?: boolean;
  limit?: number;
  asSet?: boolean;
  single?: boolean;
  expr?: string;
}

export function parseDerivedSpec(reducer?: string): DerivedSpec | null {
  if (!reducer) return null;
  try {
    const v = JSON.parse(reducer);
    if (v && typeof v === 'object' && 'op' in v) return v as DerivedSpec;
  } catch {
    return { op: 'expression', expr: reducer };
  }
  return null;
}
export interface ChildAggregation {
  property: string;         // 主对象上承载聚合结果的属性 apiName
  agg: 'collect' | 'count'; // collect=收集为数组；count=计数（行数）
  childColumn?: string;     // agg='collect' 时：明细表中被收集的列
  asSet?: boolean;          // collect 是否去重（集合）
  limit?: number;           // collect 收集条数上限
}
export interface ChildTableMapping {
  table: string;            // 明细源表（与主表同一 sourceConnectionId）
  parentKey: string;        // 明细表中引用主对象的外键列（如 device_id）
  displayName?: string;     // 明细表显示名
  aggregations: ChildAggregation[];
}
export interface ObjectType {
  icon?: string;
  apiName: string;
  displayName: string;
  description?: string;
  properties: OntologyProperty[];
  implementsInterfaces?: string[];
  sourceConnectionId?: string;
  sourceTable?: string;
  // 父子明细映射（主表 + 明细表纵向关联）：明细行按 parentKey 聚合为数组/计数属性挂到主对象
  childTableMappings?: ChildTableMapping[];
  titleProperty?: string;       // 展示实例时优先显示的属性（如姓名/工号）
}
export interface LinkType {
  apiName: string;
  displayName: string;
  sourceType: string;
  targetType: string;
  sourceCardinality?: 'one' | 'many';
  targetCardinality?: 'one' | 'many';
  primaryKey?: string;
  foreignKey?: string;
  pluralName?: string;
  visibility?: string;
  instanceSource: 'source' | 'managed';
  junctionTable?: string;
  sourceColumn?: string;
  targetColumn?: string;
}
export interface CreateObjectTypeWithMapping {
  objectType: ObjectType;
  sourceConnectionId?: string;
  sourceTable?: string;
  fieldMappings: FieldMapping[];
  childTableMappings?: ChildTableMapping[];
}

// ---------- 函数（Ontology Function）----------
export type FunctionLanguage = 'typescript' | 'python';
export interface FunctionInput {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  valueType?: string;
  allowedValues?: { value: string; label?: string; description?: string }[];
}
export interface OntologyFunction {
  apiName: string;
  displayName: string;
  language: FunctionLanguage;
  entry: string;
  inputs: FunctionInput[];
  outputs: string[];
  outputSpec?: { name?: string; type: string; valueType?: string; description?: string }[];
  kind?: 'query' | 'edit';
  pure?: boolean;
  description?: string | null; // 函数说明：作用、入参含义、使用场景
  body?: string | null;     // 函数体源码（TS：运行时编译注册；空则沿用 seed 注入实现，此时只读不可编辑）
  version: number;
}
import type {
  ActionParameter,
  ActionEffect,
  ActionPrecondition,
  ActionType,
  PropertyDef,
} from '@ontology/ontology-core';
export type { ActionParameter, ActionEffect, ActionPrecondition, ActionType, PropertyDef };

export const s2 = {
  listObjectTypes: () => http.get<ObjectType[]>('/s2/object-types').then((r) => r.data),
  getObjectType: (apiName: string) => http.get<ObjectType>(`/s2/object-types/${apiName}`).then((r) => r.data),
  createObjectType: (ot: ObjectType) => http.post('/s2/object-types', ot).then((r) => r.data),
  // 组合创建：对象类型 + 关联数据源表与字段映射
  createObjectTypeWithMapping: (p: CreateObjectTypeWithMapping) =>
    http.post('/s2/object-types/with-mapping', p).then((r) => r.data),
  // AIP 建模闭环：从 AI 草案创建对象类型（可同时同步实例）
  createObjectTypeFromDraft: (draft: Record<string, unknown>, sync = true) =>
    http.post('/s2/object-types/from-draft', { draft, sync }).then((r) => r.data),
  // 手动重新同步某对象类型的实例（全量覆盖）
  syncObjectInstances: (apiName: string, schema = 'public') =>
    http.post(`/s2/object-types/${apiName}/sync`, { schema }).then((r) => r.data),
  // AIP 关系建模：从草案创建关系类型（可同时同步关系实例）
  createLinkTypeFromDraft: (draft: Record<string, unknown>, sync = true) =>
    http.post('/s2/link-types/from-draft', { draft, sync }).then((r) => r.data),
  // 手动重新同步某关系类型的关系实例（全量覆盖）
  syncLinkInstances: (apiName: string, schema = 'public') =>
    http.post(`/s2/link-types/${apiName}/sync`, { schema }).then((r) => r.data),
  updateObjectType: (apiName: string, ot: ObjectType) => http.put(`/s2/object-types/${apiName}`, ot).then((r) => r.data),
  deleteObjectType: (apiName: string) => http.delete(`/s2/object-types/${apiName}`).then((r) => r.data),
  // 计算派生属性（如"部门人数"）：传入对象实例 rid
  computeDerived: (apiName: string, propApiName: string, rid: string) =>
    http.get<{ value: unknown }>(`/s2/object-types/${apiName}/derived/${propApiName}`, { params: { rid } }).then((r) => r.data),
  // 触发一个 Ontology Function（如离职风险评估）
  invokeFunction: (fnApiName: string, params: Record<string, unknown> = {}) =>
    http.post<{ ok: boolean; result: unknown }>(`/s2/functions/${fnApiName}/invoke`, params).then((r) => r.data),
  // 自动化规则列表（通用「满足条件→执行动作」）
  listRules: () => http.get<any[]>('/s2/rules').then((r) => r.data),
  getRule: (apiName: string) => http.get<any>(`/s2/rules/${apiName}`).then((r) => r.data),
  createRule: (def: any) => http.post('/s2/rules', def).then((r) => r.data),
  updateRule: (apiName: string, patch: any) => http.put(`/s2/rules/${apiName}`, patch).then((r) => r.data),
  deleteRule: (apiName: string) => http.delete(`/s2/rules/${apiName}`).then((r) => r.data),
  // 手动运行全部规则
  // Automation（新模块，兼容 /rules）
  listAutomations: () => http.get<any[]>('/s2/automations').then((r) => r.data),
  getAutomation: (apiName: string) => http.get<any>(`/s2/automations/${apiName}`).then((r) => r.data),
  createAutomation: (def: any) => http.post('/s2/automations', def).then((r) => r.data),
  updateAutomation: (apiName: string, patch: any) => http.put(`/s2/automations/${apiName}`, patch).then((r) => r.data),
  deleteAutomation: (apiName: string) => http.delete(`/s2/automations/${apiName}`).then((r) => r.data),
  runAutomation: (apiName: string) => http.post(`/s2/automations/${apiName}/run`).then((r) => r.data),
  listAutomationRuns: (apiName: string, limit = 50) =>
    http.get<any[]>(`/s2/automations/${apiName}/runs`, { params: { limit } }).then((r) => r.data),
  getAutomationRun: (id: string) => http.get<any>(`/s2/automation-runs/${id}`).then((r) => r.data),
  listNotifications: (limit = 50) => http.get<any[]>('/s2/notifications', { params: { limit } }).then((r) => r.data),
  runRules: () => http.post<{ ok: boolean; results: unknown[] }>('/s2/rules/run').then((r) => r.data),
  previewRuleCondition: (condition: any, params?: any) =>
    http.post<{ matched: boolean; count: number; items: any[] }>('/s2/rules/preview', { condition, params }).then((r) => r.data),
  // 告警对象列表
  listAlerts: () => http.get<any[]>('/s2/alerts').then((r) => r.data),
  // 探索页图表配置：每对象类型一套独立的图表（属性 apiName + 图形样式 kind 有序列表）
  getExploreConfig: (apiName: string) =>
    http.get<{ charts: { apiName: string; kind: 'bar' | 'pie' | 'line' }[] }>(`/s2/object-types/${apiName}/explore-config`).then((r) => r.data),
  saveExploreConfig: (apiName: string, charts: { apiName: string; kind: 'bar' | 'pie' | 'line' }[]) =>
    http.put(`/s2/object-types/${apiName}/explore-config`, { charts }).then((r) => r.data),
};

// 共享属性（Shared properties）：跨对象类型复用的属性元数据
export const s2shared = {
  list: () => http.get<SharedProperty[]>('/s2/shared-properties').then((r) => r.data),
  get: (apiName: string) => http.get<SharedProperty>(`/s2/shared-properties/${apiName}`).then((r) => r.data),
  create: (sp: SharedProperty) => http.post('/s2/shared-properties', sp).then((r) => r.data),
  update: (apiName: string, patch: Partial<SharedProperty>) => http.put(`/s2/shared-properties/${apiName}`, patch).then((r) => r.data),
  remove: (apiName: string) => http.delete(`/s2/shared-properties/${apiName}`).then((r) => r.data),
  // 把对象类型内嵌属性提升为共享属性
  convert: (objectType: string, propApiName: string) =>
    http.post('/s2/shared-properties/convert', { objectType, propApiName }).then((r) => r.data),
  // 在某对象类型上应用（引用）共享属性，可选本地覆盖
  apply: (apiName: string, objectType: string, override?: { displayName?: string; required?: boolean }) =>
    http.post(`/s2/shared-properties/${apiName}/apply`, { objectType, ...(override ?? {}) }).then((r) => r.data),
};

export const s2functions = {
  list: () => http.get<OntologyFunction[]>('/s2/functions').then((r) => r.data),
  get: (apiName: string) => http.get<OntologyFunction>(`/s2/functions/${apiName}`).then((r) => r.data),
  create: (fn: OntologyFunction) => http.post('/s2/functions', fn).then((r) => r.data),
  update: (apiName: string, patch: Partial<OntologyFunction>) => http.put(`/s2/functions/${apiName}`, patch).then((r) => r.data),
  remove: (apiName: string) => http.delete(`/s2/functions/${apiName}`).then((r) => r.data),
  invoke: (apiName: string, params: Record<string, unknown> = {}) =>
    http.post<{ ok: boolean; result: unknown }>(`/s2/functions/${apiName}/invoke`, params).then((r) => r.data),
};

export const s2actions = {
  list: () => http.get<ActionType[]>('/s2/actions').then((r) => r.data),
  create: (a: ActionType) => http.post('/s2/actions', a).then((r) => r.data),
  update: (apiName: string, patch: Partial<ActionType>) => http.put(`/s2/actions/${apiName}`, patch).then((r) => r.data),
  remove: (apiName: string) => http.delete(`/s2/actions/${apiName}`).then((r) => r.data),
  trigger: (apiName: string, params: Record<string, unknown> = {}) =>
    http.post<{ ok: boolean; result: unknown }>(`/s2/actions/${apiName}/trigger`, params).then((r) => r.data),
};

export const s2link = {
  listLinkTypes: () => http.get<LinkType[]>('/s2/link-types').then((r) => r.data),
  getLinkType: (apiName: string) => http.get<LinkType>(`/s2/link-types/${apiName}`).then((r) => r.data),
  createLinkType: (lt: LinkType) => http.post('/s2/link-types', lt).then((r) => r.data),
  updateLinkType: (apiName: string, patch: Partial<LinkType>) => http.put(`/s2/link-types/${apiName}`, patch).then((r) => r.data),
  deleteLinkType: (apiName: string) => http.delete(`/s2/link-types/${apiName}`).then((r) => r.data),
};

// ---------- S2 Explore（探索）----------
export interface ObjectLink {
  linkType: string;
  linkDisplayName: string;
  otherObjectType: string;
  links: { direction: 'source' | 'target'; otherRid: string }[];
}

export const s2explore = {
  // 获取某对象类型的所有实例
  listInstances: (objectType: string) =>
    http.get<any[]>(`/s2/explore/instances/${objectType}`).then((r) => r.data),
  // 获取某个具体对象的所有关联关系（按 link_type 分组）
  getObjectLinks: (objectType: string, objectRid: string) =>
    http.get<ObjectLink[]>(`/s2/explore/object/${objectType}/${objectRid}/links`).then((r) => r.data),
  // 分类属性分组计数（条形图）
  aggregate: (objectType: string, property: string, topN = 20) =>
    http.get<{ key: string; count: number }[]>(`/s2/explore/${objectType}/aggregate`, { params: { property, topN } }).then((r) => r.data),
  // 数值属性直方图分桶（分布图）
  histogram: (objectType: string, property: string, buckets = 20) =>
    http.get<{ bucket: number; min: number; max: number; count: number }[]>(`/s2/explore/${objectType}/histogram`, { params: { property, buckets } }).then((r) => r.data),
};

// ---------- AIP 配置平台（Provider / Model / Agent 三层体系）----------
export interface AIPProviderDTO {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  protocol: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ProbeModelDTO {
  id: string;
  owned_by?: string;
  created?: number;
  isReasoning?: boolean;
}
export interface AIPModelDTO {
  id: string;
  providerId: string;
  apiName: string;
  displayName: string;
  isReasoning?: boolean;
  contextWindow?: number;
  maxTokens?: number;
  extra?: Record<string, unknown>;
}
export interface AIPAgentConfigDTO {
  id: string;
  displayName: string;
  systemPrompt: string;
  modelScope: string[];      // 可用模型 id 列表（模型范围）
  defaultModelId: string;    // 默认模型 id（∈ modelScope）
  temperature: number;
  enabledTools: string[];    // 'functions' | 'actions' | 'rules' | 'explore' | 'alerts' | 'sql'
  objectTypes: string[];      // 可访问的对象类型白名单（空 = 不限制）
  maxSteps: number;
  version?: number;
}

export interface AIPConversationDTO {
  id: string;
  agentId: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIPMessageDTO {
  id: string;
  conversationId: string;
  role: 'user' | 'ai';
  content: string;
  timeline?: unknown[];
  createdAt?: string;
}

export interface AgentStep {
  tool: string;
  args: unknown;
  result: unknown;
}

export interface AgentRunResult {
  ok: boolean;
  reply: string;
  steps: AgentStep[];
  error?: string;
}

export const aip = {
  // ---- 会话管理 ----
  listConversations: (agentId: string) =>
    http.get<AIPConversationDTO[]>('/aip/agents/' + agentId + '/conversations').then((r) => r.data),
  createConversation: (agentId: string, title?: string) =>
    http.post<{ ok: boolean; conversation: AIPConversationDTO }>('/aip/agents/' + agentId + '/conversations', { title }).then((r) => r.data.conversation),
  renameConversation: (cid: string, title: string) =>
    http.put('/aip/conversations/' + cid, { title }).then((r) => r.data),
  deleteConversation: (cid: string) =>
    http.delete('/aip/conversations/' + cid).then((r) => r.data),
  listMessages: (cid: string) =>
    http.get<AIPMessageDTO[]>('/aip/conversations/' + cid + '/messages').then((r) => r.data),

  // ---- Provider ----
  listProviders: () => http.get<AIPProviderDTO[]>('/aip/providers').then((r) => r.data),
  getProvider: (id: string) => http.get<AIPProviderDTO>(`/aip/providers/${id}`).then((r) => r.data),
  createProvider: (p: AIPProviderDTO) => http.post('/aip/providers', p).then((r) => r.data),
  updateProvider: (id: string, p: Partial<AIPProviderDTO>) => http.put(`/aip/providers/${id}`, p).then((r) => r.data),
  deleteProvider: (id: string) => http.delete(`/aip/providers/${id}`).then((r) => r.data),
  // 探测 provider 下的模型列表
  probeProvider: (baseUrl: string, apiKey = '') =>
    http.post<{ ok: boolean; error?: string; models: ProbeModelDTO[] }>('/aip/providers/probe', { baseUrl, apiKey }).then((r) => r.data),

  // ---- Model ----
  listModels: (providerId?: string) =>
    http.get<AIPModelDTO[]>('/aip/models', { params: providerId ? { providerId } : {} }).then((r) => r.data),
  createModel: (m: AIPModelDTO) => http.post('/aip/models', m).then((r) => r.data),
  updateModel: (id: string, m: Partial<AIPModelDTO>) => http.put(`/aip/models/${id}`, m).then((r) => r.data),
  deleteModel: (id: string) => http.delete(`/aip/models/${id}`).then((r) => r.data),

  // ---- Agent ----
  listAgents: () => http.get<AIPAgentConfigDTO[]>('/aip/agents').then((r) => r.data),
  getConfig: (id: string) =>
    http.get<AIPAgentConfigDTO>(`/aip/agents/${id}`).then((r) => r.data).catch(() => null),
  createAgent: (cfg: Partial<AIPAgentConfigDTO>) =>
    http.post<AIPAgentConfigDTO>('/aip/agents', cfg).then((r) => r.data),
  saveConfig: (id: string, cfg: Partial<AIPAgentConfigDTO>) =>
    http.put<AIPAgentConfigDTO>(`/aip/agents/${id}`, cfg).then((r) => r.data),
  deleteAgent: (id: string) => http.delete(`/aip/agents/${id}`).then((r) => r.data),

  // 流式对话：通过 fetch + ReadableStream 解析 SSE，逐事件回调；支持 modelId 切换模型与中断
  streamRun: async (
    id: string,
    message: string,
    onEvent: (ev: AgentStreamEvent) => void,
    history: unknown[] = [],
    modelId?: string,
    signal?: AbortSignal,
    conversationId?: string,
  ): Promise<void> => {
    const res = await fetch(`/api/aip/agent/${id}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, modelId, conversationId }),
      signal,
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new Error(`流式请求失败 ${res.status}: ${text.slice(0, 200)}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split('\n\n');
      buf = parts.pop() ?? '';
      for (const part of parts) {
        const line = part.split('\n').find((l) => l.startsWith('data: '));
        if (!line) continue;
        const json = line.slice(6).trim();
        if (!json) continue;
        try {
          onEvent(JSON.parse(json) as AgentStreamEvent);
        } catch { /* 忽略非 JSON 帧 */ }
      }
    }
  },
};

export type AgentStreamEvent =
  | { type: 'call'; step: number; model: string }
  | { type: 'call_status'; step: number; ok: boolean; message?: string }
  | { type: 'thought'; content: string; collapsed?: boolean }
  | { type: 'reply_chunk'; content: string }
  | { type: 'action'; id: string; step: number; tool: string; args: unknown }
  | { type: 'result'; id: string; step: number; tool: string; ok: boolean; result: unknown }
  | { type: 'error'; message: string }
  | { type: 'done'; reply: string };

export default http;

// ---------- System（系统维护） ----------
export interface ReingestStep { step: string; ok: boolean; error?: string }
export interface ReingestReport { ok: boolean; steps: ReingestStep[]; elapsedMs: number }

export const system = {
  // 手动重新灌入业务数据（S1 数据源 + S2 定义 + S3 实例全量重推）
  reingest: () => http.post<ReingestReport>('/admin/reingest').then((r) => r.data),
  // 查询是否正在进行
  reingestStatus: () => http.get<{ running: boolean }>('/admin/reingest/status').then((r) => r.data),
};

// ---------- 应急响应（Ontology 之上的业务层） ----------
export const emergency = {
  listCases: () => http.get<any[]>('/emergency/cases').then((r) => r.data),
  getCase: (id: string) => http.get<any>(`/emergency/cases/${encodeURIComponent(id)}`).then((r) => r.data),
  graph: (id: string) => http.get<{ nodes: any[]; edges: any[] }>(`/emergency/cases/${encodeURIComponent(id)}/graph`).then((r) => r.data),
  candidates: (id: string) => http.get<any[]>(`/emergency/cases/${encodeURIComponent(id)}/candidates`).then((r) => r.data),
  acceptCandidate: (id: string) => http.post(`/emergency/candidates/${encodeURIComponent(id)}/accept`).then((r) => r.data),
  rejectCandidate: (id: string) => http.post(`/emergency/candidates/${encodeURIComponent(id)}/reject`).then((r) => r.data),
  tasks: (id: string) => http.get<any[]>(`/emergency/cases/${encodeURIComponent(id)}/tasks`).then((r) => r.data),
  receiveTask: (id: string) => http.post(`/emergency/tasks/${encodeURIComponent(id)}/receive`).then((r) => r.data),
  submitTask: (id: string, body: any) => http.post(`/emergency/tasks/${encodeURIComponent(id)}/submit`, body).then((r) => r.data),
  closeCase: (id: string, body: any) => http.post(`/emergency/cases/${encodeURIComponent(id)}/close`, body).then((r) => r.data),
  createEvent: (body: any) => http.post('/emergency/events', body).then((r) => r.data),
  inbox: (type: 'verification' | 'inspection') =>
    http.get<any[]>('/emergency/inbox', { params: { type } }).then((r) => r.data),
};