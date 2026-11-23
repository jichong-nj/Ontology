# Ontology Platform

对标 Palantir（Foundry + AIP 裁剪版）的**本体驱动企业数据分析 / 决策平台**。

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
| 对标差距与路线（主键/关系） | [PALANTIR-PK-ALIGNMENT.md](docs/PALANTIR-PK-ALIGNMENT.md) | Ontology 主键与 Link Type | 自选主键待实现；join table 已对齐 |

## 架构

```
前端 Vue 3/ElementPlus ──> Vite 代理(:5173) ──> Express API(:4000)
                                                  ├─ S1/S2 元数据路由（ontology-core / data-integration）
                                                  ├─ S3 实例下推（enterprise-biz 引导脚本）
                                                  └─ S5 AIP（ai-orchestration）
                                                              └─> LLM 网关（OpenAI 兼容，支持本地 qwen 等）

存储：
  - PostgreSQL(ontology)      # S2 元数据 + S3 可写侧(object_write / link_instance) + AIP 配置
  - PostgreSQL(enterprise_biz)# S1 只读业务源库（employee / department / product / device / project / leave_record）
```

- **元数据驱动**：S2 以"定义即数据"方式建模，所有子系统复用同一份元数据。
- **统一 PostgreSQL**：图模型以邻接表（`link_instance`）+ 索引表达，不引入独立图数据库；派生属性（count / avg / sum）通过 SQL 聚合 `link_instance` 实时计算，不落库。
- **AI 重点投入**：S5 通过本体语义注入 + 工具调用（functions / actions / rules / explore / alerts）让 LLM 多步串联完成复杂任务，并以 SSE 流式推送到前端。
- **前端 Vue 3 + ElementPlus**：团队熟悉度优先；后端类型层（TS）与前端框架无关，可直引。

## 目录结构

```
ontology/
├── docs/                    # 子系统需求/设计文档（S0~S7 + RULE-ENGINE 设计）
├── packages/
│   ├── ontology-core/       # S2 核心：类型定义 + PostgresMetadataRepository + 函数沙箱 + RuleScheduler + 建表 DDL
│   ├── data-integration/    # S1：源连接 + 字段映射 + 质量门禁(MappingService)
│   ├── enterprise-biz/      # 业务场景引导：S1 接入 + S2 建模 + S3 全量下推 + 离职预警函数
│   ├── ai-orchestration/    # S5：LLM 网关抽象 + AIPAgent（工具调用/流式 runStream）
│   ├── analysis-explorer/   # S3 契约（接口定义）
│   ├── app-builder/         # S4 契约（接口定义）
│   └── governance/          # S6 契约（接口定义）
├── apps/
│   ├── web/                 # 前端（Vue3 + ElementPlus + vue-router + ECharts + markdown-it）
│   └── server/              # 后端（Express + tsx，聚合 S1~S5 路由）
└── package.json             # npm workspaces（monorepo）
```

## 已实现功能（当前状态）

| 能力 | 状态 | 说明 |
|---|---|---|
| S1 数据源接入 | ✅ | 只读源连接 CRUD、连接测试、表/字段探测、字段级映射 + 质量门禁 |
| S2 对象/关系建模 | ✅ | object_type / link_type CRUD，字段内嵌 S1 映射，共享属性（提升/复用） |
| S3 实例下推 | ✅ | 命令式 seed 脚本（启动时全量 clear+重插），RID 指向 object_write |
| S2 函数 | ✅ | ontology_function CRUD；TS 函数体存库后可在线编辑、`new Function` 运行时编译注册 |
| S2 动作 | ✅ | action_type CRUD；`effect.kind='function'` 触发（手动 + 规则） |
| S2 规则 / 告警 | ✅ | 通用「满足条件→执行动作」规则表；RuleScheduler 后台周期运行（可配置 Function+Action） |
| S3 探索 | ✅ | 实例列表、对象关联关系图谱、属性聚合/直方图（ECharts） |
| S5 AIP | ✅ | Provider/Model/Agent 三层配置；流式对话（SSE）；函数/动作/规则/探索/告警工具调用 |
| S6 权限 | 🔲 | 仅定义了契约（docs），未实现运行时 RBAC |

