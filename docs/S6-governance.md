# S6 权限与治理子系统 — 需求文档

> 对标 Palantir：Foundry Security / Ontology Manager / 审计
> 定位：为全平台提供统一的身份认证、细粒度授权、Ontology 定义治理与审计能力。

## 1. 概述

S6 是平台的"守门人"。它确保：
- **谁能看/改什么**（RBAC + 对象级授权）。
- **Ontology 定义如何安全演进**（评审、版本迁移）。
- **所有关键操作可追溯**（审计日志）。

设计原则：**默认最小权限、策略集中、全程留痕**。S6 被 S1~S5 共同依赖——任何跨子系统的访问控制都落到 S6。

## 2. 边界与依赖

### 上游
- 企业身份源（SSO / LDAP）—— 外部接入，提供用户与组。

### 下游 / 被依赖
- **S1**：数据源凭据引用与访问受控（真实密钥由基础设施层 Vault 托管，S6 仅做引用与访问控制，不托管密钥本身）。
- **S2**：对象/属性可见性、Action 执行授权。
- **S3**：搜索结果按权限过滤。
- **S4**：应用访问角色控制。
- **S5**：AI 可见对象与可调工具受控、AI 动作留审计。

### 不在范围内
- ❌ 物理多租户隔离（用逻辑权限替代）。
- ❌ 数据加密密钥管理（依赖基础设施层）。

## 3. 一级功能需求

### F6.1 角色与权限（RBAC / 对象级授权）
**用户故事**：作为安全管理员，我想让"风控组"只能看"客户/订单"对象，且不能执行"删除"动作。

**输入**：角色、权限规则（`resource` + `action` + `scope`）。
**输出**：`Role` 与 `Policy` 记录，运行时鉴权。

**规则**：
- 支持角色（RBAC）与对象级策略（`objectType`/`property` 粒度）。
- 默认拒绝，显式授权才放行。
- 策略变更需审计。

### F6.2 Ontology 定义管理与评审迁移
**用户故事**：作为建模负责人，我想让"新增对象类型"先走评审，再发布到生产 Ontology。

**输入**：定义变更（来自 S2）、评审人、目标环境。
**输出**：评审记录 + 版本迁移结果。

**规则**：
- 生产变更须评审通过。
- 支持环境间迁移（dev→prod），保留版本历史。
- 与 S2 版本化联动。

### F6.3 审计日志
**用户故事**：作为合规官，我想查"谁在什么时候对哪个对象执行了什么动作"。

**输入**：事件（用户/角色/资源/动作/结果）。
**输出**：`AuditLog` 不可篡改记录，支持检索。

**规则**：
- 所有跨子系统敏感操作必须写审计（含 S5 AI 动作）。
- 审计只读、保留期可配。

## 4. 接口契约

```typescript
// packages/governance/src/contracts.ts

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;          // 如 'objectType:Customer'
  action: 'read' | 'write' | 'execute' | 'delete';
  scope?: 'all' | 'owned' | string; // 对象级范围
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
  actor: string;             // 用户/角色
  resource: string;
  action: string;
  result: 'success' | 'failure';
  timestamp: string;
  meta?: Record<string, unknown>;
}

// 鉴权接口（供各子系统调用）
export interface AuthzService {
  can(actor: string, resource: string, action: string): Promise<boolean>;
}

// REST 契约（示意）
// POST /api/s6/roles
// GET  /api/s6/roles/:id/permissions
// POST /api/s6/policies
// POST /api/s6/reviews
// GET  /api/s6/audit-logs
```

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| Foundry Security（RBAC / 对象级） | ✅ 保留核心 |
| Ontology Manager（定义管理/迁移） | ✅ 保留基础评审+迁移，复杂工作流裁剪 |
| 审计日志 | ✅ 保留，全平台敏感操作留痕 |
| 物理多租户隔离 | ❌ 裁剪为逻辑权限隔离 |
| 密钥/证书全生命周期管理 | ⚠️ 依赖基础设施层，本层只做凭据引用 |

> 治理是平台地基，保留核心鉴权/审计；仅对"物理多租户/密钥全生命周期"做裁剪或下沉。
