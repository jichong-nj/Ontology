# S1 数据接入与映射 — 接口文档（实现态）

> 本文件描述 S1 当前**已实现**的 SDK 接口（代码见 `packages/data-integration/src`）。
> 需求背景见 `docs/S1-data-integration.md`；存储表见 `docs/S0-storage-design.md`。

## 1. 包结构

```
packages/data-integration/
├── src/
│   ├── mapping-model.ts          # 类型：SourceConnection / ObjectMapping / FieldMapping
│   ├── mapping-store.pg.ts       # PostgresMappingStore（持久化）
│   ├── mapping-service.ts        # MappingService（质量门禁）
│   └── index.ts                  # 公共导出
```

## 2. 类型契约

### SourceConnection（源连接，强制只读）
```ts
interface SourceConnection {
  id: string;
  displayName: string;
  kind: 'database' | 'warehouse' | 'api' | 'file';
  readOnly: true;                       // 编译期即锁定为 true
  connectionMeta: Record<string, unknown>;
  secretRef: string;                    // 仅存引用（如 vault://hr），不存明文
  status: 'connected' | 'error' | 'pending';
  createdAt: string; updatedAt: string;
}
```

### ObjectMapping（对象↔源 映射）
```ts
interface FieldMapping { property: string; sourceColumn: string; }

interface ObjectMapping {
  id: string;
  objectType: string;                   // 关联 S2 ObjectType.apiName（不强制 FK）
  sourceConnectionId: string;           // 外键 → source_connection(id)
  sourceTable: string;
  fieldMappings: FieldMapping[];
  incrementalMeta: { cursorColumn?: string; syncMode: 'full' | 'incremental' };
  qualityStatus: 'unknown' | 'passed' | 'warning' | 'failed';
  createdAt: string; updatedAt: string;
}
```

## 3. SDK 接口

### PostgresMappingStore
| 方法 | 签名 | 说明 |
|---|---|---|
| 注册源连接 | `createSourceConnection(c: SourceConnection): Promise<void>` | 落 `source_connection`（read_only 强制 TRUE） |
| 列源连接 | `listSourceConnections(): Promise<SourceConnection[]>` | 返回时 `readOnly` 恒为 true |
| 创建映射 | `createObjectMapping(m: ObjectMapping): Promise<void>` | 落 `object_mapping` |
| 列映射 | `listObjectMappings(): Promise<ObjectMapping[]>` | — |
| 更新质量 | `updateQualityStatus(id, status): Promise<void>` | 直接改 `quality_status` |

### MappingService（门禁核心）
```ts
class MappingService {
  constructor(store: PostgresMappingStore, metadata: MetadataRepository);
  registerSourceConnection(c: SourceConnection): Promise<void>;
    // 门禁：c.readOnly !== true 直接抛错（"必须 readOnly=true"）
  createObjectMapping(m: ObjectMapping): Promise<{ qualityStatus }>;
    // 校验：
    // - 目标 ObjectType 不存在 → qualityStatus='failed'（仍落库，但不发布）
    // - 存在但 fieldMapping.property 有缺失 → 'warning'
    // - 全部属性命中 → 'passed'
  listObjectMappings(): Promise<ObjectMapping[]>;
  setQualityStatus(id, status): Promise<void>;
}
```

## 4. 使用样例
```ts
import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from '@ontology/data-integration';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const svc = new MappingService(
  new PostgresMappingStore(pool),
  new PostgresMetadataRepository(pool),
);

await svc.registerSourceConnection({ id: 'hr', displayName: 'HR', kind: 'database',
  readOnly: true, connectionMeta: {}, secretRef: 'vault://hr', status: 'connected',
  createdAt: '', updatedAt: '' });

const { qualityStatus } = await svc.createObjectMapping({
  id: 'm-person', objectType: 'Person', sourceConnectionId: 'hr', sourceTable: 't_person',
  fieldMappings: [{ property: 'name', sourceColumn: 'name' }],
  incrementalMeta: { syncMode: 'full' }, qualityStatus: 'unknown', createdAt: '', updatedAt: '',
});
```

## 5. 测试覆盖（真实 PostgreSQL）
见 `packages/data-integration/src/mapping-service.test.ts`：
- 源连接只读门禁（readOnly=false 抛错）
- 映射质量门禁三态：对象缺失→`failed`、属性不全→`warning`、完整→`passed`

## 6. 与 S2 的依赖边界
- `MappingService` 通过 `MetadataRepository.getObjectType` 校验目标对象类型存在性，不反向写 S2。
- 源端始终只读，映射配置只描述"如何读取"，不触发写回。
- 动作（S2 Action）需写本体侧时走 `object_write`，不触碰本模块源表。
