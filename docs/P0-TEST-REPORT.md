# P0 查询能力建设 · 测试报告

日期：2026-11-25
范围：数据分析/找数相关的 4 项 P0 能力（不含权限、白名单等治理项）

## 1. 能力对照

| 能力 | 改造前 | 改造后 |
|---|---|---|
| 过滤后聚合 | ❌ | ✅ `aggregate.filter` |
| 聚合指标 | ❌ 仅分组计数 | ✅ count / countDistinct / sum / avg / min / max |
| 分组 | ⚠️ 仅属性分组计数 | ✅ property / date / related(外键→对端属性) / link(关系遍历) |
| 排序/限制 | ⚠️ 仅分组 topN | ✅ orderBy（指标或 key）+ order + limit |
| 时间窗口 | ❌ | ✅ `dateFilter.lastNDays`（aggregate / get_instances） |
| 时间分桶 | ❌ | ✅ `groupBy.date`（day/week/month） |
| 关联对象过滤 | ❌ | ✅ `relatedFilter`（外键 → 对端属性，如上级邮箱） |
| Search Around | ❌ 仅单对象 links | ✅ `search_around`（对象集 ↔ 关系 ↔ 对端对象集） |
| 派生属性参与查询 | ❌ | ✅ filter / groupBy.property / metrics（内存回退） |

## 2. 实现位置

- `packages/ontology-core/src/metadata-repository.pg.ts`
  - `listInstances`：`dateFilter` / `relatedFilter` / `rids`
  - `aggregateQuery`：过滤 + 指标 + 分组 + 排序；派生属性走 `aggregateDerived`
  - `searchAround`：对象集沿关系遍历到对端对象集
- `packages/ai-orchestration/src/agent.ts`
  - `aggregate` 工具扩展新参数（兼容旧 `property/topN`）
  - `get_instances` 支持 `dateFilter/relatedFilter`
  - 新增 `search_around` 工具
- `apps/server/src/index.ts`
  - runtime 支持 `aggregateQuery`（传沙箱以计算 reducerFn 派生值）与 `searchAround`

## 3. 测试用例（MCP 实调）

| # | 场景 | 请求要点 | 期望 | 实际 |
|---|---|---|---|---|
| 1 | 过滤后计数 | Employee `leaveDays > 4`，count | 2 | ✅ 2 |
| 2 | 分组平均 | Employee groupBy departmentId，avg workHours | 每部门均值 | ✅ 1:9 / 10:8.5 / ... |
| 3 | 按部门名分组 | groupBy related(Department.name)，avg workHours | 部门中文名 | ✅ 总部 9 / 产线二组 8.5 ... |
| 4 | 去重计数 | LeaveRecord countDistinct employeeId | 12 | ✅ 12 |
| 5 | 时间分桶 | LeaveRecord groupBy startDate month | 按月计数 | ✅ 2026-01..09 |
| 6 | 时间窗口 | LeaveRecord dateFilter lastNDays=3650 | 14 | ✅ 14 |
| 7 | 关联过滤（聚合） | Employee relatedFilter managerId→email=10377... | 10 | ✅ 10 |
| 8 | 关联过滤（取数） | get_instances 同上，返回姓名 | 10 人 | ✅ 10 人 |
| 9 | Search Around | Department(软件研发组) → EmpWorksIn → Employee | 3 人 | ✅ 3 人 |
| 10 | Search Around | Device:1 → DeviceDepartment → Department | 1 个部门 | ✅ 软件研发组 |
| 11 | 关系分组 | Device groupBy link(DeviceDepartment→name)，count | 每部门设备数 | ✅ 软件研发组 3 / 生产制造部 3 |
| 12 | 派生属性过滤 | Employee filter leaveDaysRealtime > 4 | 2 | ✅ 2 |
| 13 | 派生属性分组 | groupBy departmentId，avg leaveDaysRealtime | 部门均值 | ✅ 部门5:4 / 部门4:2.5 ... |
| 14 | 混合过滤 | workHours < 6 AND leaveDaysRealtime >= 4 | 1 人，sum=4 | ✅ 1，4 |

## 4. 已知限制

1. 派生属性聚合走**内存回退**：逐实例 `computeDerived`，数据量大时性能差；分页上限 1000/页。
2. 派生属性暂不支持与 `relatedFilter`、`related/link 分组` 组合。
3. `relatedFilter` 只支持"外键属性值 = 对端 `id`"；跨键关联（emp_code→id）不支持。
4. `search_around` 的源对象集上限 1000；目标集一次取全量再过滤/分页。
5. 聚合只支持单维分组（属性/日期/关联/关系四选一），暂无多维度 group by、having。
6. `get_instances` 仍不支持按派生属性过滤（仅 aggregate 支持）。
7. 无接口（interface）/多类型对象集；复杂 join 仍需要 Ontology SQL（BACKLOG B15）。

## 5. 结论

P0 的四个业务高频形态（过滤后统计、跨对象关联、时间趋势、派生指标）已可**一次查询完成**，
不需要"多次查询 + 客户端拼接"；上面 14 个用例全部通过。剩余限制已列入 BACKLOG，下一步建议做 Ontology SQL 与查询性能优化。
