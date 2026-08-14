// AIP LLM 网关 —— OpenAI 兼容协议实现
// AIP LLM 网关，对接任意 OpenAI 兼容服务（本地 LM Studio / Ollama / 通义 / DeepSeek 等）。
// 接入点由 Provider/Model 配置提供（baseURL + apiKey），不再内置任何硬编码端点。

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
  reasoningContent?: string; // 思维链/推理内容（qwen3.6 等推理模型）
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
      max_tokens: 4096,
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
      reasoningContent: (msg as any).reasoning_content ?? undefined,
      toolCalls: (msg.tool_calls ?? []).map((tc: any) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.function?.name, arguments: tc.function?.arguments ?? '{}' },
      })),
    };
  }

  // 流式对话：通过 SSE 解析逐块增量返回。每次 yield 一个 delta：
  //  - delta.content：正文增量
  //  - delta.reasoningContent：推理/思维链增量
  //  - finished：本块是否为该次请求的最后一帧（包含已累计的 toolCalls）
  // 累积所有 delta 即可得到与 chat() 等效的 LLMResponse。
  async *chatStream(req: LLMRequest): AsyncGenerator<{
    delta: { content: string; reasoningContent: string };
    finished: boolean;
    toolCalls: ToolCall[];
  }> {
    const body: Record<string, unknown> = {
      model: req.model,
      messages: req.messages.map((m) => {
        const o: Record<string, unknown> = { role: m.role, content: m.content };
        if (m.tool_calls) o.tool_calls = m.tool_calls;
        if (m.tool_call_id) o.tool_call_id = m.tool_call_id;
        return o;
      }),
      temperature: req.temperature,
      max_tokens: 4096,
      stream: true,
      stream_options: { include_usage: false },
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
    if (!res.body) throw new Error('LLM 流式响应缺少 body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let fullReasoning = '';
    let fullContent = '';
    const toolAcc: Record<number, { id?: string; name?: string; args: string }> = {};

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const frames = buf.split('\n');
      buf = frames.pop() ?? '';
      for (const raw of frames) {
        const line = raw.trim();
        if (!line || !line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;
        let json: any;
        try { json = JSON.parse(data); } catch { continue; }
        const d = json.choices?.[0]?.delta ?? {};
        const rc: string = d.reasoning_content ?? '';
        const c: string = d.content ?? '';
        if (rc) fullReasoning += rc;
        if (c) fullContent += c;
        // 累计增量式 tool_calls（流式下 arguments 分片）
        if (Array.isArray(d.tool_calls)) {
          for (const tc of d.tool_calls) {
            const idx = tc.index ?? 0;
            toolAcc[idx] = toolAcc[idx] ?? { args: '' };
            if (tc.id) toolAcc[idx].id = tc.id;
            if (tc.function?.name) toolAcc[idx].name = tc.function.name;
            if (tc.function?.arguments) toolAcc[idx].args += tc.function.arguments;
          }
        }
        yield {
          delta: { content: c, reasoningContent: rc },
          finished: false,
          toolCalls: [],
        };
      }
    }

    const toolCalls: ToolCall[] = Object.values(toolAcc).map((t) => ({
      id: t.id ?? '',
      type: 'function',
      function: { name: t.name ?? '', arguments: t.args || '{}' },
    }));

    yield {
      delta: { content: '', reasoningContent: '' },
      finished: true,
      toolCalls,
    };
  }

  // 探测供应商下的模型列表（GET /v1/models），返回模型名数组。
  async listModels(): Promise<Array<{ id: string; owned_by?: string; created?: number }>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(this.timeoutMs, 15_000));
    let res: Response;
    try {
      res = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        signal: controller.signal,
      });
    } catch (e: unknown) {
      clearTimeout(timer);
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`探测模型失败（${this.baseURL}）：${msg}`);
    }
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`模型探测返回 ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    const arr = Array.isArray(data?.data) ? data.data : [];
    return arr.map((m: any) => ({
      id: m.id ?? m.name ?? '',
      owned_by: m.owned_by,
      created: m.created,
    })).filter((m: any) => !!m.id);
  }
}

// 探测返回里启发式判断是否推理模型（带思维链的模型通常在名字里含关键词）
export function heuristicIsReasoning(modelId: string): boolean {
  const s = modelId.toLowerCase();
  return /reason|think|r1|qwq|qwen.*[.-]?(3[.-]?\d|2\.5).*(instruct|think)?|deepseek-r|o\d/.test(s)
    || /(qwen\d|qwq|deepseek|glm-z1|llama.*think)/.test(s);
}
