// S1 数据接入与映射 — 核心契约（只读接入已治理数据，仅做映射）
// 不负责管道编排/数据加工，同步由下层数据中台负责。

export type SourceKind = 'database' | 'warehouse' | 'api' | 'file';
export type SyncMode = 'full' | 'incremental';

export interface SourceConnection {
  id: string;
  displayName: string;
  kind: SourceKind;
  readOnly: true;                 // 强制只读
  connectionMeta: Record<string, unknown>;
  secretRef: string;              // 指向 S6 托管的凭据引用（非明文）
  status: 'connected' | 'error' | 'pending';
  createdAt: string;
  updatedAt: string;
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
