// S3 分析与探索 — 接口契约（只读分析，Ontology 驱动）

export interface FilterClause {
  property: string;
  op: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
  value: unknown;
}

export interface ObjectQuery {
  objectType: string;
  filters?: FilterClause[];
  sql?: string;            // 受限 SELECT，禁止 DML
  limit: number;
  offset: number;
}

export interface ChartSpec {
  kind: 'line' | 'bar' | 'pie' | 'scatter';
  objectType: string;
  dimension: string;
  measure: string;
  aggregation: 'sum' | 'count' | 'avg' | 'max' | 'min';
}

export interface GraphExploreSpec {
  startObject: { type: string; id: string };
  linkTypes?: string[];
  maxHops: number;
  timeRange?: { from: string; to: string };
}
