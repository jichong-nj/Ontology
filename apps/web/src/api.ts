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
}

// 派生属性计算规格（与后端 ontology-core DerivedSpec 对应）
export interface DerivedSpec {
  op: 'countLinks' | 'countObject' | 'sumObject' | 'avgLinks' | 'expression';
  linkType?: string;
  side?: 'source' | 'target';
  prop?: string;
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
};

export default http;
