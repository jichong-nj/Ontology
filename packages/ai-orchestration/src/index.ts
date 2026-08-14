 // @ontology/ai-orchestration — AIP 配置平台核心
export { OpenAICompatibleLLM, heuristicIsReasoning } from './llm-gateway';
export type { ChatMessage, ToolSpec, ToolCall, LLMRequest, LLMResponse, LLMClientOptions } from './llm-gateway';
export { AIPAgent } from './agent';
export type { AgentRuntime, AgentRunResult, ActiveModelRef } from './agent';
