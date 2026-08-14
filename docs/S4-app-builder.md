# S4 应用构建子系统 — 需求文档

> 对标 Palantir：Workshop + Object Views + Slate（裁剪版）
> 定位：让业务人员用低代码方式，把 S2 的 Ontology 与 S3 的分析结果组装成可操作的业务应用。

## 1. 概述

S4 是"用起来"的层。它把 Ontology 对象、关系、动作与分析图表，通过低代码配置组装成：
- **低代码应用**（Workshop 风格）：页面 + 组件 + 交互。
- **对象视图**（Object View）：单个对象的聚焦展示面板。
- **仪表盘与看板**：指标卡 + 图表 + 列表的组合视图。

设计原则：**配置驱动、Ontology 原生、可操作**。应用内的按钮可触发 S2 Action，实现"分析→决策→执行"闭环。

## 2. 边界与依赖

### 上游
- **S2 Ontology 内核**：提供对象/属性/动作定义（应用的数据与操作来源）。
- **S3 分析与探索**：图表与分析视图可被嵌入应用/看板。

### 下游
- **S6 权限与治理**：应用访问受角色控制；应用内 Action 受对象级策略约束。
- **S5 AI 决策编排**：应用内可嵌入 AI 决策组件（后续扩展）。

### 不在范围内
- ❌ 通用前端框架自由开发（本系统只提供低代码配置）。
- ❌ 工作流 BPM 引擎（复杂流程归业务系统，本层只触发 S2 Action）。

## 3. 一级功能需求

### F4.1 低代码应用搭建
**用户故事**：作为业务负责人，我想拖拽组件搭一个"客户风控"页面，包含客户列表、详情面板和"标记风险"按钮。

**输入**：页面布局、组件（列表/详情/图表/按钮）、绑定的 S2 对象与 S2 Action。
**输出**：`Application` 定义，可发布给用户访问。

**规则**：
- 组件数据必须绑定 S2 对象/属性。
- 按钮可绑定 S2 `ActionType`，点击即触发治理约束下的执行。
- 应用嵌套受 S6 权限控制。

### F4.2 对象视图配置
**用户故事**：作为建模师，我想为"订单"配置一个固定视图：顶部概要、中部时间线、底部关联列表。

**输入**：对象类型、面板布局、各面板绑定的属性/关系/图表。
**输出**：`ObjectView` 定义，在 S3/S4 中复用。

**规则**：
- 视图绑定到具体 `ObjectType`。
- 面板可引用 S3 图表或 S2 派生属性。

### F4.3 仪表盘与看板
**用户故事**：作为管理者，我想有一个看板展示"今日新增客户""逾期订单数"等核心指标。

**输入**：指标卡（来自 S2 属性聚合）、图表、列表组件组合。
**输出**：`Dashboard` 定义。

**规则**：
- 指标来自 S2 属性聚合或 S3 图表。
- 支持定时刷新（基于 S1 增量同步节奏）。

## 4. 接口契约

```typescript
// packages/app-builder/src/contracts.ts

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
  allowedRoles: string[];   // S6 角色
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

// REST 契约（示意）
// POST /api/s4/applications
// GET  /api/s4/applications/:id
// POST /api/s4/object-views
// POST /api/s4/dashboards
```

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| Workshop（低代码应用） | ✅ 保留核心：组件 + 绑定 + 发布 |
| Object Views | ✅ 保留 |
| Dashboards / 看板 | ✅ 保留 |
| Slate（代码级自定义应用） | ❌ 裁剪：不做自由代码开发，只低代码 |
| Foundry Rules / 复杂工作流 | ⚠️ 裁剪：仅触发 S2 Action，不做 BPM 编排 |

> 应用层保留"配置即应用"，去掉"代码级自定义"与"重型工作流引擎"。

## 6. 实现状态

**S4 应用构建未实现**。当前仅停留在 `packages/app-builder/src/contracts.ts` 的**接口契约层**（`Application` / `ObjectView` / `Dashboard` / `AppComponent`），无后端路由、无数据库表、无前端页面。

- 低代码应用、对象视图配置、看板/仪表盘均属规划能力。
- 分析展示能力目前由 S3 的 `Overview.vue` / `AlertsPage.vue`（对象检索、聚合直方图、关系图谱）部分覆盖，但未抽象为可配置的应用构件。
- 后端无 `/api/s4/*` 路由（参见 `apps/server/src/index.ts`）。
