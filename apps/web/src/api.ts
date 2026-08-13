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

export const s1 = {
  listConnections: () => http.get<SourceConnection[]>('/s1/connections').then((r) => r.data),
  getConnection: (id: string) => http.get<SourceConnection>(`/s1/connections/${id}`).then((r) => r.data),
  createConnection: (c: SourceConnection) => http.post('/s1/connections', c).then((r) => r.data),
  updateConnection: (id: string, c: SourceConnection) =>
    http.put(`/s1/connections/${id}`, c).then((r) => r.data),
  deleteConnection: (id: string) => http.delete(`/s1/connections/${id}`).then((r) => r.data),
  // 探测只读源库的表与字段（创建对象类型时选表/映射字段用）
  probe: (connId: string) => http.get<TestResult>(`/s1/connections/${connId}/probe`).then((r) => r.data),
  // 仅测试连接连通性（不列举表）
  testConnection: (connId: string) => http.post<TestResult>(`/s1/connections/${connId}/test`).then((r) => r.data),
  // 参数化测试（用表单当前值，未保存也可用）
  testByParams: (meta: ConnectionMeta) =>
    http.post<TestResult>('/s1/connections/test', { connectionMeta: meta }).then((r) => r.data),
  // 列出现有数据库（测试通过后选择库/schema 用）
  listDatabases: (meta: ConnectionMeta) =>
    http.post<{ databases: string[] }>('/s1/connections/databases', { connectionMeta: meta }).then((r) => r.data),
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
export interface ObjectType {
  apiName: string;
  displayName: string;
  description?: string;
  properties: OntologyProperty[];
  implementsInterfaces?: string[];
  sourceConnectionId?: string;
  sourceTable?: string;
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
}
export interface CreateObjectTypeWithMapping {
  objectType: ObjectType;
  sourceConnectionId?: string;
  sourceTable?: string;
  fieldMappings: FieldMapping[];
}

// ---------- 函数（Ontology Function）----------
export type FunctionLanguage = 'typescript' | 'python';
export interface FunctionInput {
  name: string;
  type: string;
  required?: boolean;
}
export interface OntologyFunction {
  apiName: string;
  displayName: string;
  language: FunctionLanguage;
  entry: string;
  inputs: FunctionInput[];
  outputs: string[];
  description?: string | null; // 函数说明：作用、入参含义、使用场景
  body?: string | null;     // 函数体源码（TS：运行时编译注册；空则沿用 seed 注入实现，此时只读不可编辑）
  version: number;
}
export interface ActionParameter {
  name: string;
  type: string;
  required?: boolean;
}
export interface ActionEffect {
  kind: 'object' | 'function' | 'none' | 'write';
  ref?: string;             // kind='function' 时指向函数 apiName
}
export interface ActionType {
  apiName: string;
  displayName: string;
  kind?: string;
  parameters?: ActionParameter[];
  validationRules?: unknown;
  effect: ActionEffect;
  version: number;
}

export const s2 = {
  listObjectTypes: () => http.get<ObjectType[]>('/s2/object-types').then((r) => r.data),
  getObjectType: (apiName: string) => http.get<ObjectType>(`/s2/object-types/${apiName}`).then((r) => r.data),
  createObjectType: (ot: ObjectType) => http.post('/s2/object-types', ot).then((r) => r.data),
  // 组合创建：对象类型 + 关联数据源表与字段映射
  createObjectTypeWithMapping: (p: CreateObjectTypeWithMapping) =>
    http.post('/s2/object-types/with-mapping', p).then((r) => r.data),
  updateObjectType: (apiName: string, ot: ObjectType) => http.put(`/s2/object-types/${apiName}`, ot).then((r) => r.data),
  deleteObjectType: (apiName: string) => http.delete(`/s2/object-types/${apiName}`).then((r) => r.data),
  // 计算派生属性（如"部门人数"）：传入对象实例 rid
  computeDerived: (apiName: string, propApiName: string, rid: string) =>
    http.get<{ value: unknown }>(`/s2/object-types/${apiName}/derived/${propApiName}`, { params: { rid } }).then((r) => r.data),
  // 触发一个 Ontology Function（如离职风险评估）
  invokeFunction: (fnApiName: string, params: Record<string, unknown> = {}) =>
    http.post<{ ok: boolean; result: unknown }>(`/s2/functions/${fnApiName}/invoke`, params).then((r) => r.data),
  // 告警规则列表
  listAlertRules: () => http.get<any[]>('/s2/alert-rules').then((r) => r.data),
  // 手动运行全部告警规则
  runAlertRules: () => http.post<{ ok: boolean; results: unknown[] }>('/s2/alert-rules/run').then((r) => r.data),
  // 告警对象列表
  listAlerts: () => http.get<any[]>('/s2/alerts').then((r) => r.data),
  // 探索页图表配置：每对象类型一套独立的图表（属性 apiName + 图形样式 kind 有序列表）
  getExploreConfig: (apiName: string) =>
    http.get<{ charts: { apiName: string; kind: 'bar' | 'pie' | 'line' }[] }>(`/s2/object-types/${apiName}/explore-config`).then((r) => r.data),
  saveExploreConfig: (apiName: string, charts: { apiName: string; kind: 'bar' | 'pie' | 'line' }[]) =>
    http.put(`/s2/object-types/${apiName}/explore-config`, { charts }).then((r) => r.data),
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

export default http;
