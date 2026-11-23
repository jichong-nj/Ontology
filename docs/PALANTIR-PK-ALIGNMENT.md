# 与 Palantir 的对齐差距：对象主键与关系关联

> 状态：差距记录 + 未来功能设计（自选主键尚未实现）
> 最后更新：2026-11-23
> 相关：`docs/S3-vs-palantir.md`（总体原语差距）、`link_instance` 关系实例、AIP 建模工具

## 0. 结论摘要

| 结论 | 说明 |
|---|---|
| Palantir 的 FK 关系**也必须匹配目标主键** | 文档原文：*"The foreign key matches the primary key of the linked object type"* |
| 但 Palantir **允许自选主键属性** | 建对象类型时可选任意唯一列（如 `emp_code`）作主键，因此跨键场景不需要补列 |
| 本平台目前 **RID 固定 = 源表主键** | 导致 `leave_record.emp_code → employee.id` 这类跨键关联必须补 `employee_id` 列 |
| 已对齐 | 多对多 **join table** 关系（2026-11-23 实现） |
| 待实现（未来功能） | **自选主键 `primaryKeyProperty`**（P0） |

## 1. 能力对照

| 能力 | Palantir Foundry | 本平台 | 状态 |
|---|---|---|---|
| 对象主键来源 | 创建时**任选**唯一属性 | 固定为源表物理主键 | ⚠️ 差距 |
| 一对多关系（外键） | 外键值 = 目标主键 | 外键值 = 目标 RID（`Type:源表PK`） | ✅ 对齐（值语义相同） |
| 多对多关系 | join table，两列分别映射两端主键 | `junctionTable/sourceColumn/targetColumn` | ✅ 已对齐（2026-11-23） |
| 跨键关联（FK→非主键属性） | **不支持**，需把业务键设为主键或在数据层 join 出主键列 | **不支持**，需补列（如 `employee_id`）或改主键 | ⚠️ 双方语义一致，但我们的绕行成本更高 |
| 关系实例存储 | backing datasource / join table | `link_instance(link_type, source_rid, target_rid)` | ✅ 对齐 |
| 变更主键 | 有影响评估与提示 | 无（尚未支持自选主键） | ⚠️ 差距 |

## 2. Palantir 的机制（依据公开文档）

- **FK 关系（one-to-one / one-to-many）**：在某端对象类型上选一个属性作为外键，指向另一端对象类型的**主键**；两端属性类型必须一致。
- **join table（many-to-many）**：用一个关联表做后备数据源，两列分别映射两端的主键；支持自动生成 join 表。
- **主键**：建对象类型时指定一个唯一属性，不要求是自增 id。

参考：
- https://www.palantir.com/docs/foundry/object-link-types/create-link-type
- https://palantir.com/docs/foundry/object-link-types/link-type-metadata
- https://www.palantir.com/docs/foundry/object-link-types/edit-link-types

## 3. 本平台现状与代价

- 对象实例 RID 规则：`${objectType}:${源表主键值}`，由 `syncObjectInstances` 的 `probe(主键列)` 决定，不可配置。
- 关系同步 `syncLinkInstances`：外键值直接拼成目标 RID。
- 结果：`leave_record.emp_code`（`E0005`）无法匹配 `Employee:5`。
- 当前绕行方案：`leave_record` 增加 `employee_id BIGINT REFERENCES employee(id)`，按 `emp_code` 回填（14/14），关系改为 `foreignKey=employee_id`。

代价：
1. 源表/对象类型多一列冗余（业务键仍保留）；
2. 每遇业务键关联都要人工判断、补列、回填；
3. 与"业务键天然唯一"的数据模型不自然。

## 4. 目标功能：自选主键（`primaryKeyProperty`）

### 4.1 数据模型

- `object_type` 新增可空列 `primary_key_property TEXT`（存属性 apiName，如 `empCode`）。
- `ObjectType.primaryKeyProperty?: string`；缺省 = 源表物理主键（保持现有行为）。
- 约束：所选属性必须唯一、非空；其 `sourceMapping` 指向源表列。

### 4.2 同步与 RID 规则

