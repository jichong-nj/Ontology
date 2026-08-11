# S7 技术栈选型

> 本文档固化平台开发期的语言与框架决策，作为 S1~S6 落地的工程约束。

## 1. 总体原则

- **后端与类型层统一 TypeScript**：所有子系统服务、核心类型（`packages/ontology-core`）均用 TS，前后端共享类型契约，避免重复定义。
- **数据库统一 PostgreSQL**：图拓扑以邻接表 + `WITH RECURSIVE` CTE 表达，不引入 Neo4j（详见 S0）。
- **前端框架：Vue 3**（团队熟悉度优先）。后端类型层与前端框架无关，仍可直引 `packages/ontology-core` 的 `types.ts`。

## 2. 后端技术栈

| 维度 | 选型 | 说明 |
|---|---|---|
| 语言 | TypeScript | 与前端同源，类型复用 |
| 运行时 | Node.js / Bun | 优先 Bun（启动快、原生 TS） |
| 服务框架 | Fastify 或 NestJS | Fastify 轻量；NestJS 模块化适合多子系统 |
| ORM/查询 | drizzle 或 Prisma + `pg` | 统一 PG，邻接表手写 CTE |
| 校验 | zod | schema 可前后端共享 |
| 函数沙箱 | 第一期仅 TypeScript（见 §4） | `@isolated-vm` 或 VM 隔离 |

## 3. 前端技术栈（Vue 3）

| 维度 | 选型 | 说明 |
|---|---|---|
| 框架 | Vue 3（Composition API）+ Vite + TS | 团队熟悉 |
| 状态 | Pinia | 全局状态 |
| 数据请求 | TanStack Query（Vue 适配版） | 服务端缓存 |
| UI 组件 | Element Plus 或 Naive UI | 企业后台表格/表单开箱即用 |
| 样式 | Tailwind CSS（可选） | 配合 shadcn-vue |
| 表单 | VeeValidate + zod | 校验与后端 schema 对齐 |
| 路由 | Vue Router v4 | |
| 图谱可视化 | **框架无关图库优先** | 见 §5 |

## 4. 函数运行时分期决策（已对齐 S2 F2.6 / S5 F5.2）

- `OntologyFunction.language` 枚举保留 `'typescript' | 'python'`。
- **第一期**：`FunctionSandbox` 仅执行 `language: 'typescript'`；`python` 仅占位——`resolve` 可见（智能体可规划），`invoke`/沙箱执行返回"未实现"。
- **第二期**：评估接入 Python 进程隔离运行时（独立 worker / gRPC 子进程）。

## 5. 图谱可视化选型

前端偏好 Vue，故不依赖 React 独占的 React Flow，改为：

- **首选框架无关图库**：AntV G6 或 Cytoscape.js（Vue/React 通用，更适合大规模本体图）。
- **若需 Vue 原生**：`@vue-flow/core`（API 对齐 React Flow，适合中小规模编辑场景）。

> 图谱层选框架无关库可进一步降低对前端框架的绑定风险。

## 6. 工作区结构（pnpm workspace）

```
ontology/
├── docs/                 # S1~S7 需求/设计文档
├── packages/
│   ├── ontology-core/    # S2 核心类型（前后端共享）
│   ├── data-integration/
│   ├── analysis-explorer/
│   ├── app-builder/
│   ├── ai-orchestration/
│   └── governance/
└── apps/
    ├── web/              # Vue 3 前端
    └── server/           # TS 后端服务
```
