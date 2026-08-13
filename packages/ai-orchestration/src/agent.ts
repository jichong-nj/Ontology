// AIP Agent 运行时 —— 单一多能力 Agent
// 设计：一个 Agent 通过 function-calling 承载本体的全部能力（函数/动作/规则/探索/告警）。
// 与具体 HTTP 解耦：由 server 注入 Runtime（进程内直接调用 repo / sandbox / 调度器 / pool）。

import { OpenAICompatibleLLM, type ChatMessage, type ToolSpec, type ToolCall } from './llm-gateway';
import type { AIPAgentConfig } from '@ontology/ontology-core';

// 进程内能力执行器（由 server 注入，避免 Agent 自己拼 SQL）
export interface AgentRuntime {
  listFunctions(): Promise<Array<{ apiName: string; displayName: string; description?: string; inputs: unknown }>>;
  listActions(): Promise<Array<{ apiName: string; displayName: string; effect?: unknown }>>;
  listRules(): Promise<Array<{ apiName: string; displayName: string; enabled: boolean }>>;
  listObjectTypes(): Promise<Array<{ apiName: string; displayName: string; description?: string }>>;
  invokeFunction(name: string, args: Record<string, unknown>): Promise<unknown>;
  triggerAction(name: string, args: Record<string, unknown>): Promise<unknown>;
  runRules(): Promise<unknown>;
  listAlerts(): Promise<unknown>;
  getInstances(objectType: string): Promise<unknown>;
  getObjectLinks(objectType: string, objectRid: string): Promise<unknown>;
  aggregate(objectType: string, property: string, topN?: number): Promise<unknown>;
  histogram(objectType: string, property: string, buckets?: number): Promise<unknown>;
}

export interface AgentRunResult {
  reply: string;
  steps: Array<{ tool: string; args: unknown; result: unknown }>;
}

const TOOL_GROUPS: Record<string, string[]> = {
  functions: ['invoke_function', 'list_functions'],
  actions: ['trigger_action', 'list_actions'],
  rules: ['run_rules', 'list_rules'],
  explore: ['list_object_types', 'get_instances', 'get_object_links', 'aggregate', 'histogram'],
  alerts: ['list_alerts'],
};

function allToolSpecs(): ToolSpec[] {
  return [
    {
      type: 'function',
      function: {
        name: 'list_functions',
        description: '列出所有可用的 Ontology 函数（含说明与入参），用于发现能力。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'invoke_function',
        description: '执行一个 Ontology 函数（如离职风险评估 evaluateDimissionRisk），传入函数名与参数。',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '函数 apiName' },
            args: { type: 'object', description: '函数入参对象' },
          },
          required: ['name', 'args'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_actions',
        description: '列出所有已注册的动作（Action）。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'trigger_action',
        description: '触发一个动作（如生成告警 createDimissionAlert），传入动作名与参数。',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '动作 apiName' },
            args: { type: 'object', description: '动作参数对象' },
          },
          required: ['name', 'args'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_rules',
        description: '列出所有自动化规则（含启用状态）。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'run_rules',
        description: '手动触发全部自动化规则（如离职风险评分并生成告警）。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_object_types',
        description: '列出本体中所有对象类型（Employee/Department/Product/Device/Project/LeaveRecord/Alert 等）。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_instances',
        description: '获取某对象类型的全部实例及其属性。',
        parameters: {
          type: 'object',
          properties: { objectType: { type: 'string', description: '对象类型 apiName' } },
          required: ['objectType'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_object_links',
        description: '获取某对象实例的全部关联关系（按 link_type 分组，含对端对象）。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string', description: '对象类型 apiName' },
            objectRid: { type: 'string', description: '对象实例 rid' },
          },
          required: ['objectType', 'objectRid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'aggregate',
        description: '按某属性对对象实例分组计数（如按部门统计人数、按职级统计）。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string' },
            property: { type: 'string', description: '属性 apiName' },
            topN: { type: 'number', description: '返回前 N 组，默认 20' },
          },
          required: ['objectType', 'property'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'histogram',
        description: '对数值属性做直方图分桶（如工时、薪资分布）。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string' },
            property: { type: 'string', description: '数值属性 apiName' },
            buckets: { type: 'number', description: '桶数，默认 20' },
          },
          required: ['objectType', 'property'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_alerts',
        description: '列出当前所有告警对象（Alert 实例）。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
  ];
}