- 同步时若配置了 `primaryKeyProperty`：取该属性对应的源列值作为 RID：
  `rid = ${apiName}:${row[property.sourceMapping]}`
- 校验：
  - 值不能为 NULL/空；
  - 值必须唯一（重复则报错并列出冲突值）；
  - 否则拒绝同步，避免静默覆盖实例。

### 4.3 关系匹配

- 外键模式不变：`target_rid = targetType:外键值`（目标 RID 已改为业务键值，天然匹配）。
- join 表模式不变：两列值直接作两端 RID。
- 因此"自选主键"落地后，`LeaveRecord.emp_code → Employee.empCode` 可直接建关系，无需 `employee_id`。

### 4.4 创建入口

- **AIP 草案**：`object_type_draft` 增加可选 `primaryKeyProperty`；
- **UI**：对象类型编辑器增加"主键属性"下拉（列出源列唯一候选；默认源表主键）；
- **提示词**：建模时提示"业务键唯一可直接作为主键，避免补冗余外键列"。

### 4.5 兼容与迁移

- 新类型 opt-in；现有 4 个对象类型保持 `primary_key_property = NULL`（行为不变）。
- 变更已有类型的主键属于破坏性操作，需要：
  1. 暂停写入；
  2. 全量重同步该类型（RID 变更）；
  3. 重同步所有引用它的关系；
  4. 校验旧 RID 无残留（object_write / link_instance）。
- 建议提供"主键迁移预检"命令：统计受影响实例/关系数量后再执行。

### 4.6 验收标准

1. `Employee` 配 `primaryKeyProperty=empCode` 后：RID 变为 `Employee:E0001`…，28 条全量同步成功；
2. `LeaveRecord → Employee` 以 `foreignKey=emp_code` 建关系，同步出 14 条边；
3. 唯一性冲突（人为重复 emp_code）时报错并列出冲突值；
4. 未配置 `primaryKeyProperty` 的类型行为与现在完全一致（回归现有 5 条关系：17/9/28/4/6）。

### 4.7 工作量与风险

| 项 | 估计 |
|---|---|
| 模型/存储/同步/RID 生成 | 0.5 天 |
| 关系匹配与回归 | 0.5 天 |
| UI + AIP 草案 + 提示词 | 0.5 天 |
| 测试与迁移工具 | 0.5–1 天 |
| 风险 | 中：主键变更影响面大，需要迁移工具与预检 |

## 5. 已对齐：多对多 join table（2026-11-23 实现）

- `link_type` 新增 `junction_table / source_column / target_column`；
- `syncLinkInstances` 在 `junctionTable` 非空时直接读关联表生成边；
- `from-draft` 与关系类型编辑器支持；
- 实测：`device_department` → 6 条边（Device:1→Department:5 等）。

## 6. 明确暂不做：`targetMatchProperty`

- 可让"外键值 = 目标非主键属性"，但 Palantir 同样不支持（把 join 放在数据层）。
- 为保持语义简单、避免隐式 join 带来的性能与一致性问题，暂不把它作为主路径；
- 如未来确有需求，可作为一个显式的"逃生通道"（默认关闭、文档标注非标准）。

## 7. 后续路线

| 优先级 | 事项 | 说明 |
|---|---|---|
| P0 | 自选主键（本文第 4 节） | 解决业务键关联，减少冗余外键列 |
| P1 | 主键迁移预检与工具 | 变更主键的破坏性操作需要保护 |
| P2 | managed 关系写入 API | 手工/函数维护 `link_instance`（不依赖源表） |
| — | join table | ✅ 已完成 |
| — | targetMatchProperty | ❌ 暂不做（与 Palantir 对齐） |

## 8. 参考

- Palantir Create a link type：https://www.palantir.com/docs/foundry/object-link-types/create-link-type
- Palantir Link type metadata：https://palantir.com/docs/foundry/object-link-types/link-type-metadata
- Palantir Edit link types：https://www.palantir.com/docs/foundry/object-link-types/edit-link-types
- 本平台：`packages/ontology-core/src/metadata-repository.pg.ts`（RID/同步）、`apps/server/src/index.ts`（`syncObjectInstances` / `syncLinkInstances` / `from-draft`）
