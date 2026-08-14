# S5 AI 决策编排子系统 — 需求文档

> 对标 Palantir：AIP（LLM 函数 / 语义搜索 / 智能体编排 / Ontology 增强生成）
> 定位：**重要子系统**。以 Ontology 语义为底座，提供 RAG 检索、本体感知生成、智能体编排与自然语言问数。

## 1. 概述

S5 把 LLM 能力深度融入 Ontology。它不把 AI 当作外挂聊天框，而是让 AI 理解本体的对象/关系/动作，从而：
- **语义搜索**：用自然语言检索对象与文档（RAG）。
- **LLM 函数**：本体感知的生成与分析（如"总结这个客户的风险点"）。
- **智能体编排**：多步推理，调用 S2 Action / Function 完成决策流程。
- **自然语言问数**：把自然语言转成对象查询（NL2Query）。

设计原则：**本体语义注入、工具可调用、可审计**。所有 AI 行为都基于 S2 元数据，且受 S6 权限与审计约束。

## 2. 边界与依赖

### 上游
- **S2 Ontology 内核**：schema 注入、可调用 Action/Function、对象语义。
- **S1 数据接入与映射**：检索语料来源（对象实例 + 文档）。
- **S6 权限与治理**：AI 可见对象受权限过滤；AI 动作受审计。

### 下游 / 被嵌入
- **S4 应用构建**：应用内可嵌入 AI 决策组件。
- **S3 分析与探索**：AI 结果可回写分析上下文。

### 不在范围内
- ❌ 自研大模型（仅通过 LLMProvider 抽象对接外部/本地模型）。
- ❌ 脱离 Ontology 的通用聊天（所有回答锚定本体语义）。

## 3. 一级功能需求

### F5.1 语义搜索（RAG）
**用户故事**：作为分析师，我想问"哪些客户上个月有过逾期且集中在华东？"，系统返回相关对象与依据片段。

**输入**：自然语言查询。
**输出**：相关对象列表 + 引用片段（来自对象属性/文档）。

**规则**：
- 检索语料为 S2 对象实例 + 关联文档，受 S6 权限过滤。
- 返回须带可溯源引用，禁止无依据编造。

### F5.2 LLM 函数（本体感知）
**用户故事**：作为风控员，我想对选中的一批客户调用"风险摘要"LLM 函数，生成结构化摘要。

**输入**：对象集 + LLM 函数名（`OntologyFunction` 标记为 `llm`）。
**输出**：生成文本 / 结构化字段。

**规则**：
- 函数上下文自动注入相关 S2 对象 schema 与实例。
- 输出可回写 S2 派生属性（需通过 Action 治理）。
- **运行时分期决策（见 S2 F2.6）**：第一期 `OntologyFunction` 沙箱只执行 `language: 'typescript'`；`language: 'python'` 仅保留接口枚举与占位实现，不接入真实沙箱运行时。智能体编排（F5.3）对 Python 函数只能 resolve 规划、不能 invoke 执行。

### F5.3 智能体编排
**用户故事**：作为运营，我想让智能体"排查异常订单→定位关联账户→生成处置建议并标记"，自动串起多个步骤。

**输入**：目标描述 + 可用工具（S2 Action / Function / 检索）。
**输出**：执行轨迹（思考→调用→结果）+ 最终建议。

**规则**：
- 智能体只能调用被显式授权的 S2 Action/Function。
- 每步调用受 S6 权限与审计记录。

### F5.4 自然语言问数（NL2Query）
**用户故事**：作为非技术用户，我想用中文问"本月销售额 Top10 客户是谁"，系统直接给出对象列表/图表。

**输入**：自然语言问题。
**输出**：等价 `ObjectQuery`（见 S3）+ 结果。

**规则**：
- NL 转为受限查询（禁止 DML）。
- 失败时可反问澄清，不强行执行。

## 4. 接口契约

```typescript
// packages/ai-orchestration/src/llm-gateway.ts

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface LLMTool {
  name: string;
  description: string;
  // 对应 S2 Action / Function 的调用声明
  ref: string;
}

export interface LLMCompletionRequest {
  messages: LLMMessage[];
  tools?: LLMTool[];
  ontologyContext?: OntologySchemaInject; // 注入 S2 schema
}

export interface LLMCompletionResponse {
  content: string;
  toolCalls?: { name: string; args: Record<string, unknown> }[];
}

// LLMProvider 抽象：不绑定厂商
export interface LLMProvider {
  complete(req: LLMCompletionRequest): Promise<LLMCompletionResponse>;
}

// 本体语义注入契约
export interface OntologySchemaInject {
  objectTypes: { apiName: string; properties: string[] }[];
  linkTypes: { apiName: string; ends: [string, string] }[];
}

// REST 契约（示意）
// POST /api/s5/semantic-search    语义搜索
// POST /api/s5/llm-functions/:name 调用 LLM 函数
// POST /api/s5/agents/run         智能体编排执行
// POST /api/s5/nl2query           自然语言问数
```

## 5. 实现状态（实际路由）

S5 AI 决策编排**已实现**（`packages/ai-orchestration` + `apps/server/src/index.ts` 的 `/api/aip/*`），设计文档中的 `/api/s5/*` 示意路径已被 `/api/aip/*` 取代：

- **配置三层**：`/api/aip/providers`（Provider CRUD，含 `base_url` 默认空串，移除 localhost 硬编码）、`/api/aip/models`（Model CRUD，可调 `maxTokens`/`contextWindow`/`isReasoning`）、`/api/aip/agents`（Agent 配置，绑定可用工具：functions / actions / rules / explore / alerts）。
- **对话执行**：
  - `POST /api/aip/agent/:id/stream` —— **流式对话（SSE）**，逐帧推送事件：`call` / `thought` / `reply_chunk` / `action` / `result` / `done` / `error`。
  - `POST /api/aip/agent/:id/run` —— 非流式（兼容）。
- **工具调用**：`AIPAgent` 基于本体语义注入 + 工具声明，多步串联 S2 函数/动作/规则/探索完成复杂任务；前端 `AIPPage.vue` 实时渲染思考过程与回复（markdown）。
- **LLM 网关**：`llm-gateway.ts` 抽象 `LLMProvider`（OpenAI 兼容协议），支持本地 qwen 等推理服务；`chatStream` 支持 token 级流式。

> 注：语义搜索（RAG）/NL2Query 在当前实现中以"智能体工具调用"形式落地（explore / functions 工具），未单列独立 REST 端点。

## 5. 对比 Palantir 的裁剪说明

| Palantir 能力 | 本系统处理 |
|---|---|
| AIP 语义搜索 / Ontology 增强 RAG | ✅ 保留 |
| AIP Logic / LLM 函数 | ✅ 保留（本体感知生成/分析） |
| AIP 智能体编排（多步推理） | ✅ 保留核心，复杂自愈编排留接口 |
| Ontology 自然语言问数 | ✅ 保留（NL2Query） |
| 多模型厂商绑定 / 私有模型训练 | ⚠️ 通过 LLMProvider 抽象解耦，不内置训练 |

> AI 子系统是**重点投入方向**，尽量完整；仅对"模型自研/私有训练"做解耦裁剪。