function buildToolMap(rt: AgentRuntime) {
  return {
    list_functions: async () => rt.listFunctions(),
    invoke_function: async (a: any) => rt.invokeFunction(a.name, a.args ?? {}),
    list_actions: async () => rt.listActions(),
    trigger_action: async (a: any) => rt.triggerAction(a.name, a.args ?? {}),
    list_rules: async () => rt.listRules(),
    run_rules: async () => rt.runRules(),
    list_object_types: async () => rt.listObjectTypes(),
    get_instances: async (a: any) => rt.getInstances(a.objectType),
    get_object_links: async (a: any) => rt.getObjectLinks(a.objectType, a.objectRid),
    aggregate: async (a: any) => rt.aggregate(a.objectType, a.property, a.topN),
    histogram: async (a: any) => rt.histogram(a.objectType, a.property, a.buckets),
    list_alerts: async () => rt.listAlerts(),
  } as Record<string, (args: any) => Promise<unknown>>;
}

function selectTools(enabled: string[]): ToolSpec[] {
  const allowed = new Set<string>();
  for (const g of enabled) {
    for (const t of TOOL_GROUPS[g] ?? []) allowed.add(t);
  }
  return allToolSpecs().filter((s) => allowed.has(s.function.name));
}

function safeStringify(v: unknown): string {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length > 4000 ? s.slice(0, 4000) + '…(截断)' : s;
  } catch {
    return String(v);
  }
}

export class AIPAgent {
  private llm: OpenAICompatibleLLM;
  private rt: AgentRuntime;
  private cfg: AIPAgentConfig;

  constructor(cfg: AIPAgentConfig, rt: AgentRuntime) {
    this.cfg = cfg;
    this.rt = rt;
    this.llm = new OpenAICompatibleLLM({
      baseURL: cfg.baseUrl,
      apiKey: cfg.apiKey || undefined,
      timeoutMs: 180_000,
    });
  }

  async run(message: string, history: ChatMessage[] = []): Promise<AgentRunResult> {
    const tools = selectTools(this.cfg.enabledTools);
    const messages: ChatMessage[] = [
      { role: 'system', content: this.cfg.systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const toolMap = buildToolMap(this.rt);
    const steps: AgentRunResult['steps'] = [];

    for (let step = 0; step < this.cfg.maxSteps; step++) {
      let resp;
      try {
        resp = await this.llm.chat({
          model: this.cfg.model,
          messages,
          temperature: this.cfg.temperature,
          tools,
        });
      } catch (e: any) {
        return { reply: `调用模型失败：${e.message}`, steps };
      }

      // 没有工具调用 → 直接返回最终答复
      if (!resp.toolCalls || resp.toolCalls.length === 0) {
        return { reply: resp.content ?? '(模型未返回内容)', steps };
      }

      // 记录 assistant 的工具调用请求
      messages.push({
        role: 'assistant',
        content: resp.content,
        tool_calls: resp.toolCalls.map((tc: ToolCall) => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments },
        })),
      });

      // 逐个执行工具并把结果回灌
      for (const tc of resp.toolCalls) {
        const fn = toolMap[tc.function.name];
        let result: unknown;
        try {
          const args = safeParseArgs(tc.function.arguments);
          result = fn ? await fn(args) : { error: `未知工具: ${tc.function.name}` };
        } catch (e: any) {
          result = { error: e.message };
        }
        steps.push({ tool: tc.function.name, args: safeParseArgs(tc.function.arguments), result });
        messages.push({
          role: 'tool',
          content: safeStringify(result),
          tool_call_id: tc.id,
        });
      }
    }

    // 达到步数上限仍未产出纯文本：再请求一次让模型总结
    const final = await this.llm.chat({
      model: this.cfg.model,
      messages,
      temperature: this.cfg.temperature,
      tools: [], // 最后一步不再允许调用工具，强制产出总结
    });
    return { reply: final.content ?? '(已达到最大步数，未能总结)', steps };
  }
}

function safeParseArgs(s: string): any {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
