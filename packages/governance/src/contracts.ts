// S6 权限与治理 — RBAC / 对象级策略 / 审计接口契约

export interface Permission {
  resource: string;          // 如 'objectType:Customer'
  action: 'read' | 'write' | 'execute' | 'delete';
  scope?: 'all' | 'owned' | string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Policy {
  id: string;
  objectType: string;        // S2 对象类型
  expression: string;        // 对象级可见性表达式
  effect: 'allow' | 'deny';
}

export interface ReviewRequest {
  id: string;
  changeRef: string;         // 关联 S2 定义变更
  reviewers: string[];
  status: 'pending' | 'approved' | 'rejected';
  targetEnv: 'dev' | 'prod';
}

export interface AuditLog {
  id: string;
  actor: string;
  resource: string;
  action: string;
  result: 'success' | 'failure';
  timestamp: string;
  meta?: Record<string, unknown>;
}

// 鉴权接口：各子系统统一调用
export interface AuthzService {
  can(actor: string, resource: string, action: string): Promise<boolean>;
}
