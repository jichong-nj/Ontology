# S2 Ontology 内核 — 接口文档（实现态）

> 本文件描述 S2 当前**已实现**的 SDK 接口（代码见 `packages/ontology-core/src`）。
> 需求背景见 `docs/S2-ontology-core.md`；存储表见 `docs/S0-storage-design.md`。

## 1. 包结构

```
packages/ontology-core/
├── src/
│   ├── types.ts                     # 核心类型 + MetadataRepository / 运行时引擎契约
│   ├── metadata-repository.pg.ts    # PostgresMetadataRepository（真实 PG 实现）
│   ├── interface-method-engine.ts   # DefaultInterfaceMethodEngine（多态分派）
│   ├── function-sandbox.ts          # TypeScriptFunctionSandbox（第一期 TS 沙箱）
│   └── index.ts                     # 公共导出
```

## 2. 核心类型（节选）
详见 `types.ts`：`ObjectType` / `LinkType` / `InterfaceDef` / `InterfaceMethod` / `ActionType` / `OntologyFunction` / `PropertyDef` / `PropertyType`。
关键约束：
- `ObjectType.implementsInterfaces` 反查由 `object_interface` 表维护。
- `OntologyFunction.language: 'typescript' | 'python'`（python 仅占位，见 §5）。
- `ActionType.effect: { kind: 'function' | 'write'; ref }`，`write` 落 `object_write`。

## 3. MetadataRepository（统一 PG 邻接表）
存储抽象接口，当前唯一实现 `PostgresMetadataRepository`。

| 方法 | 签名 | 说明 |
|---|---|---|
| 对象类型 | `listObjectTypes()` / `getObjectType(apiName)` / `createObjectType(def)` | CRUD；读取自动聚合 `implementsInterfaces` |
| 关系类型 | `listLinkTypes()` / `createLinkType(def)` | — |
| 关系实例 | `createLinkInstance(linkType, sourceRid, targetRid)` / `listLinkInstances(linkType, sourceRid?)` | 本体侧图拓扑（`link_instance`） |
| 可写侧 | `writeObjectPatch(objectType, objectRid, patch, actor)` | Action `effect.kind='write'` 落 `object_write` |
| 接口 | `listInterfaces()` / `setObjectInterface(objectApi, interfaceApi)` | 对象↔接口绑定 |
| 方法多态 | `bindInterfaceMethod(obj, iface, method, fn)` / `resolveInterfaceMethod(obj, iface, method): string\|null` | 绑定/解析实现函数 |
| 影响分析 | `getObjectsImplementing(interfaceApi): string[]` | 查实现某接口的所有对象 |
| 动作/函数 | `createAction(def)` / `createFunction(def)` / `getFunction(apiName)` | 落库 + 按名取函数（含语言） |

**初始化**
```ts
import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
const repo = new PostgresMetadataRepository(new Pool({ connectionString: process.env.DATABASE_URL }));
```

## 4. 接口方法运行时引擎
`DefaultInterfaceMethodEngine`：解析多态绑定 → 沙箱执行。
```ts
interface InterfaceMethodEngine {
  invoke(ctx: MethodInvocationContext): Promise<MethodInvocationResult>;
  resolve(ctx: MethodInvocationContext): Promise<string | null>; // 仅解析（供 S5 规划）
}
```
- `MethodInvocationContext`: `{ objectType, objectRid, interfaceApi, methodApi, args }`
- `MethodInvocationResult`: `{ ok, value?, error?, executedFunction? }`
- 未绑定实现 → `{ ok:false, error:"No implementation bound..." }`

**使用**
```ts
const engine = new DefaultInterfaceMethodEngine(repo, sandbox);
const res = await engine.invoke({
  objectType: 'Person', objectRid: 'p1', interfaceApi: 'Named', methodApi: 'greet', args: { name: 'Bob' },
});
```

## 5. 函数运行时分期（见 S2 F2.6 / S5 F5.2）
- `TypeScriptFunctionSandbox`：第一期唯一可执行运行时，按 `apiName` 注册 TS 函数。
- `language='python'`：`engine.invoke` 在解析后、执行前检查语言，python 返回
  `{ ok:false, error:"Python 函数暂未实现（第一期仅支持 TypeScript 沙箱）" }`；
  `resolve` 仍返回其 `apiName`（可见、可规划，供智能体编排）。

```ts
const sandbox = new TypeScriptFunctionSandbox();
sandbox.register('Person.greet', (args) => `hi ${args.name}`);
```

## 6. 测试覆盖（真实 PostgreSQL）
见 `packages/ontology-core/src/metadata-repository.pg.test.ts`（5 用例）：
1. 对象类型创建/读取（含接口反查）
2. 关系类型 + 关系实例（图拓扑维护）
3. 本体可写侧 `object_write`（动作 write 落库）
4. 接口方法多态绑定与 `getObjectsImplementing`
5. 运行时引擎：python 返回未实现 / typescript 可执行

## 7. 建表
DDL：`packages/ontology-core/sql/schema.sql`（执行：`npm run db:init`，需 `DATABASE_URL`）。
