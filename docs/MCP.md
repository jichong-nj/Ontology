# Ontology MCP 接口

把系统内智能体的工具集通过 **MCP（Model Context Protocol）** 暴露给外部客户端，工具与内置智能体**同一套实现**（26 个工具，默认全部工具组）。

## 端点

- **Streamable HTTP**：`POST http://127.0.0.1:4000/mcp`（无状态、JSON 响应）
- **stdio 桥**（给只支持 stdio 的桌面客户端，如 Claude Desktop）：

```bash
cd apps/server
MCP_URL=http://127.0.0.1:4000/mcp [MCP_TOKEN=xxx] node mcp-stdio.mjs
```

## 工具集

默认包含全部工具组（与内置智能体一致）：

`functions, actions, rules, explore, alerts, sql, modeling`

可用环境变量限制：

```bash
MCP_TOOL_GROUPS=explore,sql   # 只读场景建议只开这两个
```

## 鉴权

- 设置 `MCP_TOKEN` 后，HTTP 端点要求 `Authorization: Bearer <token>`；
- 未设置则不做鉴权（仅适合本机临时使用）。

## 客户端配置示例

**Claude Desktop（stdio）**：

```json
{
  "mcpServers": {
    "ontology": {
      "command": "node",
      "args": ["/home/jichong/Projects/Ontology/apps/server/mcp-stdio.mjs"],
      "env": { "MCP_URL": "http://127.0.0.1:4000/mcp" }
    }
  }
}
```

**支持 Streamable HTTP 的客户端**：

```
url: http://127.0.0.1:4000/mcp
headers: Authorization: Bearer <MCP_TOKEN>   # 如已设置
```

## 安全提示

- 工具集与内置智能体**完全一致**，包含 `create_rule`、`create_function`、`delete_instance`、`run_sql` 等管理能力；
- 目前**没有** RBAC、审批流、独立审计表（见 BACKLOG B9–B13），因此：
  - 不要直接暴露到公网；
  - 至少设置 `MCP_TOKEN`；
  - 外部客户端建议用 `MCP_TOOL_GROUPS` 限制为只读工具组；
- 外部智能体不会读取我们的系统提示词，服务端校验（值类型、query/edit、只读隔离等）仍然生效，但"创建前确认"这类提示词级约束不生效。

## 自测

```bash
# 工具列表
node -e "import('@modelcontextprotocol/sdk/client/index.js').then(async ({Client})=>{const {StreamableHTTPClientTransport}=await import('@modelcontextprotocol/sdk/client/streamableHttp.js');const c=new Client({name:'t',version:'1'});await c.connect(new StreamableHTTPClientTransport(new URL('http://127.0.0.1:4000/mcp')));const r=await c.listTools();console.log(r.tools.length, r.tools.map(t=>t.name).join(','));await c.close();})"
```
