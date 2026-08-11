// S4 应用构建 — 接口契约（低代码配置，Ontology 原生、可操作）

export type ComponentKind =
  | 'object-list' | 'object-detail' | 'chart'
  | 'action-button' | 'metric-card' | 'timeline';

export interface AppComponent {
  id: string;
  kind: ComponentKind;
  binding: {
    objectType?: string;
    property?: string;
    actionType?: string;   // 绑定 S2 Action
    chartSpec?: unknown;   // 引用 S3 ChartSpec
  };
  layout: { x: number; y: number; w: number; h: number };
}

export interface Application {
  id: string;
  displayName: string;
  pages: { name: string; components: AppComponent[] }[];
  allowedRoles: string[];  // S6 角色
}

export interface ObjectView {
  id: string;
  objectType: string;
  panels: AppComponent[];
}

export interface Dashboard {
  id: string;
  displayName: string;
  widgets: AppComponent[];
  refreshIntervalSec?: number;
}
