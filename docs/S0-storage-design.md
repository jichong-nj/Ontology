# S0 存储设计总纲

> 决策：**全平台统一使用 PostgreSQL 一种数据库**，不引入独立的图数据库（如 Neo4j）。
> 适用范围：S1 数据接入与映射、S2 Ontology 内核、S3 分析与探索、S4 应用构建、S5 AI 决策编排、S6 权限与治理 的所有**非实例数据**。
> 实例数据（对象真实行、关系行）**不存本体层**，由 S1 映射指向的数据中台（数仓/DB/API）提供，本体层只读下推查询。

## 1. 设计原则

- **单一事实库**：所有元数据、配置、治理、审计、AI 日志统一落 PG，运维简单，事务一致（契合"暂不需要独立部署运维子系统"的裁剪边界）。
- **本体层不持有实例数据**：对象/关系的真实数据行通过 S1 `ObjectMapping` 虚拟化地从已治理数据源查出，本体层只存"定义 + 映射规则"。
- **图拓扑用邻接表表达**：对象类型、关系类型、接口之间的图依赖，用外键 + 关联表表达，深度遍历用 `WITH RECURSIVE` CTE。
- **抽象可演进**：内核依赖 `MetadataRepository` 接口而非具体 SQL，当前实现为 PG，将来若需图库可加实现而不动上层。

## 2. 存储拓扑

```
              ┌─────────────────────────────┐
              │     Ontology 内核 (S2)       │
              └──────────────┬──────────────┘
                             │ 读写定义 / 引用映射
        ┌────────────────────▼────────────────────┐
        │            PostgreSQL（单一事实库）         │
        │  ├ 元数据(图拓扑): object_type / link_type │
        │  │   / object_interface / action / function│
        │  ├ 映射配置(S1): source_connection /       │
        │  │   object_mapping                        │
        │  ├ 治理(S6): rbac_role / policy /           │
        │  │   audit_log                             │
        │  └ AI 日志(S5): agent_run / semantic_log   │
        └────────────────────┬────────────────────┘
                             │ 只读下推查询 (SQL)
        ┌────────────────────▼────────────────────┐
        │        数据中台（数仓 / DB / API）         │  ← 实例数据，本体层不存储
        └─────────────────────────────────────────┘
```

## 3. 核心表结构示意（PostgreSQL）

### 3.1 元数据（图拓扑，对应 S2 类型）
```sql
-- 对象类型（api_name 全局唯一、不可变；改名=新建版本）
CREATE TABLE object_type (
  api_name      TEXT PRIMARY KEY,
  display_name  TEXT NOT NULL,
  description   TEXT,
  properties    JSONB NOT NULL,          -- PropertyDef[]
  version       INT  NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 关系类型：source/target 指向 object_type.api_name（图的边）
CREATE TABLE link_type (
  api_name      TEXT PRIMARY KEY,
  display_name  TEXT NOT NULL,
  source_type   TEXT NOT NULL REFERENCES object_type(api_name),
  target_type   TEXT NOT NULL REFERENCES object_type(api_name),
  cardinality   TEXT NOT NULL CHECK (cardinality IN ('one-to-one','one-to-many','many-to-many')),
  instance_source TEXT NOT NULL CHECK (instance_source IN ('source','managed')),
  version       INT  NOT NULL
);

-- 关系实例：本体侧维护的关系行（instance_source='managed' 时由本平台写入；
-- 若为 'source'，则实例由数据中台提供，此处仅缓存/索引，不复制全量）。
CREATE TABLE link_instance (
  id           BIGSERIAL PRIMARY KEY,
  link_type    TEXT NOT NULL REFERENCES link_type(api_name),
  source_rid  TEXT NOT NULL,   -- 源对象实例标识
  target_rid  TEXT NOT NULL,   -- 目标对象实例标识
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON link_instance (link_type, source_rid);
CREATE INDEX ON link_instance (link_type, target_rid);

-- 本体可写侧：Action 的写效果（effect.kind='write'）落此处，绝不写回只读源端
CREATE TABLE object_write (
  id          BIGSERIAL PRIMARY KEY,
  object_type TEXT NOT NULL,
  object_rid  TEXT NOT NULL,
  patch       JSONB NOT NULL,   -- 写入的属性补丁
  actor       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 接口与实现（多对多，图的"实现"边）
CREATE TABLE interface_def (
  api_name   TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  properties JSONB NOT NULL,
  methods    JSONB NOT NULL,          -- InterfaceMethod[]（含方法签名）
  version    INT  NOT NULL
);
CREATE TABLE object_interface (
  object_api_name    TEXT NOT NULL REFERENCES object_type(api_name),
  interface_api_name TEXT NOT NULL REFERENCES interface_def(api_name),
  PRIMARY KEY (object_api_name, interface_api_name)
);
-- 接口方法的实现映射：对象类型 + 方法 → 具体 OntologyFunction
CREATE TABLE interface_method_impl (
  object_api_name TEXT NOT NULL REFERENCES object_type(api_name),
  interface_api_name TEXT NOT NULL REFERENCES interface_def(api_name),
  method_api_name TEXT NOT NULL,
  function_api_name TEXT NOT NULL REFERENCES ontology_function(api_name),
  PRIMARY KEY (object_api_name, interface_api_name, method_api_name)
);

-- 动作类型 / 函数（含版本）
CREATE TABLE action_type (
  api_name TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  parameters JSONB NOT NULL,
  validation_rules JSONB NOT NULL,
  effect JSONB NOT NULL,
  version INT NOT NULL
);
CREATE TABLE ontology_function (
  api_name TEXT PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('typescript','python')),
  entry TEXT NOT NULL,
  inputs JSONB NOT NULL,
  outputs JSONB NOT NULL,
  version INT NOT NULL
);
```

