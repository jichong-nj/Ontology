// AIP Agent 运行时 —— 单一多能力 Agent
// 设计：一个 Agent 通过 function-calling 承载本体的全部能力（函数/动作/规则/探索/告警）。
// 与具体 HTTP 解耦：由 server 注入 Runtime（进程内直接调用 repo / sandbox / 调度器 / pool）。

import { OpenAICompatibleLLM, type ChatMessage, type ToolSpec, type ToolCall } from './llm-gateway';
import { parseXmlToolCalls, stripToolCallXml } from './xml-tool-calls';
import type { AIPAgentConfig } from '@ontology/ontology-core';

// 运行时激活的模型引用：包含模型名与其所属 provider 的接入点
export interface ActiveModelRef {
  apiName: string;       // 调用 API 用的模型名
  baseUrl: string;       // provider 的 base_url
  apiKey?: string;
  accessToken?: string;  // 预留：部分 provider 用 Bearer
  isReasoning?: boolean;
  maxTokens?: number;
}

// 进程内能力执行器（由 server 注入，避免 Agent 自己拼 SQL）
export interface AgentRuntime {
  listFunctions(opts?: { keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  listActions(opts?: { keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  listRules(opts?: { keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  listObjectTypes(opts?: { objectTypes?: string[]; keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  invokeFunction(name: string, args: Record<string, unknown>): Promise<unknown>;
  triggerAction(name: string, args: Record<string, unknown>): Promise<unknown>;
  runRules(): Promise<unknown>;
  listAlerts(opts?: { keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  getInstances(objectType: string, opts?: { filter?: unknown[]; pageSize?: number; pageToken?: string }): Promise<unknown>;
  getObjectLinks(objectType: string, objectRid: string): Promise<unknown>;
  aggregate(objectType: string, property: string, topN?: number): Promise<unknown>;
  histogram(objectType: string, property: string, buckets?: number): Promise<unknown>;
  // 受限 NL2SQL：仅允许只读 SELECT，在 S1 源库执行；allowTables 为白名单（来自 S2 元数据的真实表名）
  runSql(sql: string, allowTables: string[], limit?: number): Promise<unknown>;
  // 数据源建模：列出已接入的 S1 数据源（供"引入某表建对象类型"流程选源）
  listSourceConnections(): Promise<Array<{ id: string; displayName: string; dbType?: string; database?: string }>>;
  // 关系建模：关系类型列表 / 单个对象类型完整定义（含属性映射）
  listLinkTypes(opts?: { keyword?: string; limit?: number; offset?: number }): Promise<unknown>;
  getObjectType(apiName: string): Promise<unknown>;
  // 派生/函数建模：注册函数、给对象类型加属性、计算派生属性验证
  createFunction(def: {
    apiName: string; displayName: string; description?: string; body: string;
    kind?: 'query' | 'edit'; pure?: boolean;
    inputs?: Array<Record<string, unknown>>; outputSpec?: Array<Record<string, unknown>>;
  }): Promise<unknown>;
  deleteFunction(apiName: string): Promise<unknown>;
  upsertObjectTypeProperty(apiName: string, property: Record<string, unknown>): Promise<unknown>;
  computeDerived(objectType: string, property: string, rid: string): Promise<unknown>;
  // 平台生成型对象的实例删除（带关系级联）
  deleteInstance(objectType: string, objectRid: string): Promise<unknown>;
  listValueTypes(): Promise<unknown>;
  // 自动化：创建动作（effect 指向已注册函数）与规则（触发 + 条件函数 + 动作）
  createAction(def: {
    apiName: string; displayName: string; description?: string; effectFunction: string;
    parameters?: Array<Record<string, unknown>>;
    preconditions?: Array<Record<string, unknown>>;
  }): Promise<unknown>;
  createRule(def: {
    apiName: string; displayName: string; enabled?: boolean;
    trigger: { kind: 'schedule'; intervalSeconds: number } | { kind: 'event'; on: 'object_write'; objectType: string };
    conditionFunction: string; actionApiName: string;
    params?: Record<string, unknown>; targetObjectType?: string;
  }): Promise<unknown>;
  // 数据源建模：列出某 schema 下的全部表名（只读）
  listSourceTables(connId: string, schema?: string): Promise<unknown>;
  // 数据源建模：读取某数据源中一张表的完整结构 + 样例行（不落库，只供分析）
  inspectSourceTable(connId: string, schema: string, table: string): Promise<unknown>;
}

export interface AgentRunResult {
  reply: string;
  steps: Array<{ tool: string; args: unknown; result: unknown }>;
}

// 流式事件：让前端逐步展示「调用模型 → 思考 → 查询 → 动作 → 完成」
export type AgentEvent =
  | { type: 'call'; step: number; model: string }          // 即将向某模型发起第 step 次调用
  | { type: 'call_status'; step: number; ok: boolean; message?: string } // 该次调用成功/失败
  | { type: 'thought'; content: string; collapsed?: boolean } // 思考/思维链（可折叠查看）
  | { type: 'reply_chunk'; content: string }               // 最终答复的增量片段（流式）
  | { type: 'action'; id: string; step: number; tool: string; args: unknown } // 即将调用工具
  | { type: 'result'; id: string; step: number; tool: string; ok: boolean; result: unknown } // 工具返回
  | { type: 'error'; message: string }
  | { type: 'done'; reply: string }; // 最终答复（兜底，增量已通过 reply_chunk 推送）

const TOOL_GROUPS: Record<string, string[]> = {
  functions: ['invoke_function', 'list_functions'],
  actions: ['trigger_action', 'list_actions'],
  rules: ['run_rules', 'list_rules'],
  explore: ['list_object_types', 'get_instances', 'get_object_links', 'aggregate', 'histogram'],
  alerts: ['list_alerts'],
  // 受限 NL2SQL：LLM 生成只读 SELECT，在 S1 源库白名单表内执行（不回写源）
  sql: ['run_sql'],
  // 数据源建模：列出数据源 / 读取源表结构与样例（只读；创建动作需用户在前端确认）
  modeling: ['list_source_connections', 'list_source_tables', 'inspect_source_table', 'list_link_types', 'inspect_object_type', 'list_functions', 'create_function', 'delete_function', 'add_object_type_property', 'compute_derived', 'invoke_function', 'create_action', 'create_rule', 'delete_instance', 'list_value_types'],
};

function allToolSpecs(): ToolSpec[] {
  return [
    {
      type: 'function',
      function: {
        name: 'list_functions',
        description: '列出可用的 Ontology 函数（含说明与入参），用于发现能力。支持 keyword/limit/offset，返回 { total, count, hasMore, items }。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '按 apiName/显示名模糊过滤（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
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
        description: '列出已注册的动作（Action）。支持 keyword/limit/offset，返回 { total, count, hasMore, items }。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '按 apiName/显示名模糊过滤（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
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
        description: '列出自动化规则（含启用状态）。支持 keyword/limit/offset，返回 { total, count, hasMore, items }。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '按 apiName/显示名模糊过滤（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
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
        description: '列出本体中的对象类型（apiName/显示名/描述）。支持 keyword 模糊搜索与 limit/offset 分页；' +
          '返回 { total, count, hasMore, items }。对象类型较多时请先用 keyword 缩小范围，只依据本工具真实返回的类型作答，不得臆测。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '按 apiName/显示名模糊过滤（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_instances',
        description: '获取某对象类型的实例（对齐 Palantir 思路：支持属性过滤 + 游标分页）。' +
          'filter 为条件列表，每项 { property, operator, value }，operator 支持 eq/neq/gt/gte/lt/lte/contains/isNull（数值/日期比较按数值处理）；多条件 AND 组合。' +
          '返回 { data, nextPageToken }；nextPageToken 非空时带上它作为 pageToken 再调用以获取下一页；为空表示末页。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string', description: '对象类型 apiName' },
            filter: {
              type: 'array',
              description: '过滤条件数组，例：[{property:"dimissionRisk",operator:"gte",value:0.8}]',
              items: {
                type: 'object',
                properties: {
                  property: { type: 'string' },
                  operator: { type: 'string', enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'isNull'] },
                  value: {},
                },
                required: ['property', 'operator'],
              },
            },
            pageSize: { type: 'number', description: '每页条数，默认 100，上限 1000' },
            pageToken: { type: 'string', description: '上一页返回的 nextPageToken；首页不传' },
          },
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
        description: '列出当前告警对象（Alert 实例）。支持 keyword/limit/offset，返回 { total, count, hasMore, items }。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '在实例属性中模糊匹配（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'run_sql',
        description:
          '受限 NL2SQL：执行一条只读 SQL（仅允许 SELECT，禁止 INSERT/UPDATE/DELETE/DDL 等写操作；' +
          '只能查询白名单内的源库表，白名单来自 S2 元数据中的真实表名）。用于在对象/聚合查询无法覆盖时，' +
          '对底层 S1 源库做自由探索性查询。返回结果行数组（最多 limit 行）。' +
          '若生成的 SQL 涉及白名单外表或写操作，会被拒绝并返回错误。',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: '只读 SELECT 语句' },
            allowTables: {
              type: 'array',
              description: '允许查询的真实表名白名单（来自对象类型底表的 source_table/真实表名）。例：["hr_employee","am_asset"]',
              items: { type: 'string' },
            },
            limit: { type: 'number', description: '返回行数上限，默认 200，上限 1000' },
          },
          required: ['sql', 'allowTables'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_source_connections',
        description:
          '列出已接入的 S1 数据源（名称、类型、数据库）。用于"把某数据源里的某张表引入并创建对象类型"时先确定数据源。',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'create_function',
        description:
          '注册（或更新）一个 Ontology 函数。函数体必须是 TypeScript 源码，形如 "return async (args, ctx) => { ... }"；' +
          'ctx 提供 ctx.repo（读写仓库）、ctx.objects(objectType)（取实例）、ctx.links(linkType)（取关系边）。' +
          '用于实现多跳统计（平台声明式派生只支持单跳，多跳必须用函数）、或把计算结果写回实例属性。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string', description: '函数 apiName（PascalCase 或 camelCase，唯一）' },
            displayName: { type: 'string', description: '显示名' },
            description: { type: 'string', description: '函数说明' },
            body: { type: 'string', description: 'TS 源码，形如 return async (args, ctx) => { ... }' },
            kind: {
              type: 'string',
              enum: ['query', 'edit'],
              description: 'query=只读计算（可做派生属性/规则条件，沙箱禁止写对象）；edit=可写对象/关系（应通过 Action 触发）。默认 edit。',
            },
            pure: { type: 'boolean', description: '是否无副作用（query 恒 true）' },
            inputs: {
              type: 'array',
              description: '入参定义：[{name,type,required,description,valueType?,allowedValues?}]',
              items: { type: 'object' },
            },
            outputSpec: {
              type: 'array',
              description: '出参定义：[{name?,type,valueType?,description?}]；valueType 存在时会校验返回值',
              items: { type: 'object' },
            },
          },
          required: ['apiName', 'displayName', 'body'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'delete_function',
        description:
          '删除一个 Ontology 函数（用于清理探测/临时函数）。若该函数正被任何对象类型的派生属性（reducerFn）引用，会被拒绝并列出引用位置。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string', description: '要删除的函数 apiName' },
          },
          required: ['apiName'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_value_types',
        description: '列出现有值类型（Value Types）：apiName/基础类型/枚举或约束。给属性挂 valueType 前先查。',
        parameters: { type: 'object', properties: {} },
      },
    },
    {
      type: 'function',
      function: {
        name: 'add_object_type_property',
        description:
          '给已存在的对象类型新增/更新一个属性（按 apiName 覆盖）。可创建派生属性：' +
          'derived=true 且 reducerFn=<已注册函数 apiName>；派生属性不写源库、每次计算时调用函数。' +
          '不要给源表不存在的列编造 sourceMapping。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string', description: '对象类型 apiName，如 Organization' },
            property: {
              type: 'object',
              description:
                '属性定义（按 apiName 合并，只覆盖传入字段）：{apiName, displayName, type, required, derived, reducerFn, ' +
                'description, allowedValues, valueType, unit, format, defaultValue}。' +
                '枚举字段用 allowedValues 或已存在的 valueType；不要编造 valueType 名称。',
              properties: {
                apiName: { type: 'string' },
                displayName: { type: 'string' },
                type: { type: 'string', description: 'string/integer/float/boolean/date/timestamp' },
                required: { type: 'boolean' },
                derived: { type: 'boolean' },
                reducerFn: { type: 'string', description: '派生属性引用的函数 apiName' },
                description: { type: 'string', description: '属性语义说明（写入后 inspect_object_type 可复核）' },
                allowedValues: {
                  type: 'array',
                  description: '枚举取值：[{value,label,description}]',
                  items: { type: 'object' },
                },
                valueType: { type: 'string', description: '已存在的值类型 apiName（用 list_value_types 查看）' },
                unit: { type: 'string', description: '单位，如 小时/元' },
                format: { type: 'string', description: '展示格式，如 date/percent/currency' },
                defaultValue: { description: '同步时缺失值的默认填充' },
                derivation: {
                  type: 'object',
                  description:
                    '派生口径：{kind: linkAggregation|expression|function, function?, args?, resultNote?, ' +
                    'linkType?, direction?, targetProperty?, aggregation?, expression?}。' +
                    'function 模式必须引用已存在的函数；resultNote 写口径边界（如"仅统计 approved"）。',
                  properties: {
                    kind: { type: 'string', enum: ['linkAggregation', 'expression', 'function'] },
                    function: { type: 'string', description: '函数 apiName（kind=function）' },
                    args: { type: 'object', description: '参数绑定，如 {orgId:"$id"}' },
                    resultNote: { type: 'string', description: '口径说明/过滤边界' },
                    linkType: { type: 'string' },
                    direction: { type: 'string', enum: ['source', 'target'] },
                    targetProperty: { type: 'string' },
                    aggregation: { type: 'string', enum: ['count', 'countDistinct', 'avg', 'sum', 'min', 'max', 'collect'] },
                    expression: { type: 'string' },
                  },
                  required: ['kind'],
                },
              },
              required: ['apiName', 'displayName', 'type'],
            },
          },
          required: ['apiName', 'property'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'compute_derived',
        description:
          '计算某个派生属性在指定实例上的值（用于创建后验证）。objectType + property + rid（如 Organization:1）。' +
          '若属性不是派生属性或未绑定函数会报错。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string' },
            property: { type: 'string', description: '派生属性 apiName' },
            rid: { type: 'string', description: '对象实例 rid，如 Organization:1' },
          },
          required: ['objectType', 'property', 'rid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'delete_instance',
        description:
          '删除单个对象实例，并级联删除以它为端点的关系边。仅允许**平台生成型**对象（无 sourceTable，如 Alert）；' +
          '源映射型业务对象会被拒绝（需通过同步/业务侧处理）。删除前必须向用户确认 objectType 与 rid。',
        parameters: {
          type: 'object',
          properties: {
            objectType: { type: 'string', description: '对象类型 apiName，如 Alert' },
            objectRid: { type: 'string', description: '实例 rid，如 Alert:xxx（裸 id 也可，会自动补前缀）' },
          },
          required: ['objectType', 'objectRid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'create_action',
        description:
          '创建动作（Action），effect 指向一个已注册函数。规则命中后由该动作落地（写对象/通知等）。' +
          '创建前应先 list_functions 确认函数存在；action 会后台执行，创建前应向用户说明。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string', description: '动作 apiName' },
            displayName: { type: 'string' },
            description: { type: 'string' },
            effectFunction: { type: 'string', description: '已注册函数 apiName（动作执行时调用）' },
            parameters: {
              type: 'array',
              description: '参数定义（可选）：[{name,type,required,description,valueType?,allowedValues?}]；触发时按约束校验',
              items: { type: 'object' },
            },
          },
          required: ['apiName', 'displayName', 'effectFunction'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'create_rule',
        description:
          '创建自动化规则：trigger（schedule：intervalSeconds 最小 5；event：object_write + objectType）+ conditionFunction + actionApiName。' +
          '条件函数必须返回 {flagged:[...]} 才会执行动作。事件触发只覆盖平台写入（同步/动作/函数），源库直接改动不会触发。' +
          '规则创建后会自动在后台执行，请先向用户确认。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string' },
            displayName: { type: 'string' },
            enabled: { type: 'boolean', description: '默认 true' },
            trigger: {
              type: 'object',
              description: "schedule: {kind:'schedule', intervalSeconds:number}；event: {kind:'event', on:'object_write', objectType:string}",
              properties: {
                kind: { type: 'string', enum: ['schedule', 'event'] },
                intervalSeconds: { type: 'number' },
                on: { type: 'string', enum: ['object_write'] },
                objectType: { type: 'string' },
              },
              required: ['kind'],
            },
            conditionFunction: { type: 'string', description: '已注册函数 apiName' },
            actionApiName: { type: 'string', description: '已注册动作 apiName' },
            params: { type: 'object', description: '传给条件函数的参数' },
            targetObjectType: { type: 'string', description: '动作落点对象类型（写对象类动作用）' },
          },
          required: ['apiName', 'displayName', 'trigger', 'conditionFunction', 'actionApiName'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_link_types',
        description: '列出当前本体中已存在的关系类型（apiName/显示名/源对象/目标对象/基数），用于关系建模前避免重复。' +
          '支持 keyword 模糊搜索与 limit/offset 分页，返回 { total, count, hasMore, items }。',
        parameters: {
          type: 'object',
          properties: {
            keyword: { type: 'string', description: '按 apiName/显示名模糊过滤（可选）' },
            limit: { type: 'number', description: '返回条数，默认 100，上限 500' },
            offset: { type: 'number', description: '偏移量，默认 0' },
          },
          required: [],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'inspect_object_type',
        description:
          '读取某个对象类型的完整定义：属性列表（含 sourceMapping 源列映射）、源连接/源表、titleProperty。' +
          '用于设计关系类型时确认外键列与主键属性。',
        parameters: {
          type: 'object',
          properties: {
            apiName: { type: 'string', description: '对象类型 apiName，如 Organization' },
          },
          required: ['apiName'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_source_tables',
        description:
          '列出某个 S1 数据源指定 schema 下的全部表名（只读）。当用户问"这个数据源有哪些表"或开始建模前，' +
          '先调用本工具拿到真实表名，再对具体表调用 inspect_source_table。不要靠猜测表名。',
        parameters: {
          type: 'object',
          properties: {
            connId: { type: 'string', description: '数据源连接 id（来自 list_source_connections）' },
            schema: { type: 'string', description: 'schema 名，PostgreSQL 通常为 public' },
          },
          required: ['connId'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'inspect_source_table',
        description:
          '读取某个 S1 数据源中一张表的结构（字段名/类型/是否主键/是否可空）与少量样例行，用于分析该表如何建模。' +
          '只读，不会修改源库，也不会创建任何对象类型。',
        parameters: {
          type: 'object',
          properties: {
            connId: { type: 'string', description: '数据源连接 id（来自 list_source_connections）' },
            schema: { type: 'string', description: 'schema 名，PostgreSQL 通常为 public' },
            table: { type: 'string', description: '表名' },
          },
          required: ['connId', 'table'],
        },
      },
    },
  ];
}

function buildToolMap(rt: AgentRuntime, cfg: AIPAgentConfig) {
  const allowed = cfg.objectTypes ?? [];
  const deny = (objectType: string) =>
    allowed.length > 0 && !allowed.includes(objectType)
      ? { error: `该 Agent 无权访问对象类型 "${objectType}"（白名单：${allowed.join(', ')}）` }
      : null;
  return {
    list_functions: async (a: any) => listEnvelope(await rt.listFunctions({ keyword: a?.keyword, limit: a?.limit, offset: a?.offset }), a?.offset),
    invoke_function: async (a: any) => rt.invokeFunction(a.name, a.args ?? {}),
    list_actions: async (a: any) => listEnvelope(await rt.listActions({ keyword: a?.keyword, limit: a?.limit, offset: a?.offset }), a?.offset),
    trigger_action: async (a: any) => rt.triggerAction(a.name, a.args ?? {}),
    list_rules: async (a: any) => listEnvelope(await rt.listRules({ keyword: a?.keyword, limit: a?.limit, offset: a?.offset }), a?.offset),
    run_rules: async () => rt.runRules(),
    list_object_types: async (a: any) => {
      const r: any = await rt.listObjectTypes({
        objectTypes: allowed, keyword: a?.keyword, limit: a?.limit, offset: a?.offset,
      });
      if (Array.isArray(r)) return r;
      return { total: r.total, count: r.items.length, hasMore: (a?.offset ?? 0) + r.items.length < r.total, items: r.items };
    },
    get_instances: async (a: any) => {
      const err = deny(a.objectType);
      if (err) return err;
      return rt.getInstances(a.objectType, {
        filter: a.filter,
        pageSize: a.pageSize,
        pageToken: a.pageToken,
      });
    },
    get_object_links: async (a: any) => {
      const err = deny(a.objectType);
      if (err) return err;
      return rt.getObjectLinks(a.objectType, a.objectRid);
    },
    aggregate: async (a: any) => {
      const err = deny(a.objectType);
      if (err) return err;
      return rt.aggregate(a.objectType, a.property, a.topN);
    },
    histogram: async (a: any) => {
      const err = deny(a.objectType);
      if (err) return err;
      return rt.histogram(a.objectType, a.property, a.buckets);
    },
    list_alerts: async (a: any) => listEnvelope(await rt.listAlerts({ keyword: a?.keyword, limit: a?.limit, offset: a?.offset }), a?.offset),
    run_sql: async (a: any) => {
      const allow = Array.isArray(a.allowTables) ? a.allowTables : [];
      return rt.runSql(a.sql, allow, a.limit);
    },
    list_source_connections: async () => rt.listSourceConnections(),
    list_link_types: async (a: any) => {
      const r: any = await rt.listLinkTypes({ keyword: a?.keyword, limit: a?.limit, offset: a?.offset });
      if (Array.isArray(r)) return r;
      return { total: r.total, count: r.items.length, hasMore: (a?.offset ?? 0) + r.items.length < r.total, items: r.items };
    },
    inspect_object_type: async (a: any) => rt.getObjectType(a.apiName),
    create_function: async (a: any) =>
      rt.createFunction({ apiName: a.apiName, displayName: a.displayName, description: a.description, body: a.body, kind: a.kind, pure: a.pure, inputs: a.inputs, outputSpec: a.outputSpec }),
    delete_function: async (a: any) => rt.deleteFunction(a.apiName),
    add_object_type_property: async (a: any) => rt.upsertObjectTypeProperty(a.apiName, a.property),
    list_value_types: async () => rt.listValueTypes(),
    compute_derived: async (a: any) => rt.computeDerived(a.objectType, a.property, a.rid),
    delete_instance: async (a: any) => {
      const err = deny(a.objectType);
      if (err) return err;
      return rt.deleteInstance(a.objectType, a.objectRid);
    },
    create_action: async (a: any) => rt.createAction({
      apiName: a.apiName, displayName: a.displayName, description: a.description,
      effectFunction: a.effectFunction, parameters: a.parameters, preconditions: a.preconditions,
    }),
    create_rule: async (a: any) => rt.createRule({
      apiName: a.apiName, displayName: a.displayName, enabled: a.enabled,
      trigger: a.trigger, conditionFunction: a.conditionFunction, actionApiName: a.actionApiName,
      params: a.params, targetObjectType: a.targetObjectType,
    }),
    list_source_tables: async (a: any) => rt.listSourceTables(a.connId, a.schema),
    inspect_source_table: async (a: any) =>
      rt.inspectSourceTable(a.connId, a.schema || 'public', a.table),
  } as Record<string, (args: any) => Promise<unknown>>;
}

// 供 MCP 复用：返回启用工具的 JSON Schema 列表与执行映射（与内置智能体同一套）
export function buildAgentTools(rt: AgentRuntime, cfg: AIPAgentConfig): {
  specs: ToolSpec[];
  toolMap: Record<string, (args: any) => Promise<unknown>>;
} {
  return { specs: selectTools(cfg.enabledTools ?? []), toolMap: buildToolMap(rt, cfg) };
}

function selectTools(enabled: string[]): ToolSpec[] {
  const allowed = new Set<string>();
  for (const g of enabled) {
    for (const t of TOOL_GROUPS[g] ?? []) allowed.add(t);
  }
  return allToolSpecs().filter((s) => allowed.has(s.function.name));
}

function listEnvelope(r: any, offset = 0) {
  if (Array.isArray(r)) return r;
  return {
    total: r.total,
    count: r.items.length,
    hasMore: offset + r.items.length < r.total,
    items: r.items,
  };
}

function safeStringify(v: unknown): string {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length > 20000 ? s.slice(0, 20000) + '…(截断)' : s;
  } catch {
    return String(v);
  }
}

export class AIPAgent {
  private rt: AgentRuntime;
  private cfg: AIPAgentConfig;
  private active: ActiveModelRef | null = null;
  private llm: OpenAICompatibleLLM;

  constructor(cfg: AIPAgentConfig, rt: AgentRuntime, active?: ActiveModelRef) {
    this.cfg = cfg;
    this.rt = rt;
    if (!active) {
      throw new Error('未指定模型，请在 Agent 配置中选择模型（modelScope/defaultModelId）');
    }
    this.active = active;
    this.llm = new OpenAICompatibleLLM({
      baseURL: active.baseUrl,
      apiKey: active.apiKey || undefined,
      timeoutMs: 180_000,
    });
  }

  // 运行时切换模型（用户在前端下拉切换）。同时重建 LLM 接入点。
  setActiveModel(ref: ActiveModelRef): void {
    this.active = ref;
    this.llm = new OpenAICompatibleLLM({
      baseURL: ref.baseUrl,
      apiKey: ref.apiKey || undefined,
      timeoutMs: 180_000,
    });
  }

  private currentModelName(): string {
    return this.active?.apiName ?? 'local-model';
  }

  async run(message: string, history: ChatMessage[] = []): Promise<AgentRunResult> {
    const tools = selectTools(this.cfg.enabledTools);
    const messages: ChatMessage[] = [
      { role: 'system', content: this.cfg.systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const toolMap = buildToolMap(this.rt, this.cfg);
    const steps: AgentRunResult['steps'] = [];

    for (let step = 0; step < this.cfg.maxSteps; step++) {
      let resp;
      try {
        resp = await this.llm.chat({
          model: this.currentModelName(),
          messages,
          temperature: this.cfg.temperature,
          maxTokens: this.active?.maxTokens,
          tools,
        });
      } catch (e: any) {
        return { reply: `调用模型失败：${e.message}`, steps };
      }

      // 本地模型可能把工具调用输出成 XML 文本：兜底解析成 tool_calls
      {
        const parsed = parseXmlToolCalls(resp.content ?? '');
        if (parsed.calls.length) {
          console.warn('[agent] 检测到 XML 工具调用，已自动转换:', parsed.calls.map((c) => c.function.name).join(','));
          // 即使网关已返回 toolCalls，也要把文本里的 XML 去掉，避免泄漏到回复
          resp = {
            ...resp,
            content: parsed.cleaned || null,
            toolCalls: resp.toolCalls?.length ? resp.toolCalls : parsed.calls,
          };
        } else if ((resp.content ?? '').includes('<tool_call')) {
          resp = { ...resp, content: stripToolCallXml(resp.content ?? '') || null };
        }
      }

      // 没有工具调用 → 直接返回最终答复
      if (!resp.toolCalls || resp.toolCalls.length === 0) {
        return { reply: resp.content ?? resp.reasoningContent ?? '(模型未返回内容)', steps };
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
      model: this.currentModelName(),
      messages,
      temperature: this.cfg.temperature,
      maxTokens: this.active?.maxTokens,
      tools: [], // 最后一步不再允许调用工具，强制产出总结
    });
    return { reply: final.content ?? '(已达到最大步数，未能总结)', steps };
  }

  // 流式运行：逐步 yield 事件（调用状态/思考/动作/结果/答复增量），用于前端实时展示
  async *runStream(message: string, history: ChatMessage[] = []): AsyncGenerator<AgentEvent> {
    const tools = selectTools(this.cfg.enabledTools);
    const messages: ChatMessage[] = [
      { role: 'system', content: this.cfg.systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const toolMap = buildToolMap(this.rt, this.cfg);

    for (let step = 0; step < this.cfg.maxSteps; step++) {
      const modelName = this.currentModelName();
      yield { type: 'call', step, model: modelName };
      let resp;
      let gotReplyChunk = false;
      try {
        // 第一次流式：用于探测工具调用 + 流式输出思考/推理
        let accThought = '';
        let contentBuf = '';
        let emittedLen = 0;
        let toolCalls: ToolCall[] = [];
        const HOLDBACK = 48; // 暂扣尾部，避免把 <tool_call> 前缀当正文发出
        for await (const chunk of this.llm.chatStream({
          model: modelName,
          messages,
          temperature: this.cfg.temperature,
          maxTokens: this.active?.maxTokens,
          tools,
        })) {
          if (chunk.delta.reasoningContent) {
            accThought += chunk.delta.reasoningContent;
            if (accThought.trim()) {
              yield { type: 'thought', content: chunk.delta.reasoningContent, collapsed: true };
            }
          }
          if (chunk.delta.content) {
            contentBuf += chunk.delta.content;
            const xmlIdx = contentBuf.indexOf('<tool_call');
            const safeEnd = xmlIdx >= 0 ? xmlIdx : Math.max(emittedLen, contentBuf.length - HOLDBACK);
            if (safeEnd > emittedLen) {
              const piece = contentBuf.slice(emittedLen, safeEnd);
              emittedLen = safeEnd;
              if (piece) {
                gotReplyChunk = true;
                yield { type: 'reply_chunk', content: piece };
              }
            }
          }
          if (chunk.finished) {
            toolCalls = chunk.toolCalls;
          }
        }
        // XML 兜底：部分本地模型把 tool_call 当文本输出；剥离并转成真实工具调用
        let parsedCalls = toolCalls;
        let finalContent = contentBuf;
        const xmlParsed = parseXmlToolCalls(contentBuf);
        if (xmlParsed.calls.length) {
          console.warn('[agent] 检测到 XML 工具调用(stream)，已自动转换:', xmlParsed.calls.map((c) => c.function.name).join(','));
          // 即使网关已返回 toolCalls，也要剥离文本 XML，避免泄漏到回复
          finalContent = xmlParsed.cleaned;
          if (!parsedCalls || parsedCalls.length === 0) parsedCalls = xmlParsed.calls;
        } else if (finalContent.includes('<tool_call')) {
          finalContent = stripToolCallXml(finalContent);
        }
        // 补发剩余正文（若剥离了 XML，只补发 cleaned 中尚未发出的部分）
        const flushTarget = finalContent === contentBuf ? contentBuf : finalContent;
        if (flushTarget.length > emittedLen) {
          const piece = flushTarget.slice(emittedLen);
          if (piece) {
            gotReplyChunk = true;
            yield { type: 'reply_chunk', content: piece };
          }
          emittedLen = flushTarget.length;
        }
        resp = {
          content: finalContent || null,
          reasoningContent: accThought || undefined,
          toolCalls: parsedCalls,
        };
        yield { type: 'call_status', step, ok: true };
      } catch (e: any) {
        yield { type: 'call_status', step, ok: false, message: e.message };
        yield { type: 'error', message: `调用模型失败：${e.message}` };
        return;
      }

      // 没有工具调用 → 视作最终答复（增量已通过 reply_chunk 推送）
      if (!resp.toolCalls || resp.toolCalls.length === 0) {
        const finalReply = resp.content ?? resp.reasoningContent ?? '(模型未返回内容)';
        if (!gotReplyChunk) {
          yield { type: 'reply_chunk', content: finalReply };
        }
        yield { type: 'done', reply: finalReply };
        return;
      }

      messages.push({
        role: 'assistant',
        content: resp.content,
        tool_calls: resp.toolCalls.map((tc: ToolCall) => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments },
        })),
      });

      for (const tc of resp.toolCalls) {
        const fn = toolMap[tc.function.name];
        const args = safeParseArgs(tc.function.arguments);
        yield { type: 'action', id: tc.id, step, tool: tc.function.name, args };
        let result: unknown;
        let ok = true;
        try {
          result = fn ? await fn(args) : { error: `未知工具: ${tc.function.name}` };
        } catch (e: any) {
          result = { error: e.message };
          ok = false;
        }
        yield { type: 'result', id: tc.id, step, tool: tc.function.name, ok, result };
        messages.push({
          role: 'tool',
          content: safeStringify(result),
          tool_call_id: tc.id,
        });
      }
    }

    // 达到步数上限：强制让模型总结（流式）
    yield { type: 'call', step: this.cfg.maxSteps, model: this.currentModelName() };
    let finalText = '';
    try {
      for await (const chunk of this.llm.chatStream({
        model: this.currentModelName(),
        messages,
        temperature: this.cfg.temperature,
        maxTokens: this.active?.maxTokens,
        tools: [],
      })) {
        if (chunk.delta.content) {
          finalText += chunk.delta.content;
          yield { type: 'reply_chunk', content: chunk.delta.content };
        }
      }
      yield { type: 'call_status', step: this.cfg.maxSteps, ok: true };
    } catch (e: any) {
      yield { type: 'call_status', step: this.cfg.maxSteps, ok: false, message: e.message };
      finalText = '(已达到最大步数，未能总结)';
    }
    yield { type: 'done', reply: finalText };
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
