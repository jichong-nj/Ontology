# 待办与技术债（Backlog）

> 记录已识别、暂未排期的改进项。完成一项就移到对应设计文档或删除。
> 最后更新：2026-11-23

## AIP 对话

### B1. 生成中状态与自动刷新
- **现象**：回答生成过程中切走页面、再切回来，只能看到提问（已在请求开始时落库），回答要等生成结束并**手动刷新**才出现。
- **原因**：前端切回时只加载一次会话消息，没有跟踪"该会话仍在生成"的状态。
- **建议**：会话级 pending 标记（服务端记录或前端 localStorage）＋ 返回时轮询/重连；或至少显示"回答生成中，稍后刷新"的提示。
- **优先级**：中（体验）
- **进展（2026-11-23）**：已实现"中断标记"——生成被中断时，落库内容追加「⏹ 回答已中断…」，避免看起来像话说一半；仍缺"返回页面自动刷新"。

### B2. 草案卡片的历史痕迹
- **现象**：对象/关系草案确认卡片只在当前会话可见；重开会话后卡片消失，只剩正文里的 JSON 代码块，也看不到"是否已创建"。
- **建议**：加载会话时重新解析草案，并按本体实际状态标注（类型是否已存在、实例数）；可选把确认结果写入消息 timeline，记录时间点。
- **优先级**：低

## 调度

### B8. 事件触发接线（已实现，2026-11-24）
- `writeObjectPatch` 成功后发布 `onObjectWrite` 事件；服务端按对象类型去抖 1 秒后调用 `RuleScheduler.handleObjectWrite`。
- 新增/启用规则时自动拉起调度器。
- 局限：只覆盖平台写入（同步/动作/函数）；源库变更仍需同步或 CDC 拉取；规则动作引发的写入有 1 秒抑制窗口防自激。
- 仍缺：定时同步调度、CDC、cron 表达式。
- 2026-11-24：智能体已可创建函数/动作/规则（`create_function` / `create_action` / `create_rule`，带引用校验）；沙箱函数禁止直接建规则/动作（防绕过后门）。

## 权限与审计

> 策略：先做能力（工具集），权限延后；但**审计不能延后**——事后追溯是权限系统设计的输入。

### B9. 工具调用审计（最高优先级）
- **现状**：只有会话 `timeline` 记录工具调用，删会话即丢失，无法按"谁/何时/调了什么工具/改了什么"检索。
- **建议**：新增 `agent_tool_call(id, agent_id, conversation_id, tool, args_json, ok, error, actor, created_at)`，
  在 `buildToolMap` 的统一入口包装记录；保留结果摘要与耗时。
- **理由**：没有审计就无法回答"谁通过智能体改了数据"，权限系统缺少事实依据。
- **优先级**：高（约 0.5~1 天）

### B10. 工具风险分级与确认机制
- **现状**：所有工具平级，`create_rule` 会在后台自动执行，误建不易发现。
- **建议**：工具标注 `read / write / admin`；admin 类（建规则、删函数、批量写）默认关闭或要求显式确认
  （由前端确认后传 `confirm:true`，而不是让模型自行填写）。
- **优先级**：中高

### B11. 对象类型白名单统一收口
- **现状**：仅 `get_instances` / `get_object_links` / `aggregate` / `histogram` 检查 Agent 的 `objectTypes` 白名单；
  `inspect_object_type` / `add_object_type_property` / `compute_derived` / `create_function` 未检查。
- **建议**：在工具入口统一做对象类型授权校验，避免后续加权限时逐个改。
- **优先级**：中

### B12. 身份占位
- **现状**：写入 actor 只是字符串（`sync:source`、`fn:xxx`），无真实用户身份。
- **建议**：工具入口解析 `X-User`（或临时 `demo-user`），写入审计与 `object_write.actor`；后续接 SSO 只替换解析逻辑。
- **优先级**：中

### B13. 权限模型（远期）
- 主体：user / role / agent（服务账号）
- 权限点：`object_type:read/write`、`function:invoke`、`action:trigger`、`rule:manage`、`sql:query(tables)`、`source:read`
- 对象级：行级过滤 + 列级脱敏（Explore 与 API 同时生效，不能只在前端）
- 审批：建规则、删除类型、批量写等高风险操作走审批
- 审计：全量工具调用 + 数据访问 + SQL 记录
- **实施顺序**：能力期（当前）→ 审计+风险分级 → 身份+RBAC → 对象级策略/审批 → 沙箱迁独立 worker（安全隔离）

## 关系与实例

### B3. 删除实例时未级联清理关系边
- **现象**：`link_instance` 的 rid 是软引用，对象实例被删除后边会残留成"孤儿"。
- **建议**：提供一致性清理任务（按 link_type 两端扫描无对应 object_write 的边）或删除对象类型/实例时级联清边。
- **优先级**：中

### B4. managed 关系写入入口
- **现象**：`instanceSource='managed'` 已预留，但没有创建/删除手工关系边的 API 或 UI。
- **建议**：`POST/DELETE /api/s2/link-instances`，并在 Explore 关系面板提供编辑。
- **优先级**：中

## 建模能力（详见 `docs/PALANTIR-PK-ALIGNMENT.md`）

> **属性语义（P0–P3）已完成（2026-11-24）**：属性 description/allowedValues、值类型 ValueType（enum/range/regex）、
> 写入校验（WRITE_VALIDATION=off|warn|reject）、动作参数约束、validation_issue 健康记录、
> 属性 unit/format/defaultValue（同步填充）。

### B5. 自选主键 `primaryKeyProperty`
- 允许对象类型用业务键（如 `emp_code`）作为主键，避免为跨键关联补冗余列。
- 优先级：P0（该文档第 4 节）

### B6. 标题模板 `titleTemplate`
- 多字段组合标题（同步时物化），减少每张表加 `title` 列。
- 优先级：P1（该文档第 7 节）

## 列表接口

### B7. conversations / messages 分页
- 目前 `GET /aip/agents/:id/conversations` 与 `GET /aip/conversations/:cid/messages` 仍全量返回。
- 建议：加 `limit/offset`，消息按时间倒序分页加载。
- 优先级：低
