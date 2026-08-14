# S3 分析与探索子系统 — 需求文档

> 对标 Palantir：Object Explorer + Quiver + Vertex（裁剪版）
> 定位：基于 S2 的 Ontology 元数据，提供对对象实例的搜索、分析与关系探索。

## 1. 概述

S3 是面向分析师的"看清数据"层。它消费 S2 的对象/关系定义与 S1 的映射实例，提供：
- **对象浏览器**：搜索、过滤、SQL 查询、对象集对比。
- **图表与分析**：对对象集做可视化分析（简化 Quiver）。
- **图谱探索**：以图的方式浏览对象间关系与时序（Vertex 风格）。

设计原则：**只读分析、Ontology 驱动、可视化优先**。所有分析都基于 S2 已建模的语义，不鼓励脱离 Ontology 的裸表查询。

## 2. 边界与依赖

### 上游
- **S2 Ontology 内核**：对象/关系/属性的语义定义。
- **S1 数据接入与映射**：对象实例的物理来源（查询下推到源端）。

### 下游
- **S4 应用构建**：分析视图可被固化成应用/看板。
- **S5 AI 决策编排**：分析上下文可注入 AI 检索。

### 不在范围内
- ❌ 地图/地理空间可视化（已确认暂不做）。
- ❌ 数据写入（分析层只读，写入走 S2 Action）。

## 3. 一级功能需求

### F3.1 对象浏览器
**用户故事**：作为分析师，我想搜索"状态为逾期的订单"，过滤后查看详情，并与上周的同条件对象集做对比。

**输入**：对象类型、搜索条件（关键词 / 结构化过滤 / SQL）、对比基准。
**输出**：对象列表、详情抽屉、对比差异。

**规则**：
- 支持关键词 + 结构化过滤 + 受限 SQL（仅 SELECT，禁止 DML）。
- 搜索结果受 S6 对象级权限过滤。
- 对比基于对象集快照。

### F3.2 图表与分析
**用户故事**：作为分析师，我想把"客户"对象集按"地区"分组，画出销售额趋势图。

**输入**：对象集、维度/度量配置、图表类型。
**输出**：图表（折线/柱状/饼图等）+ 可下钻。

**规则**：
- 维度/度量必须来自 S2 已建模属性。
- 大数据量做服务端聚合，前端只渲染结果。
- 图表可保存为 S4 看板组件。

### F3.3 图谱探索
**用户故事**：作为调查员，我想从"某笔可疑交易"出发，沿关系链查看关联账户与事件时序。

**输入**：起点对象、关系类型、跳数、时间范围。
**输出**：关系图（节点/边）+ 时序轴。

**规则**：
- 关系来自 S2 `LinkType`。
- 支持限制跳数防止爆炸式展开。
- 时序数据按 `timestamp` 属性排列。

## 4. 接口契约

```typescript
// packages/analysis-explorer/src/contracts.ts

export interface ObjectQuery {
  objectType: string;
  filters?: FilterClause[];
  sql?: string;            // 受限 SELECT，可选
  limit: number;
  offset: number;
}

export interface FilterClause {
  property: string;
  op: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
  value: unknown;
}

export interface ChartSpec {
  kind: 'line' | 'bar' | 'pie' | 'scatter';
  objectType: string;
  dimension: string;   // S2 属性
  measure: string;     // S2 数值属性
  aggregation: 'sum' | 'count' | 'avg' | 'max' | 'min';
}

export interface GraphExploreSpec {
  startObject: { type: string; id: string };
  linkTypes?: string[];
  maxHops: number;
  timeRange?: { from: string; to: string };
}

// REST 契约（示意）
// POST /api/s3/objects/search       对象浏览/搜索
// POST /api/s3/objects/:id/compare  对象集对比
// POST /api/s3/charts/render        图表渲染
// POST /api/s3/graph/explore        图谱探索
```

## 5. 实现状态（实际路由）

S3 分析与探索**已实现**（`apps/server/src/index.ts` 的 `/api/s2/explore/*` + 前端 `Overview.vue` / `AlertsPage.vue`，图表用 ECharts），设计文档中的 `/api/s3/*` 示意路径已被 `/api/s2/explore/*` 取代：

- **对象浏览/搜索**：`GET /api/s2/explore/objects/:type`（实例列表 + 过滤）、`GET /api/s2/explore/object/:type/:rid`（单实例详情）。
- **图谱探索**：`GET /api/s2/explore/links/:type/:rid`（对象关联关系，按 `link_instance` 双向遍历，限制跳数防爆）。
- **聚合/直方图**：`GET /api/s2/explore/aggregate`（属性聚合 count/avg/sum）、`GET /api/s2/explore/histogram`（数值属性直方图，ECharts 渲染）。
- **派生属性**：`GET /api/s2/object-types/:t/derived/:p`（`computeDerived` 实时聚合 `link_instance`）。
- **前端**：`Overview.vue` 提供对象检索与属性聚合视图；`AlertsPage.vue` 展示告警对象与离职风险分布（人事域示例）。

> 注：对象集对比、自由画布式分析（Quiver）未实现；地图（Map）按设计确认暂不做。

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| Object Explorer（搜索/过滤/SQL） | ✅ 保留核心，SQL 限定只读 SELECT |
| Quiver（复杂多维分析） | ⚠️ 裁剪为"标准图表 + 下钻"，不做自由画布式分析 |
| Vertex（图谱/时序探索） | ✅ 保留关系图 + 时序，限制跳数 |
| Map（地理空间可视化） | ❌ **确认暂不做** |
| 实时流分析 | ❌ 裁剪（依赖中台离线/增量同步） |

> 分析层保留"看"的能力，去掉"重分析画布"与"地理/流式"等重组件。
