#!/usr/bin/env node
// MCP stdio 桥：把本机 HTTP MCP 端点（/mcp）转成 stdio MCP 服务。
// 用法：MCP_URL=http://127.0.0.1:4000/mcp [MCP_TOKEN=xxx] node mcp-stdio.mjs
// 注意：stdio 协议占用 stdout，日志一律写 stderr。
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const url = process.env.MCP_URL || 'http://127.0.0.1:4000/mcp';
const token = process.env.MCP_TOKEN;
const opts = token ? { requestInit: { headers: { Authorization: `Bearer ${token}` } } } : undefined;

const client = new Client({ name: 'ontology-mcp-stdio', version: '0.1.0' });
await client.connect(new StreamableHTTPClientTransport(new URL(url), opts));

const server = new Server(
  { name: 'ontology-mcp-stdio', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => client.listTools());
server.setRequestHandler(CallToolRequestSchema, async (req) =>
  client.callTool({ name: req.params.name, arguments: req.params.arguments }),
);

await server.connect(new StdioServerTransport());
console.error(`[mcp-stdio] 已连接 ${url}`);