### 3.2 映射配置（S1，只读接入 + 对象↔源映射）
```sql
CREATE TABLE source_connection (
  id            TEXT PRIMARY KEY,
  display_name  TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('database','warehouse','api','file')),
  read_only     BOOLEAN NOT NULL DEFAULT TRUE,   -- 强制只读
  connection_meta JSONB NOT NULL,
  secret_ref    TEXT NOT NULL,                   -- 指向密钥库，非明文
  status        TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE object_mapping (
  id                   TEXT PRIMARY KEY,
  object_type          TEXT NOT NULL REFERENCES object_type(api_name),
  source_connection_id TEXT NOT NULL REFERENCES source_connection(id),
  source_table         TEXT NOT NULL,
  field_mappings       JSONB NOT NULL,           -- {property, sourceColumn}[]
  incremental_meta     JSONB NOT NULL,
  quality_status       TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.3 应用定义存储（S4，配置型数据）
```sql
CREATE TABLE application (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  pages JSONB NOT NULL,
  allowed_roles JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE object_view (
  id TEXT PRIMARY KEY,
  object_type TEXT NOT NULL,
  panels JSONB NOT NULL
);
CREATE TABLE dashboard (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  widgets JSONB NOT NULL,
  refresh_interval_sec INT
);
```

### 3.4 治理与审计（S6）
```sql
CREATE TABLE rbac_role (id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE policy (
  id TEXT PRIMARY KEY,
  object_type TEXT NOT NULL,
  role_id TEXT NOT NULL REFERENCES rbac_role(id),
  permissions JSONB NOT NULL            -- 读/写/执行 + 行级条件
);
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);     -- 审计按时间分区，冷热分离
```

### 3.5 AI 日志（S5）
```sql
CREATE TABLE agent_run (
  id TEXT PRIMARY KEY,
  agent_spec JSONB NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE semantic_search_log (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  ontology_context JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 4. 图遍历示例（递归 CTE 替代 Cypher）

查"修改接口 `Locatable` 会影响哪些对象类型"：
```sql
WITH RECURSIVE impacted AS (
  SELECT object_api_name FROM object_interface WHERE interface_api_name = 'Locatable'
)
SELECT * FROM impacted;
```
多层级继承/关系链可继续 `UNION` 展开，规模小（万级）性能无忧。

## 5. 关键约定

1. **派生属性不落库**：`derived=true` 的属性按 `reducer` 实时计算，避免双写不一致。
2. **权限在数据出口生效**：S6 policy 在查询下推前注入 WHERE 条件，而非读取后过滤。
3. **版本化**：沿用 `api_name + version` 对齐元数据与关系，保证定义+关系一起提交（事务）。
4. **凭据不落地明文**：`source_connection.secret_ref` 仅存引用，真实密钥由基础设施层（如 Vault）托管，S6 只负责引用与访问控制（S6 自身不托管密钥，见 S6 边界）。
5. **实例数据零副本**：本体层对实例的访问全部经 `ObjectMapping` 翻译成源方言 SQL（SparkSQL/PG/ClickHouse），只读。

## 6. 与 Palantir 的存储取舍

| Palantir | 本系统 |
|---|---|
| Foundry 多存储（数据集/图/对象存储） | ✅ 统一 PG 单一事实库 |
| Ontology 元数据可落专用存储 | ✅ PG 邻接表表达图拓扑 |
| 独立图数据库（大规模图遍历） | ⚠️ 裁剪；递归 CTE 满足当前规模 |
| 实例数据集独立存储 | ✅ 实例仍由数据中台持有，本体层虚拟化 |

> 结论：统一 PG 在"企业数据分析/决策"场景下足够，且显著降低运维成本；仅当未来出现亿级图边/复杂图算法需求时，再评估引入图扩展（Apache AGE）或专用图库。
