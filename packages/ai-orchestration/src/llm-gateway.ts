// AIP LLM 网关 —— OpenAI 兼容协议实现
// 默认对接本地模型（LM Studio / Ollama），如 http://localhost:1234/v1，无需 API key。
// 通过 baseURL + apiKey 可切换到任意 OpenAI 兼容服务（通义/DeepSeek/Ollama 等）。

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  // tool 角色消息（工具返回结果）需要关联调用 id
  tool_call_id?: string;
  // 工具调用请求（assistant 发出）
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string }; // arguments 为 JSON 字符串
}

export interface ToolSpec {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>; // JSON Schema
  };
}

export interface LLMRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  tools?: ToolSpec[];
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}

export interface LLMResponse {
  content: string | null;
  toolCalls: ToolCall[];
}

export interface LLMClientOptions {
  baseURL: string;
  apiKey?: string;
  // fetch 超时（毫秒），本地模型推理较慢可放宽
  timeoutMs?: number;
}

export class OpenAICompatibleLLM {
  private baseURL: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(opts: LLMClientOptions) {
    this.baseURL = opts.baseURL.replace(/\/$/, '');
    this.apiKey = opts.apiKey ?? '';
    this.timeoutMs = opts.timeoutMs ?? 120_000;
  }

  async chat(req: LLMRequest): Promise<LLMResponse> {
    const body: Record<string, unknown> = {
      model: req.model,
      messages: req.messages.map((m) => {
        const o: Record<string, unknown> = { role: m.role, content: m.content };
        if (m.tool_calls) o.tool_calls = m.tool_calls;
        if (m.tool_call_id) o.tool_call_id = m.tool_call_id;
        return o;
      }),
      temperature: req.temperature,
    };
    if (req.tools && req.tools.length > 0) {
      body.tools = req.tools;
      body.tool_choice = req.toolChoice ?? 'auto';
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    let res: Response;
    try {
      res = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (e: unknown) {
      clearTimeout(timer);
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`调用 LLM 失败（${this.baseURL}）：${msg}`);
    }
    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`LLM 返回 ${res.status}: ${text.slice(0, 500)}`);
    }
    const data = await res.json();
    const choice = data.choices?.[0];
    if (!choice) throw new Error('LLM 响应缺少 choices');
    const msg = choice.message ?? {};
    return {
      content: msg.content ?? null,
      toolCalls: (msg.tool_calls ?? []).map((tc: any) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.function?.name, arguments: tc.function?.arguments ?? '{}' },
      })),
    };
  }
}
