# Ontology Platform

对标 Palantir（Foundry + AIP 裁剪版）的**本体驱动企业数据分析/决策平台**。

> 设计边界：本系统是 **Ontology 层**，不是数据中台层。数据治理与管道编排由下层数据中台负责，本系统只**接入与映射**已治理好的数据，并在 Ontology 内核之上提供分析、应用与 AI 决策能力。地图可视化与 Apollo 式独立部署运维本期不做。

## 子系统导航

| 子系统 | 文档 | 对标 Palantir | 定位 |
|---|---|---|---|
| S1 数据接入与映射 | [S1-data-integration.md](docs/S1-data-integration.md) | Foundry Data Connection（只读） | 连接已治理数据源 + 对象↔源映射 |
| S2 Ontology 内核 | [S2-ontology-core.md](docs/S2-ontology-core.md) | Ontology（Object/Link/Action/Function） | 语义中枢、单一事实来源 |
| S3 分析与探索 | [S3-analysis-explorer.md](docs/S3-analysis-explorer.md) | Object Explorer / Quiver / Vertex | 搜索 / 图表 / 图谱 |
| S4 应用构建 | [S4-app-builder.md](docs/S4-app-builder.md) | Workshop / Object Views / Dashboards | 低代码应用与看板 |
| S5 AI 决策编排 | [S5-ai-orchestration.md](docs/S5-ai-orchestration.md) | AIP（重要） | 语义搜索 / LLM 函数 / 智能体 / NL2Query |
| S6 权限与治理 | [S6-governance.md](docs/S6-governance.md) | Foundry Security / Ontology Manager | RBAC / 对象级授权 / 审计 |
| S7 技术栈选型 | [S7-tech-stack.md](docs/S7-tech-stack.md) | — | 语言/框架/运行时工程约束 |
| S1 接口文档（实现态） | [S1-api.md](docs/S1-api.md) | — | 映射 SDK / 质量门禁 |
| S2 接口文档（实现态） | [S2-api.md](docs/S2-api.md) | — | 元数据仓库 / 方法运行时 |

## 架构

```
前端 Vue 3/TS ──> API 网关 ──> S1~S6 子系统服务（TS）
                            S2 ──> PostgreSQL（邻接表表达图拓扑，统一单库）
                            S1 ──> PostgreSQL + 数据中台(只读)
                            S5 ──> LLM 网关
                            S6 ──> PostgreSQL
```

- **元数据驱动**：S2 以"定义即数据"方式建模，所有子系统复用同一份元数据。
- **统一 PostgreSQL 单库**：图模型以邻接表 + `WITH RECURSIVE` CTE 表达，不引入独立图数据库（详见 S0）。
- **AI 重点投入**：S5 通过本体语义注入 + RAG + 智能体，深度融入 Ontology。
- **前端 Vue 3**：团队熟悉度优先；后端类型层（TS）与前端框架无关，仍可直引（详见 S7）。

## 目录结构

```
ontology/
├── docs/                 # 6 份独立子系统需求文档（需求+接口契约+裁剪说明）
├── packages/
│   ├── ontology-core/    # S2 核心类型（被全局依赖）
│   ├── data-integration/ # S1 映射模型
│   ├── analysis-explorer/# S3 契约
│   ├── app-builder/      # S4 契约
│   ├── ai-orchestration/ # S5 LLM 网关抽象
│   └── governance/       # S6 权限/审计契约
└── apps/
    ├── web/              # 前端骨架（Vue 3，子系统导航占位）
    └── server/           # 后端骨架（TS 路由占位）
```

## 状态

本期交付 = **7 份需求文档（S1~S7）+ 架构骨架**（目录、模块边界、核心类型与接口契约占位）。未实现完整业务逻辑，作为后续落地蓝图。技术栈决策见 S7（前端 Vue 3，后端 TS，统一 PostgreSQL）。
