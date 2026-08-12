// S1 数据接入与映射 — 核心契约（只读接入已治理数据，仅做映射）
// 不负责管道编排/数据加工，同步由下层数据中台负责。

export type SourceKind = 'database' | 'warehouse' | 'api' | 'file';
export type SyncMode = 'full' | 'incremental';

// 受支持的源数据库类型（S1 只读接入）
export type DbType = 'postgres' | 'mysql';

export interface SourceConnection {
  id: string;
  displayName: string;
  kind: SourceKind;
  readOnly: true;                 // 强制只读
  connectionMeta: ConnectionMeta;
  secretRef: string;              // 指向 S6 托管的凭据引用（非明文）
  status: 'connected' | 'error' | 'pending';
  icon?: string;                  // 卡片展示图标（emoji 或图标名）
  createdAt: string;
  updatedAt: string;
}

// 源连接参数：账号/密码/库名/主机/端口/数据库类型
// 说明：演示环境直接存 user/password 明文；生产应走 secretRef 指向 S6 托管凭据，本结构不强制。
export interface ConnectionMeta {
  dbType?: DbType;                // postgres | mysql，缺省按 postgres 处理
  host?: string;
  port?: string | number;
  database?: string;
  user?: string;
  password?: string;
  // API / 文件类连接可附加的字段
  baseUrl?: string;
  [key: string]: unknown;
}

// 连接测试结果（测试连接 / 探测共用）
export interface TestResult {
  reachable: boolean;
  error?: string;
  dbType?: DbType;
  tables: { table: string; columns: { name: string; dataType: string; isNullable: boolean; isPrimaryKey: boolean }[] }[];
}

export interface FieldMapping {
  property: string;               // S2 对象属性 apiName
  sourceColumn: string;           // 源表字段名
}

export interface ObjectMapping {
  id: string;
  objectType: string;             // 关联 S2 ObjectType.apiName
  sourceConnectionId: string;
  sourceTable: string;
  fieldMappings: FieldMapping[];
  incrementalMeta: {
    cursorColumn?: string;
    syncMode: SyncMode;
  };
  qualityStatus: 'unknown' | 'passed' | 'warning' | 'failed';
  createdAt: string;
  updatedAt: string;
}
