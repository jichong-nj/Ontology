// S5 AI 决策编排 — LLM 网关抽象与语义注入契约（不绑定厂商）

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface LLMTool {
  name: string;
  description: string;
  ref: string;             // 对应 S2 Action / Function 调用声明
}

export interface OntologySchemaInject {
  objectTypes: { apiName: string; properties: string[] }[];
  linkTypes: { apiName: string; ends: [string, string] }[];
}

export interface LLMCompletionRequest {
  messages: LLMMessage[];
  tools?: LLMTool[];
  ontologyContext?: OntologySchemaInject;
}

export interface LLMCompletionResponse {
  content: string;
  toolCalls?: { name: string; args: Record<string, unknown> }[];
}

// 抽象接口：对接 OpenAI / 本地模型 / 其他厂商均实现此接口
export interface LLMProvider {
  complete(req: LLMCompletionRequest): Promise<LLMCompletionResponse>;
}
