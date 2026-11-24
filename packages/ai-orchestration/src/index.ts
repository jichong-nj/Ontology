 // @ontology/ai-orchestration — AIP 配置平台核心
export { OpenAICompatibleLLM, heuristicIsReasoning } from './llm-gateway';
export type { ChatMessage, ToolSpec, ToolCall, LLMRequest, LLMResponse, LLMClientOptions } from './llm-gateway';
export { AIPAgent, buildAgentTools } from './agent';
export { trimHistory, estimateTokens } from './context';
export { parseXmlToolCalls } from './xml-tool-calls';
export type { ParsedXmlToolCalls } from './xml-tool-calls';
export type { AgentRuntime, AgentRunResult, ActiveModelRef } from './agent';
