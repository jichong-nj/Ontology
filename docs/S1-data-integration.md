# S1 数据接入与映射子系统 — 需求文档

> 对标 Palantir：Foundry Data Connection + Pipeline Builder（裁剪版）
> 定位：本系统**不重复建设数据治理与管道编排**，仅负责连接下层数据中台已治理好的数据，并在 Ontology 层建立"对象 ↔ 源表/字段"的映射关系。

## 1. 概述

S1 是 Ontology 平台的数据入口层。它假设原始数据的采集、清洗、质量治理、ETL/ELT 管道编排已由下层**数据中台**完成。S1 的职责是：

1. 以**只读**方式连接已治理的数据源（数仓、业务库、API、文件）。
2. 将源表/字段**映射**为 Ontology 的对象类型与属性。
3. 复用中台的质量结果，并做映射层的一致性校验。
4. 提供轻量血缘，说明"某个对象来自哪个源表"。

设计原则：**只读接入、映射优先、同步托管**。S1 不触发任何数据写入源端，也不负责调度同步——这些由数据中台承担。

## 2. 边界与依赖

### 上游
- 数据中台（治理后的数仓/业务库/API/文件）—— 已存在，S1 仅消费。

### 下游 / 依赖
- **S2 Ontology 内核**：S1 的映射产物（ObjectMapping）是 S2 对象类型的数据来源声明。
- **S6 权限与治理**：数据源连接凭据需受 S6 的密钥/权限管理约束。
- 存储：映射定义存 PostgreSQL；源端读取通过连接凭据进行。

### 不在范围内
- ❌ 管道编排 / DAG 可视化编排（数据中台职责）。
- ❌ 数据清洗、去重、标准化（中台职责）。
- ❌ 写回源端（本系统对源端只读）。

## 3. 一级功能需求

### F1.1 已治理数据源连接
**用户故事**：作为数据工程师，我希望登记一个已治理好的数据源连接（如某业务库或数仓 Schema），以便 Ontology 能读取其中的表与字段。

**输入**：
- 连接类型 `kind`：`database` | `warehouse` | `api` | `file`
- 连接元数据 `connectionMeta`（host/port/db/schema/token/endpoint 等）
- 凭据引用（指向基础设施层托管的密钥，S6 负责引用与访问控制，不直接落明文）

**输出**：`SourceConnection` 记录，状态为 `connected` 或 `error`，可读出源端表清单。

**规则**：
- 连接必须是**只读**（`readOnly: true` 强制）。
- 保存前须通过连通性探测（探测失败不允许保存）。
- 凭据不得明文存储，由**基础设施层（如 Vault）托管**，S6 负责引用与访问控制（S6 自身不托管密钥，见 S6 边界）。

### F1.2 数据映射（对象 ↔ 源表/字段）
**用户故事**：作为建模师，我希望把某个 Ontology 对象类型的属性映射到源表的字段上，这样对象实例能自动从源端读取。

**输入**：
- 目标对象类型 `objectType`（来自 S2）
- 源表 `sourceTable`
- 字段映射 `fieldMappings: [{ property, sourceColumn }]`
- 增量同步元数据 `incrementalMeta`（游标列、全量/增量模式）

**输出**：`ObjectMapping` 记录，供 S2 实例化对象时读取。

**规则**：
- 一个对象类型可映射多个源（多表 join 场景），但至少 1 个主源。
- 属性类型需与源列类型兼容，保存前做类型校验。
- `incrementalMeta.cursorColumn` 必须存在于源表且单调递增。

### F1.3 数据质量校验
**用户故事**：作为数据治理员，我希望在映射层看到数据质量状态，确保 Ontology 使用的字段没有脏数据。

**输入**：映射定义 + 中台质量报告引用。
**输出**：映射级质量评分 / 告警列表。

**规则**：
- 优先复用中台已有的质量结果（不重复计算）。
- 映射层仅做**一致性校验**（如非空约束、类型、枚举值域）。
- 严重不一致（如主键为空）将 `qualityStatus` 标记为 `failed`，并作为**发布门禁信号**：S2 在对象类型发布到可用状态时校验其映射 `qualityStatus !== 'failed'`，不通过则拦截（责任协同：S1 标记质量，S2 卡发布）。
- **关系映射**：当 S2 中 `LinkType.instanceSource='source'` 时，需在 S1 额外配置关系映射，使关系实例可从源表查出并经 `link_instance` 缓存/索引，供 S3 图谱探索下推（见 S0）。

### F1.4 数据血缘与目录
**用户故事**：作为分析师，我想知道"这个对象来自哪张表、哪些字段"，以便理解数据出处。

**输入**：对象类型 / 属性名。
**输出**：血缘图（对象 → 源表 → 源字段）与数据源目录树。

**规则**：
- 血缘为**只读展示**，由映射定义反推生成。
- 目录支持按数据源、Schema 分组浏览。

## 4. 接口契约

```typescript
// packages/data-integration/src/mapping-model.ts

export type SourceKind = 'database' | 'warehouse' | 'api' | 'file';

export interface SourceConnection {
  id: string;
  displayName: string;
  kind: SourceKind;
  readOnly: true;                 // 强制只读
  connectionMeta: Record<string, unknown>; // host/port/db/schema/endpoint 等
  secretRef: string;              // 指向 S6 托管的凭据引用（非明文）
  status: 'connected' | 'error' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export type SyncMode = 'full' | 'incremental';

export interface FieldMapping {
  property: string;     // S2 对象属性 apiName
  sourceColumn: string; // 源表字段名
}

export interface ObjectMapping {
  id: string;
  objectType: string;       // 关联 S2 ObjectType.apiName
  sourceConnectionId: string;
  sourceTable: string;
  fieldMappings: FieldMapping[];
  incrementalMeta: {
    cursorColumn?: string;   // 增量游标列
    syncMode: SyncMode;
  };
  qualityStatus: 'unknown' | 'passed' | 'warning' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// REST 契约（示意）
// GET    /api/s1/connections             列出数据源
// POST   /api/s1/connections             登记数据源（带连通性探测）
// GET    /api/s1/connections/:id/tables  读取源端表清单
// POST   /api/s1/mappings                创建对象↔源映射
// GET    /api/s1/mappings/:objectType    查询某对象的映射
// GET    /api/s1/lineage/:objectType     查询血缘
```

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| Foundry Data Connection（多源接入） | ✅ 保留，但仅**只读**接入已治理数据 |
| Pipeline Builder（可视化 DAG 编排） | ❌ **裁剪**：管道编排归数据中台，本层只做映射 |
| Contour / 数据预览 | ⚠️ 轻量保留（表清单 + 字段采样），不做完整数据编辑 |
| 数据质量（Foundry Quality） | ⚠️ 裁剪为"复用中台结果 + 映射一致性校验" |
| 血缘（Lineage） | ⚠️ 保留轻量"对象→源"血缘，不做全链路计算血缘 |

> 核心裁剪逻辑：**本系统是 Ontology 层，不是数据中台层**。凡是"产生/加工数据"的能力一律下放到中台，本层只消费与映射。