> 业务示例场景：**人事域离职预警**——`evaluateDimissionRisk`（派生属性，阈值默认 0.8）写 `Employee.dimissionRisk`；后台 AlertScheduler 按 `alert_rule` 周期运行【可配置】函数 +【可配置】动作（`createDimissionAlert` 生成 Alert 对象）。

## 快速开始

### 1. 前置依赖
- Node.js ≥ 18（建议 LTS）
- PostgreSQL ≥ 14，建两个库：`ontology`（元数据+实例）与 `enterprise_biz`（只读业务源）

```sql
CREATE DATABASE ontology;
CREATE DATABASE enterprise_biz;
-- enterprise_biz 需先灌入业务源表（employee / department / product / device / project / leave_record）
-- 见 packages/enterprise-biz/sql/seed.sql
```

### 2. 安装依赖
```bash
npm install        # workspaces 一并安装
```

### 3. 初始化元数据表
```bash
# 建 ontology 库的全部元数据/实例表
DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/ontology" \
  npm run db:init
```

### 4. 启动后端（端口 4000）
```bash
cd apps/server
# 首次需设置环境变量（有默认值，可省略）
export META_DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/ontology"
export ENTERPRISE_BIZ_URL="postgresql://<user>:<pass>@localhost:5432/enterprise_biz"
npm start          # tsx 运行；冷启动会自动 bootstrap 业务场景（S1 接入 + S2 建模 + S3 下推 + 告警调度器）
```
> 后端为 **tsx 非热重载**：改代码后需 `pkill -f "tsx apps/server"` 再 `npm start` 才生效。

也可只跑建模/下推（不常驻）：
```bash
npm run bootstrap  # packages/enterprise-biz 的 CLI 入口
```

### 5. 启动前端（端口 5173）
```bash
cd apps/web
npm run dev        # Vite；/api 代理到 :4000（已关闭 SSE 缓冲 buffer:false）
```
浏览器打开 `http://localhost:5173`。

### 6. 测试
```bash
npm test           # vitest run（需本地 PostgreSQL）
```

## 主要 API 一览（后端 Express）

| 分组 | 路径 | 说明 |
|---|---|---|
| S1 | `/api/s1/connections` (GET/POST/PUT/DELETE) | 只读源连接管理 |
| S1 | `/api/s1/connections/:id/probe` ` /test` | 表探测 / 连接测试 |
| S2 | `/api/s2/object-types[/:apiName]` (GET/POST/PUT/DELETE) | 对象类型 CRUD |
| S2 | `/api/s2/object-types/with-mapping` (POST) | 组合创建：对象类型 + 字段映射 + 质量门禁 |
| S2 | `/api/s2/link-types` | 关系类型 CRUD |
| S2 | `/api/s2/functions` `/actions` `/rules` | 函数 / 动作 / 规则 CRUD |
| S2 | `/api/s2/functions/:fn/invoke` `/actions/:a/trigger` | 手动执行函数 / 动作 |
| S2 | `/api/s2/explore/...` | 实例、关系图谱、聚合/直方图 |
| S3 | `/api/s2/object-types/:t/derived/:p` | 派生属性实时计算 |
| AIP | `/api/aip/providers` `/models` `/agents` | Provider/Model/Agent 三层配置 CRUD |
| AIP | `/api/aip/agent/:id/stream` (POST) | **流式对话（SSE）** |
| AIP | `/api/aip/agent/:id/run` (POST) | 非流式对话（兼容） |

## 已知边界与后续方向

- **实例下推为命令式全量覆盖**：当前 `seed*` 函数每次 `clear + 重插`，源库单条变更需整表重推（未做增量 upsert / 调度解耦）。后续拟向 Palantir Foundry Sync 模式靠拢：增量 upsert（基于 RID）+ 可手动/定时触发 API + source 列→属性映射配置化。
- **S6 权限未实现**：RBAC / 对象级授权仅为文档契约。
- **前端业务域归类**：当前 Ontology Manager 按原语类型（对象/关系/函数/动作/规则）分页浏览，尚无「按业务域聚合视图」（对标 Palantir Object type groups，但其仅归类 object types）。此能力待设计。

详见各 `docs/S*.md` 子系统文档。
