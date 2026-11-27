// apps/server — 真实 S1/S2 API 聚合层
// 连接 ontology 元数据库，暴露 REST 端点供前端消费。
import express from 'express';
import { Pool } from 'pg';
import { PostgresMetadataRepository, TypeScriptFunctionSandbox, onObjectWrite, ensureRid, evaluateRuleCondition, isCronExpression } from '@ontology/ontology-core';
import { EmergencyService } from '@ontology/emergency-response';
import type { OntologyFunction, ActionType, AutomationRule } from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from '@ontology/data-integration';
import {
  functions,
  registerDimissionRisk,
  seedEnterpriseBiz,
  seedDepartmentInstances,
  seedEmployeeInstances,
  seedLeaveRecordInstances,
  seedBusinessObjectInstances,
  seedExtensionInstances,
  seedChildDetailInstances,
  startScheduler,
  buildSandbox,
  registerDbFunctions,
  runWithReadOnly,
} from '@ontology/enterprise-biz';
import { RuleScheduler } from '@ontology/ontology-core';
import { AIPAgent, trimHistory, estimateTokens, buildAgentTools } from '@ontology/ai-orchestration';
import type { AgentRuntime, ActiveModelRef } from '@ontology/ai-orchestration';
import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { OpenAICompatibleLLM, heuristicIsReasoning } from '@ontology/ai-orchestration';
import type { AIPAgentConfig, AIPProvider, AIPModel } from '@ontology/ontology-core';

const META_URL =
  process.env.META_DATABASE_URL ||
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: META_URL });
const repo = new PostgresMetadataRepository(pool);
const store = new PostgresMappingStore(pool);
const mappingSvc = new MappingService(store, repo);

// ---------- 业务场景引导（S3 实例下推 + 函数注册） ----------
// 共享沙箱：首次使用时惰性构建（注册企业业务函数），供 HTTP 调用与后台调度器复用。
let sharedSandbox: TypeScriptFunctionSandbox | null = null;
async function getSandbox(): Promise<TypeScriptFunctionSandbox> {
  if (!sharedSandbox) {
    sharedSandbox = buildSandbox(repo);
    await registerDbFunctions(repo, sharedSandbox);
  }
  return sharedSandbox;
}

let ruleScheduler: import('@ontology/ontology-core').RuleScheduler | null = null;

// ---------- 对象写入事件 → 事件触发规则（按 Automation 配置调度） ----------
// 去抖/批量策略由每条 Automation 的 trigger 配置决定（debounceMs / batchMode）。
onObjectWrite((e) => {
  if (!ruleScheduler) return;
  void ruleScheduler.dispatchObjectWrite(e.objectType, e.objectRid, e.patch, e.chain, {
    changeType: e.changeType, beforePatch: e.beforePatch, afterPatch: e.afterPatch,
  }).catch((err: any) => console.error('[scheduler] 事件调度失败:', err.message));
});

// ---------- 数据重新灌入（S1/S2/S3 bootstrap 的可复用实现） ----------
// 逐步执行并收集结果：单步失败不阻断后续步骤（如扩展域源表缺失时，核心数据仍能灌入）。
export interface ReingestStep { step: string; ok: boolean; error?: string }
export interface ReingestReport { ok: boolean; steps: ReingestStep[]; elapsedMs: number }

let reingestRunning = false;

async function runReingest(): Promise<ReingestReport> {
  if (reingestRunning) throw new Error('重新灌入正在进行中，请稍后再试');
  reingestRunning = true;
  const t0 = Date.now();
  const steps: ReingestStep[] = [];
  const run = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      steps.push({ step: name, ok: true });
    } catch (e: any) {
      console.error(`[reingest] ${name} 失败:`, e.message);
      steps.push({ step: name, ok: false, error: e.message });
    }
  };

  try {
    // 1) S1 数据源注册 + S2 对象/关系/函数/动作/规则定义同步
    await run('S1/S2 建模定义', () => seedEnterpriseBiz(pool));
    // 2) S3 实例下推（clear + 重插，全量覆盖）
    await run('部门实例 + 层级关系', () => seedDepartmentInstances(repo));
    await run('人员实例 + 隶属/汇报关系', () => seedEmployeeInstances(repo));
    await run('请假记录实例', () => seedLeaveRecordInstances(repo));
    await run('产品 / 设备 / 项目实例', () => seedBusinessObjectInstances(repo));
    await run('扩展域实例（220 表）', () => seedExtensionInstances(repo));
    await run('父子明细实例', () => seedChildDetailInstances(repo));
    // 3) 函数定义 + 沙箱注册 + 告警调度器
    await run('函数定义同步 + 沙箱注册', async () => {
      for (const fn of functions) {
        await repo.createFunction(fn);
      }
      await getSandbox();
    });
    await run('告警调度器', async () => {
      if (!ruleScheduler) ruleScheduler = await startScheduler(repo, 10_000);
    });
  } finally {
    reingestRunning = false;
  }

  const ok = steps.every((s) => s.ok);
  console.log(`[reingest] ${ok ? '全部完成' : '部分失败'}（${Date.now() - t0}ms）`);
  return { ok, steps, elapsedMs: Date.now() - t0 };
}

// 启动规则调度器（仅当存在启用规则时；不灌数据，与 bootstrap 解耦）
async function startRuleSchedulerIfNeeded() {
  try {
    const rules = await repo.listRules();
    const enabled = rules.filter((r) => r.enabled);
    if (!enabled.length) {
      console.log('[scheduler] 无启用规则，跳过启动');
      return;
    }
    if (ruleScheduler) return;
    ruleScheduler = await startScheduler(repo, 10_000);
    console.log(`[scheduler] 已启动定时规则巡检（${enabled.length} 条启用规则，10s tick）`);
  } catch (e: any) {
    console.error('[scheduler] 启动失败:', e.message);
  }
}

// 函数新增/修改/删除后重建调度器 sandbox，避免规则执行时"未注册的函数实现"
async function refreshRuleScheduler(reason: string): Promise<void> {
  if (!ruleScheduler) return;
  try {
    ruleScheduler.stop();
    ruleScheduler = await startScheduler(repo, 10_000);
    console.log(`[scheduler] 已刷新（${reason}）`);
  } catch (e: any) {
    console.error('[scheduler] 刷新失败:', e.message);
  }
}

// 启动时自动引导（当前已按需关闭，见文末 app.listen；需要恢复时取消注释即可）
async function bootstrapEnterpriseBiz() {
  try {
    await runReingest();
  } catch (e: any) {
    console.error('[bootstrap] enterprise-biz 引导失败:', e.message);
  }
}

const app = express();
app.use(express.json());

export function createApp() {
  return app;
}

// ---------- S1 数据源 ----------
app.get('/api/s1/connections', async (_req, res) => {
  try {
    const list = await store.listSourceConnections();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s1/connections', async (req, res) => {
  try {
    await mappingSvc.registerSourceConnection(req.body);
    res.status(201).json({ ok: true, id: req.body.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/s1/connections/:id', async (req, res) => {
  const c = await store.getSourceConnection(req.params.id);
  if (!c) return res.status(404).json({ error: 'not found' });
  res.json(c);
});

// 更新已存在的连接（编辑）
app.put('/api/s1/connections/:id', async (req, res) => {
  try {
    const body = { ...req.body, id: req.params.id };
    await mappingSvc.updateConnection(body);
    res.json({ ok: true, id: req.params.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 删除连接
app.delete('/api/s1/connections/:id', async (req, res) => {
  try {
    await mappingSvc.deleteConnection(req.params.id);
    res.json({ ok: true, id: req.params.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 探测只读源库的表与字段（映射内嵌在对象类型中，无需独立的映射管理层）
app.get('/api/s1/connections/:id/probe', async (req, res) => {
  try {
    const result = await mappingSvc.probeSourceTables(req.params.id, req.query.schema as string | undefined);
    res.json(result);
  } catch (e: any) {
    // 源端不可达（如源库未部署）或连接不存在，返回结构化结果而非裸 500。
    res.json({ reachable: false, error: e.message, tables: [] });
  }
});

// ---------- S1 数据源浏览（库 → schema → 表 → 真实数据） ----------
// 列出连接库内可见 schema
app.get('/api/s1/connections/:id/schemas', async (req, res) => {
  try {
    const schemas = await mappingSvc.listSourceSchemas(req.params.id);
    res.json({ schemas });
  } catch (e: any) {
    res.json({ schemas: [], error: e.message });
  }
});

// 列出指定 schema 下的表（含字段列；与 probe 同构，支持 schema 查询参数）
app.get('/api/s1/connections/:id/tables', async (req, res) => {
  try {
    const result = await mappingSvc.probeSourceTables(req.params.id, req.query.schema as string | undefined);
    res.json(result);
  } catch (e: any) {
    res.json({ reachable: false, error: e.message, tables: [] });
  }
});

// 打开表 → 查看真实数据（只读分页预览；limit 上限 500）
app.get('/api/s1/connections/:id/tables/:table/rows', async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const result = await mappingSvc.previewSourceTable(req.params.id, {
      schema: req.query.schema as string | undefined,
      table: req.params.table,
      limit,
      offset,
    });
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 仅测试连接连通性（建立连接 + SELECT 1），不列举表。
app.post('/api/s1/connections/:id/test', async (req, res) => {
  try {
    const result = await mappingSvc.testConnection(req.params.id);
    // 回写连接状态，让列表标签反映真实连通性（connected / error）
    await pool
      .query(`UPDATE source_connection SET status=$2, updated_at=now() WHERE id=$1`, [
        req.params.id,
        result.reachable ? 'connected' : 'error',
      ])
      .catch(() => { /* 状态回写失败不影响测试结果返回 */ });
    res.json(result);
  } catch (e: any) {
    res.json({ reachable: false, error: e.message, tables: [] });
  }
});

// 参数化测试连接（新建/编辑对话框内，用表单当前值，不依赖已保存连接）
app.post('/api/s1/connections/test', async (req, res) => {
  try {
    const result = await mappingSvc.testSourceConnection(req.body?.connectionMeta || req.body || {});
    res.json(result);
  } catch (e: any) {
    res.json({ reachable: false, error: e.message, tables: [] });
  }
});

// 列出源库（连接测试通过后调用，供选择库/schema）
app.post('/api/s1/connections/databases', async (req, res) => {
  try {
    const dbs = await mappingSvc.listSourceDatabases(req.body?.connectionMeta || req.body || {});
    res.json({ databases: dbs });
  } catch (e: any) {
    res.json({ databases: [], error: e.message });
  }
});

// ---------- S2 派生属性 + 函数触发 ----------
app.get('/api/s2/object-types/:apiName/derived/:propApiName', async (req, res) => {
  try {
    const { apiName, propApiName } = req.params;
    const rid = req.query.rid as string | undefined;
    if (!rid) return res.status(400).json({ error: '缺少 rid 查询参数（对象实例标识）' });
    const sandbox = await getSandbox();
    await registerDbFunctions(repo, sandbox);
    const result = await runWithReadOnly(() => repo.computeDerived(apiName, propApiName, rid, sandbox));
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- S2 函数管理（CRUD）----------
app.get('/api/s2/functions', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchFunctions({ keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const list = await repo.listFunctions();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s2/functions', async (req, res) => {
  try {
    const def = req.body;
    if (!def?.apiName || !def?.displayName || !def?.language || !def?.entry) {
      return res.status(400).json({ error: 'apiName/displayName/language/entry 必填' });
    }
    const kind: 'query' | 'edit' = def.kind === 'query' ? 'query' : 'edit';
    const outputSpec = Array.isArray(def.outputSpec) && def.outputSpec.length ? def.outputSpec : undefined;
    const fn: OntologyFunction = {
      apiName: def.apiName,
      displayName: def.displayName,
      language: def.language,
      entry: def.entry,
      inputs: def.inputs ?? [],
      outputs: def.outputs?.length ? def.outputs : (outputSpec?.map((o: any) => o.type) ?? []),
      outputSpec,
      kind,
      pure: def.pure ?? (kind === 'query'),
      description: def.description ?? null,
      body: def.body ?? null,
      version: def.version ?? 1,
    };
    await repo.createFunction(fn);
    // 立即注册到共享沙箱（若已预热）
    if (sharedSandbox && fn.body && fn.language === 'typescript') {
      await registerDbFunctions(repo, sharedSandbox);
    }
    await refreshRuleScheduler(`函数 ${fn.apiName} 创建/更新`);
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/s2/functions/:apiName', async (req, res) => {
  try {
    const patch = req.body ?? {};
    await repo.updateFunction(req.params.apiName, patch);
    if (sharedSandbox && (patch.body !== undefined || patch.language !== undefined)) {
      await registerDbFunctions(repo, sharedSandbox);
    }
    await refreshRuleScheduler(`函数 ${req.params.apiName} 更新`);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/functions/:apiName', async (req, res) => {
  try {
    await repo.deleteFunction(req.params.apiName);
    await refreshRuleScheduler(`函数 ${req.params.apiName} 删除`);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 动作管理（CRUD + 触发）----------
app.get('/api/s2/actions', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchActions({ keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const list = await repo.listActions();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s2/actions', async (req, res) => {
  try {
    const def = req.body;
    if (!def?.apiName || !def?.displayName || !def?.effect) {
      return res.status(400).json({ error: 'apiName/displayName/effect 必填' });
    }
    await repo.createAction(def as ActionType);
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/s2/actions/:apiName', async (req, res) => {
  try {
    await repo.updateAction(req.params.apiName, req.body ?? {});
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/actions/:apiName', async (req, res) => {
  try {
    await repo.deleteAction(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 触发动作：effect.kind='function' 时调用对应函数（轻量闭环，供前端手动执行）
app.post('/api/s2/actions/:apiName/trigger', async (req, res) => {
  try {
    const action = await repo.getAction(req.params.apiName);
    if (!action) return res.status(404).json({ error: '动作未注册' });
    if (action.effect?.kind !== 'function') {
      return res.status(400).json({ error: `仅支持 function 类型动作，当前为 ${action.effect?.kind}` });
    }
    const issues = await validateActionParams(action, req.body ?? {});
    if (issues.length) {
      await recordValidationIssues('action', issues.map((i) => ({ objectType: action.apiName, ...i })), 'reject');
      return res.status(400).json({ error: issues.map((i) => `${i.property}: ${i.message}`).join('; '), issues });
    }
    const sandbox = await getSandbox();
    await registerDbFunctions(repo, sandbox);
    const result = await sandbox.execute(action.effect.ref, req.body ?? {});
    res.json({ ok: true, action: action.apiName, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 触发一个 Ontology Function（如离职风险评估）。返回函数执行结果。
app.post('/api/s2/functions/:fnApiName/invoke', async (req, res) => {
  try {
    const { fn, result } = await executeRegisteredFunction(req.params.fnApiName, req.body ?? {});
    res.json({ ok: true, function: fn.apiName, result });
  } catch (e: any) {
    res.status(e?.status ?? 400).json({ error: e.message });
  }
});

// 自动化规则列表（通用「满足条件→执行动作」）
app.get('/api/s2/rules', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchRules({ keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const rules = await repo.listRules();
    res.json(rules);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 新建自动化规则（FDE 可自助配置，无需改码）
const CONDITION_OPERATORS = new Set(['gt', 'gte', 'lt', 'lte', 'eq', 'neq']);

async function validateCondition(cond: any): Promise<void> {
  if (!cond || typeof cond !== 'object') throw new Error('condition 必须是对象');
  switch (cond.kind) {
    case 'function': {
      const fn = await repo.getFunction(cond.function);
      if (!fn) throw new Error(`条件函数不存在: ${cond.function}`);
      if (fn.kind !== 'query') {
        throw new Error(`规则条件函数必须是 query（只读）函数；${fn.apiName} 是 ${fn.kind ?? 'edit'} 函数`);
      }
      return;
    }
    case 'property': {
      const ot = await repo.getObjectType(cond.objectType);
      if (!ot) throw new Error(`对象类型不存在: ${cond.objectType}`);
      if (!ot.properties.some((p) => p.apiName === cond.property)) {
        throw new Error(`属性不存在: ${cond.objectType}.${cond.property}`);
      }
      if (!CONDITION_OPERATORS.has(cond.operator)) throw new Error(`不支持的比较运算符: ${cond.operator}`);
      return;
    }
    case 'aggregate': {
      const ot = await repo.getObjectType(cond.objectType);
      if (!ot) throw new Error(`对象类型不存在: ${cond.objectType}`);
      if (!['count', 'sum', 'avg', 'min', 'max'].includes(cond.aggregation)) {
        throw new Error(`不支持的聚合: ${cond.aggregation}`);
      }
      if (cond.aggregation !== 'count') {
        if (!cond.property) throw new Error('聚合条件需要 property');
        if (!ot.properties.some((p) => p.apiName === cond.property)) {
          throw new Error(`属性不存在: ${cond.objectType}.${cond.property}`);
        }
      }
      if (!CONDITION_OPERATORS.has(cond.operator)) throw new Error(`不支持的比较运算符: ${cond.operator}`);
      return;
    }
    case 'all':
    case 'any': {
      if (!Array.isArray(cond.conditions) || cond.conditions.length === 0) {
        throw new Error(`${cond.kind} 条件至少需要一个子条件`);
      }
      for (const sub of cond.conditions) await validateCondition(sub);
      return;
    }
    default:
      throw new Error(`不支持的条件类型: ${cond.kind}`);
  }
}

// 规则定义校验：条件（声明式或函数）合法；动作必须存在；trigger 合法
async function validateRuleDefinition(def: any): Promise<void> {
  if (def.condition !== undefined) {
    if (def.condition !== null) await validateCondition(def.condition);
  } else if (def.conditionFunction !== undefined) {
    const fn = await repo.getFunction(def.conditionFunction);
    if (!fn) throw new Error(`条件函数不存在: ${def.conditionFunction}`);
    if (fn.kind !== 'query') {
      throw new Error(`规则条件函数必须是 query（只读）函数；${fn.apiName} 是 ${fn.kind ?? 'edit'} 函数`);
    }
  }
  if (def.actionApiName !== undefined && def.actionApiName && !(await repo.getAction(def.actionApiName))) {
    throw new Error(`动作不存在: ${def.actionApiName}`);
  }
  if (def.effects !== undefined) await validateEffects(def.effects);
  if (def.trigger !== undefined) {
    const t = def.trigger;
    if (!t || (t.kind !== 'schedule' && t.kind !== 'event')) throw new Error('trigger.kind 必须是 schedule 或 event');
    if (t.kind === 'schedule') {
      if (t.cron) {
        if (!isCronExpression(t.cron)) throw new Error(`非法 cron 表达式: ${t.cron}`);
      } else if (!(Number(t.intervalSeconds) >= 5)) {
        throw new Error('schedule 需要 cron 或 intervalSeconds（≥5）');
      }
    }
    if (t.kind === 'event' && (t.on !== 'object_write' || !t.objectType)) {
      throw new Error("event 规则需为 {kind:'event', on:'object_write', objectType:'<对象类型>'}");
    }
  }
}

async function validateEffects(effects: any): Promise<void> {
  if (!Array.isArray(effects)) throw new Error('effects 必须是数组');
  for (const e of effects) {
    if (!e || !e.kind) throw new Error('effect 缺少 kind');
    if (e.kind === 'action') {
      if (!e.actionApiName) throw new Error('action effect 需要 actionApiName');
      if (!(await repo.getAction(e.actionApiName))) throw new Error(`动作不存在: ${e.actionApiName}`);
    } else if (e.kind === 'function') {
      if (!e.function) throw new Error('function effect 需要 function');
      if (!(await repo.getFunction(e.function))) throw new Error(`函数不存在: ${e.function}`);
    } else if (e.kind === 'webhook') {
      if (!e.url || !/^https?:\/\//.test(e.url)) throw new Error('webhook effect 需要 http(s) url');
    } else if (e.kind === 'notify') {
      if (!['inapp', 'webhook'].includes(e.channel)) throw new Error('notify.channel 必须是 inapp 或 webhook');
      if (e.channel === 'webhook' && (!e.webhookUrl || !/^https?:\/\//.test(e.webhookUrl))) {
        throw new Error('notify(webhook) 需要 http(s) webhookUrl');
      }
    } else {
      throw new Error(`不支持的 effect 类型: ${e.kind}`);
    }
  }
}

app.post('/api/s2/rules', async (req, res) => {
  try {
    const def = req.body as AutomationRule;
    if (!def?.apiName) return res.status(400).json({ error: 'apiName 必填' });
    if (!def.condition && !def.conditionFunction) {
      return res.status(400).json({ error: '需要 condition（声明式条件）或 conditionFunction' });
    }
    if (!def.actionApiName && !(def.effects?.length)) {
      return res.status(400).json({ error: '需要 actionApiName 或 effects' });
    }
    await validateRuleDefinition(def);
    if (await repo.getRule(def.apiName)) {
      return res.status(409).json({ error: `规则已存在: ${def.apiName}` });
    }
    await repo.createRule(def);
    void startRuleSchedulerIfNeeded(); // 新增启用规则后自动拉起调度器
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 手动触发全部自动化规则（后台定时任务的手动入口）
// 规则条件预览（声明式条件求值，不执行动作）
app.post('/api/s2/rules/preview', async (req, res) => {
  try {
    const cond = req.body?.condition;
    if (!cond) return res.status(400).json({ error: '缺少 condition' });
    await validateCondition(cond);
    const sb = await getSandbox();
    await registerDbFunctions(repo, sb);
    const result = await evaluateRuleCondition(
      repo, cond,
      (name, args) => runWithReadOnly(() => sb.execute(name, args)) as Promise<unknown>,
      req.body?.params,
    );
    res.json({ matched: result.matched, count: result.items.length, items: result.items.slice(0, 20) });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- Automation 模块（对外主入口；/rules 保留兼容） ----------
app.get('/api/s2/automations', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    if (keyword || limit !== undefined || offset !== undefined) {
      const r = await repo.searchRules({ keyword, limit, offset });
      return res.json(r.items ?? r);
    }
    res.json(await repo.listRules());
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/s2/automations/:apiName', async (req, res) => {
  const rule = await repo.getRule(req.params.apiName);
  if (!rule) return res.status(404).json({ error: 'not found' });
  res.json(rule);
});

app.get('/api/s2/staged-effects', async (req, res) => {
  try {
    const status = (req.query.status as string) || 'pending';
    res.json(await repo.listStagedEffects(status));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s2/staged-effects/:id/approve', async (req, res) => {
  try {
    await startRuleSchedulerIfNeeded();
    if (!ruleScheduler) throw new Error('调度器未启动');
    const result = await ruleScheduler.approveStagedEffect(req.params.id);
    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/s2/staged-effects/:id/reject', async (req, res) => {
  try {
    await repo.finishStagedEffect(req.params.id, 'rejected');
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/s2/automations', async (req, res) => {
  try {
    const def = req.body as any;
    if (!def?.apiName) return res.status(400).json({ error: 'apiName 必填' });
    if (!def.condition && !def.conditionFunction) {
      return res.status(400).json({ error: '需要 condition 或 conditionFunction' });
    }
    if (!def.actionApiName && !(def.effects?.length)) {
      return res.status(400).json({ error: '需要 actionApiName 或 effects' });
    }
    await validateRuleDefinition(def);
    if (await repo.getRule(def.apiName)) return res.status(409).json({ error: `已存在: ${def.apiName}` });
    await repo.createRule(def);
    void startRuleSchedulerIfNeeded();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/s2/automations/:apiName', async (req, res) => {
  try {
    await validateRuleDefinition(req.body ?? {});
    await repo.updateRule(req.params.apiName, req.body ?? {});
    void startRuleSchedulerIfNeeded();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/automations/:apiName', async (req, res) => {
  try {
    await repo.deleteRule(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/s2/automations/:apiName/run', async (req, res) => {
  try {
    const rule = await repo.getRule(req.params.apiName);
    if (!rule) return res.status(404).json({ error: 'not found' });
    let scheduler = ruleScheduler;
    if (!scheduler) {
      const sb = await getSandbox();
      scheduler = new RuleScheduler(repo, sb, {
        tickMs: 999_999_999,
        executeCondition: (name, args) => runWithReadOnly(() => sb.execute(name, args)),
      });
    }
    const result = await scheduler.evaluateRule(rule, Date.now(), {}, { force: true });
    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/s2/automations/:apiName/runs', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    res.json(await repo.listAutomationRuns({
      automationApiName: req.params.apiName,
      status: (req.query.status as string) || undefined,
      triggerKind: (req.query.triggerKind as string) || undefined,
      limit, offset,
    }));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/s2/automation-runs/:id', async (req, res) => {
  const run = await repo.getAutomationRun(req.params.id);
  if (!run) return res.status(404).json({ error: 'not found' });
  res.json(run);
});

app.get('/api/s2/notifications', async (req, res) => {
  try {
    res.json(await repo.listNotifications(Number(req.query.limit) || 50));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/s2/rules/run', async (_req, res) => {
  try {
    // 优先复用后台调度器；若后台未启动（如仅测试/轻量部署），按需构建设置了函数的调度器。
    let scheduler = ruleScheduler;
    if (!scheduler) {
      const sb = await getSandbox();
      scheduler = new RuleScheduler(repo, sb, {
        tickMs: 999_999_999,
        executeCondition: (name, args) => runWithReadOnly(() => sb.execute(name, args)),
      });
    }
    const result = await scheduler.runAll();
    res.json({ ok: true, results: result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 单条自动化规则：详情 / 更新 / 删除（FDE 可自助配置，无需改码）
app.get('/api/s2/rules/:apiName', async (req, res) => {
  try {
    const rule = await repo.getRule(req.params.apiName);
    if (!rule) return res.status(404).json({ error: '规则不存在' });
    res.json(rule);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/s2/rules/:apiName', async (req, res) => {
  try {
    const patch = req.body as Partial<AutomationRule>;
    await validateRuleDefinition(patch);
    await repo.updateRule(req.params.apiName, patch);
    void startRuleSchedulerIfNeeded();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/rules/:apiName', async (req, res) => {
  try {
    await repo.deleteRule(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 告警对象列表（本体可写侧 Alert 实例）
app.get('/api/s2/alerts', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchObjectProperties('Alert', { keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const props = await repo.listObjectProperties('Alert');
    res.json(props);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- S2 对象类型 ----------
app.get('/api/s2/object-types', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchObjectTypes({ keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const list = await repo.listObjectTypes();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/s2/object-types/:apiName', async (req, res) => {
  const ot = await repo.getObjectType(req.params.apiName);
  if (!ot) return res.status(404).json({ error: 'not found' });
  res.json(ot);
});

// 探索页图表配置：每对象类型一套独立的图表（属性 apiName 有序列表）
app.get('/api/s2/object-types/:apiName/explore-config', async (req, res) => {
  try {
    const charts = await repo.getExploreConfig(req.params.apiName);
    res.json({ charts });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/s2/object-types/:apiName/explore-config', async (req, res) => {
  try {
    const charts = Array.isArray(req.body?.charts) ? req.body.charts : [];
    await repo.saveExploreConfig(req.params.apiName, charts);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 组合创建：对象类型 + 关联数据源表与字段映射（核心诉求）
app.post('/api/s2/object-types/with-mapping', async (req, res) => {
  try {
    const { qualityStatus } = await mappingSvc.createObjectTypeWithMapping(req.body);
    res.status(201).json({ ok: true, qualityStatus });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- S3 通用实例同步（源表 → 对象实例） ----------
// 按对象类型的 sourceConnectionId / sourceTable + 属性 sourceMapping，只读拉取源表并写入实例。
// 供 AIP 建模闭环（"引入表 → 建对象类型 → 同步实例"）与手工重建使用。

function coerceValue(v: unknown, type: string): unknown {
  if (v === null || v === undefined) return null;
  switch (type) {
    case 'integer':
      return Math.trunc(Number(v));
    case 'float':
      return Number(v);
    case 'boolean':
      return typeof v === 'boolean' ? v : v === 1 || v === '1' || v === 'true' || v === true;
    case 'date':
      return v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10);
    case 'timestamp':
      return v instanceof Date ? v.toISOString() : String(v);
    default:
      return typeof v === 'string' ? v : String(v);
  }
}

async function syncObjectInstances(
  apiName: string,
  schema = 'public',
): Promise<{ read: number; written: number; skipped: number; elapsedMs: number }> {
  const t0 = Date.now();
  const ot = await repo.getObjectType(apiName);
  if (!ot) throw new Error(`对象类型不存在: ${apiName}`);
  if (!ot.sourceConnectionId || !ot.sourceTable) {
    throw new Error(`对象类型 ${apiName} 未绑定数据源表，无法同步实例`);
  }
  const conn = await store.getSourceConnection(ot.sourceConnectionId);
  if (!conn) throw new Error(`数据源不存在: ${ot.sourceConnectionId}`);

  // 主键列：优先取源表真实主键，回退第一列映射名为 id 的属性
  const probe = await store.probeSourceTables(conn, schema);
  if (!probe.reachable) throw new Error(`数据源不可达: ${probe.error ?? '未知错误'}`);
  const tbl = probe.tables.find((t) => t.table === ot.sourceTable);
  const pkCol = tbl?.columns.find((c) => c.isPrimaryKey)?.name ?? 'id';
  const pkProp = ot.properties.find((p) => p.sourceMapping === pkCol);
  if (!pkProp) {
    throw new Error(`源表 ${ot.sourceTable} 的主键列 ${pkCol} 未映射到任何属性，无法确定实例 rid`);
  }

  const data = await store.readSourceTable(conn, { schema, table: ot.sourceTable, limit: 50000 });
  const mapped = ot.properties.filter((p) => p.sourceMapping);

  // 全量覆盖：先清旧实例再写（幂等）
  await repo.clearObjectWrites(apiName).catch(() => { /* 无旧实例时忽略 */ });

  let written = 0;
  let skipped = 0;
  for (const row of data.rows) {
    const ridVal = row[pkCol];
    if (ridVal === null || ridVal === undefined) {
      skipped++;
      continue;
    }
    const patch: Record<string, unknown> = {};
    for (const p of mapped) {
      patch[p.apiName] = coerceValue(row[p.sourceMapping as string], p.type);
    }
    // 默认值填充（仅当属性缺失/为空时）
    for (const p of ot.properties) {
      if (p.derived) continue;
      if (p.defaultValue !== undefined && (patch[p.apiName] === undefined || patch[p.apiName] === null)) {
        patch[p.apiName] = p.defaultValue;
      }
    }
    await repo.writeObjectPatch(apiName, `${apiName}:${String(ridVal)}`, patch, 'sync:source');
    written++;
  }
  return { read: data.rows.length, written, skipped, elapsedMs: Date.now() - t0 };
}

// 从 AIP 草案创建对象类型（可同时同步实例）
app.post('/api/s2/object-types/from-draft', async (req, res) => {
  try {
    const draft = req.body?.draft ?? req.body;
    if (!draft?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(draft.apiName)) {
      return res.status(400).json({ error: '草案缺少合法 apiName（字母开头，仅字母数字下划线）' });
    }
    if (!Array.isArray(draft.properties) || draft.properties.length === 0) {
      return res.status(400).json({ error: '草案缺少 properties' });
    }
    // 数据源为可选：两者都不给 = 平台生成型对象类型（如 Alert），不建映射、不同步
    if ((draft.sourceConnectionId && !draft.sourceTable) || (!draft.sourceConnectionId && draft.sourceTable)) {
      return res.status(400).json({ error: 'sourceConnectionId 与 sourceTable 需同时提供（或都省略）' });
    }
    const hasSource = !!(draft.sourceConnectionId && draft.sourceTable);
    const objectType = {
      apiName: draft.apiName,
      displayName: draft.displayName ?? draft.apiName,
      description: draft.description ?? '',
      properties: draft.properties.map((p: any) => ({
        apiName: p.apiName,
        displayName: p.displayName ?? p.apiName,
        type: p.type ?? 'string',
        required: !!p.required,
        sourceMapping: p.sourceMapping,
        description: p.description,
        allowedValues: Array.isArray(p.allowedValues) ? p.allowedValues : undefined,
        valueType: p.valueType,
        unit: p.unit,
        format: p.format,
        defaultValue: p.defaultValue,
      })),
      implementsInterfaces: [],
      sourceConnectionId: draft.sourceConnectionId,
      sourceTable: draft.sourceTable,
      titleProperty: draft.titleProperty,
      version: 1,
      createdAt: '',
      updatedAt: '',
    };
    const fieldMappings = objectType.properties
      .filter((p: any) => p.sourceMapping)
      .map((p: any) => ({ property: p.apiName, sourceColumn: p.sourceMapping }));
    await mappingSvc.createObjectTypeWithMapping({
      objectType: objectType as any,
      sourceConnectionId: draft.sourceConnectionId,
      sourceTable: draft.sourceTable,
      fieldMappings,
      mappingId: `map_${draft.apiName.toLowerCase()}_${draft.sourceTable}`,
    });

    let sync: unknown = null;
    if (hasSource && req.body?.sync !== false) {
      try {
        sync = await syncObjectInstances(draft.apiName, draft.schema || 'public');
      } catch (e: any) {
        sync = { error: e.message };
      }
    }
    res.status(201).json({ ok: true, apiName: draft.apiName, sync });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- 关系类型：从草案创建 + 从源表外键同步关系实例 ----------
// 约定：foreignKey = 源表中外键列名；primaryKey = 目标对象主键属性 apiName（用于算 target rid）。
// 仅支持"外键值 = 目标对象主键值"的关联（自关联/直接外键），需 join 的场景暂不自动处理。
async function syncLinkInstances(
  apiName: string,
  schema = 'public',
): Promise<{ read: number; written: number; skipped: number; elapsedMs: number }> {
  const t0 = Date.now();
  const lt = await repo.getLinkType(apiName);
  if (!lt) throw new Error(`关系类型不存在: ${apiName}`);
  const src = await repo.getObjectType(lt.sourceType);
  if (!src) throw new Error(`源对象类型不存在: ${lt.sourceType}`);
  if (!src.sourceConnectionId || !src.sourceTable) {
    throw new Error(`源对象类型 ${lt.sourceType} 未绑定数据源表，无法同步关系实例`);
  }
  const conn = await store.getSourceConnection(src.sourceConnectionId);
  if (!conn) throw new Error(`数据源不存在: ${src.sourceConnectionId}`);

  // 多对多 join 表模式：关系实例直接来自关联表（对齐 Palantir join table dataset）
  if (lt.junctionTable) {
    if (!lt.sourceColumn || !lt.targetColumn) {
      throw new Error(`关系类型 ${apiName} 使用关联表模式，必须配置 sourceColumn / targetColumn`);
    }
    const data = await store.readSourceTable(conn, { schema, table: lt.junctionTable, limit: 50000 });
    const colSet = new Set(data.columns.map((c) => c.name));
    if (!colSet.has(lt.sourceColumn) || !colSet.has(lt.targetColumn)) {
      throw new Error(
        `关联表 ${lt.junctionTable} 缺少列 ${[lt.sourceColumn, lt.targetColumn].filter((c) => !colSet.has(c!)).join(', ')}（可用列：${[...colSet].join(', ')}）`,
      );
    }
    await repo.clearLinkInstances(apiName).catch(() => {});
    let written = 0;
    let skipped = 0;
    for (const row of data.rows) {
      const sVal = row[lt.sourceColumn];
      const tVal = row[lt.targetColumn];
      if (sVal === null || sVal === undefined || tVal === null || tVal === undefined) {
        skipped++;
        continue;
      }
      await repo.createLinkInstance(apiName, `${lt.sourceType}:${String(sVal)}`, `${lt.targetType}:${String(tVal)}`);
      written++;
    }
    return { read: data.rows.length, written, skipped, elapsedMs: Date.now() - t0 };
  }

  const probe = await store.probeSourceTables(conn, schema);
  if (!probe.reachable) throw new Error(`数据源不可达: ${probe.error ?? '未知错误'}`);
  const tbl = probe.tables.find((t) => t.table === src.sourceTable);
  if (!tbl) throw new Error(`源表不存在: ${schema}.${src.sourceTable}`);
  const srcPkCol = tbl.columns.find((c) => c.isPrimaryKey)?.name ?? 'id';
  const fkCol = lt.foreignKey || lt.primaryKey;
  if (!fkCol) throw new Error(`关系类型 ${apiName} 未配置外键列（foreignKey），无法同步关系实例`);
  // 外键列必须存在于"源对象类型"的源表中；否则说明关系方向反了（外键在目标表上）
  if (!tbl.columns.some((c) => c.name === fkCol)) {
    throw new Error(
      `外键列 ${fkCol} 不在源表 ${schema}.${src.sourceTable} 中（当前方向 ${lt.sourceType} → ${lt.targetType}）。` +
      `关系方向应设为"持有外键的一方 → 被引用的一方"，例如 LeaveRecord → Employee（foreignKey=employee_id）。`,
    );
  }

  const data = await store.readSourceTable(conn, { schema, table: src.sourceTable, limit: 50000 });
  await repo.clearLinkInstances(apiName).catch(() => {});
  let written = 0;
  let skipped = 0;
  for (const row of data.rows) {
    const fkVal = row[fkCol];
    const srcVal = row[srcPkCol];
    if (fkVal === null || fkVal === undefined || srcVal === null || srcVal === undefined) {
      skipped++;
      continue;
    }
    await repo.createLinkInstance(apiName, `${lt.sourceType}:${String(srcVal)}`, `${lt.targetType}:${String(fkVal)}`);
    written++;
  }
  return { read: data.rows.length, written, skipped, elapsedMs: Date.now() - t0 };
}

// 从 AIP 草案创建关系类型（可同时同步关系实例）
app.post('/api/s2/link-types/from-draft', async (req, res) => {
  try {
    const draft = req.body?.draft ?? req.body;
    if (!draft?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(draft.apiName)) {
      return res.status(400).json({ error: '草案缺少合法 apiName（字母开头，仅字母数字下划线）' });
    }
    if (!draft.sourceType || !draft.targetType) {
      return res.status(400).json({ error: '草案缺少 sourceType / targetType' });
    }
    const src = await repo.getObjectType(draft.sourceType);
    const tgt = await repo.getObjectType(draft.targetType);
    if (!src) return res.status(400).json({ error: `源对象类型不存在: ${draft.sourceType}` });
    if (!tgt) return res.status(400).json({ error: `目标对象类型不存在: ${draft.targetType}` });

    const isJunction = !!draft.junctionTable;
    if (isJunction && (!draft.sourceColumn || !draft.targetColumn)) {
      return res.status(400).json({ error: '关联表模式需要 sourceColumn / targetColumn' });
    }
    const cardinality = draft.cardinality ?? (isJunction ? 'many-to-many' : 'one-to-many');
    const targetKeyProp = draft.targetKeyProperty ?? draft.primaryKey;
    await repo.createLinkType({
      apiName: draft.apiName,
      displayName: draft.displayName ?? draft.apiName,
      sourceType: draft.sourceType,
      targetType: draft.targetType,
      sourceCardinality: draft.sourceCardinality ?? (cardinality.startsWith('many') ? 'many' : 'one'),
      targetCardinality: draft.targetCardinality ?? (cardinality.endsWith('many') ? 'many' : 'one'),
      primaryKey: targetKeyProp,
      foreignKey: draft.foreignKey,
      pluralName: draft.pluralName,
      junctionTable: draft.junctionTable,
      sourceColumn: draft.sourceColumn,
      targetColumn: draft.targetColumn,
      visibility: 'Normal',
      instanceSource: 'source',
      version: 1,
    } as any);
    // createLinkType 只写基础列，主键/外键/schema 元数据用 update 补齐
    await repo.updateLinkType(draft.apiName, {
      primaryKey: targetKeyProp,
      foreignKey: draft.foreignKey,
      pluralName: draft.pluralName,
      junctionTable: draft.junctionTable,
      sourceColumn: draft.sourceColumn,
      targetColumn: draft.targetColumn,
    });

    let sync: unknown = null;
    if (req.body?.sync !== false && (draft.foreignKey || draft.primaryKey || draft.junctionTable)) {
      try {
        sync = await syncLinkInstances(draft.apiName, draft.schema || 'public');
      } catch (e: any) {
        sync = { error: e.message };
      }
    }
    res.status(201).json({ ok: true, apiName: draft.apiName, sync });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 手动重新同步某关系类型的关系实例（全量覆盖）
app.post('/api/s2/link-types/:apiName/sync', async (req, res) => {
  try {
    const result = await syncLinkInstances(req.params.apiName, (req.body?.schema as string) || 'public');
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 手动重新同步某对象类型的实例（全量覆盖）
app.post('/api/s2/object-types/:apiName/sync', async (req, res) => {
  try {
    const result = await syncObjectInstances(req.params.apiName, (req.body?.schema as string) || 'public');
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- 值类型（Value Types） ----------
app.get('/api/s2/value-types', async (_req, res) => {
  try { res.json(await repo.listValueTypes()); } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get('/api/s2/value-types/:apiName', async (req, res) => {
  const vt = await repo.getValueType(req.params.apiName);
  if (!vt) return res.status(404).json({ error: 'not found' });
  res.json(vt);
});

app.post('/api/s2/value-types', async (req, res) => {
  try {
    const body = req.body;
    if (!body?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(body.apiName)) {
      return res.status(400).json({ error: 'apiName 必填（字母开头，仅字母数字下划线）' });
    }
    if (!body.displayName || !body.baseType) {
      return res.status(400).json({ error: 'displayName / baseType 必填' });
    }
    if (await repo.getValueType(body.apiName)) return res.status(409).json({ error: '值类型已存在' });
    await repo.createValueType({
      apiName: body.apiName, displayName: body.displayName, baseType: body.baseType,
      description: body.description, allowedValues: body.allowedValues,
      constraint: body.constraint, failureMessage: body.failureMessage, example: body.example,
      version: body.version ?? 1,
    });
    res.status(201).json({ ok: true });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

app.put('/api/s2/value-types/:apiName', async (req, res) => {
  try {
    await repo.updateValueType(req.params.apiName, req.body);
    res.json({ ok: true });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/s2/value-types/:apiName', async (req, res) => {
  try {
    await repo.deleteValueType(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// ---------- 写入校验（值类型/枚举约束） ----------
// 模式：off / warn（默认，仅告警）/ reject（拒绝写入）
const WRITE_VALIDATION = (process.env.WRITE_VALIDATION || 'warn').toLowerCase();
const otValidCache = new Map<string, { at: number; ot: any }>();
const vtValidCache = new Map<string, { at: number; vt: any }>();
const VALID_CACHE_TTL = 15_000;

async function getOtForValidation(apiName: string) {
  const hit = otValidCache.get(apiName);
  if (hit && Date.now() - hit.at < VALID_CACHE_TTL) return hit.ot;
  const ot = await repo.getObjectType(apiName);
  otValidCache.set(apiName, { at: Date.now(), ot });
  return ot;
}
async function getVtForValidation(apiName: string) {
  const hit = vtValidCache.get(apiName);
  if (hit && Date.now() - hit.at < VALID_CACHE_TTL) return hit.vt;
  const vt = await repo.getValueType(apiName);
  if (vt) vtValidCache.set(apiName, { at: Date.now(), vt });
  return vt;
}

async function recordValidationIssues(
  source: 'write' | 'action' | 'function',
  issues: Array<{ objectType?: string; property?: string; value?: string; message: string }>,
  mode: 'warn' | 'reject',
): Promise<void> {
  if (!issues.length) return;
  try {
    for (const it of issues) {
      await pool.query(
        `INSERT INTO validation_issue (source, object_type, property, value, message, mode)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [source, it.objectType ?? null, it.property ?? null, it.value ?? null, it.message, mode],
      );
    }
  } catch (e: any) {
    console.error('[validate] 记录校验问题失败', e.message);
  }
}

async function validateActionParams(action: any, args: Record<string, unknown>) {
  const issues: Array<{ property: string; value: string; message: string }> = [];
  for (const p of action.parameters ?? []) {
    const v = (args ?? {})[p.name];
    if (p.required && (v === undefined || v === null || v === '')) {
      issues.push({ property: p.name, value: '', message: '缺少必填参数' });
      continue;
    }
    if (v === undefined || v === null) continue;
    const allowed = p.allowedValues?.length ? p.allowedValues : (p.valueType ? (await getVtForValidation(p.valueType))?.allowedValues : null);
    if (Array.isArray(allowed) && allowed.length && !allowed.some((a: any) => String(a.value) === String(v))) {
      issues.push({ property: p.name, value: String(v), message: `不在允许值 [${allowed.map((a: any) => a.value).join(', ')}]` });
    }
    const vt = p.valueType ? await getVtForValidation(p.valueType) : null;
    if (vt?.constraint?.kind === 'range') {
      const n = Number(v);
      if (Number.isFinite(n)) {
        if (vt.constraint.min !== undefined && n < vt.constraint.min) issues.push({ property: p.name, value: String(v), message: `小于最小值 ${vt.constraint.min}` });
        if (vt.constraint.max !== undefined && n > vt.constraint.max) issues.push({ property: p.name, value: String(v), message: `大于最大值 ${vt.constraint.max}` });
      }
    } else if (vt?.constraint?.kind === 'regex' && vt.constraint.pattern) {
      try { if (!new RegExp(vt.constraint.pattern).test(String(v))) issues.push({ property: p.name, value: String(v), message: `不匹配 /${vt.constraint.pattern}/` }); } catch { /* ignore */ }
    }
    if (p.type === 'integer' && !Number.isInteger(Number(v))) issues.push({ property: p.name, value: String(v), message: '应为整数' });
    if (p.type === 'float' && !Number.isFinite(Number(v))) issues.push({ property: p.name, value: String(v), message: '应为数字' });
    if (p.type === 'boolean' && typeof v !== 'boolean' && !['true', 'false'].includes(String(v))) {
      issues.push({ property: p.name, value: String(v), message: '应为布尔值' });
    }
  }
  return issues;
}

// 函数输出类型检查
function checkOutputType(type: string, v: unknown): string | null {
  if (v === null || v === undefined) return null;
  switch (type) {
    case 'string': return typeof v === 'string' ? null : '应为字符串';
    case 'integer': return Number.isInteger(Number(v)) ? null : '应为整数';
    case 'float': return Number.isFinite(Number(v)) ? null : '应为数字';
    case 'boolean': return typeof v === 'boolean' ? null : '应为布尔值';
    case 'array': return Array.isArray(v) ? null : '应为数组';
    case 'object': return typeof v === 'object' ? null : '应为对象';
    default: return null;
  }
}

// 函数输出校验（outputSpec[0]：type + valueType）
async function validateFunctionResult(fn: any, result: unknown) {
  const issues: Array<{ property: string; value: string; message: string }> = [];
  const spec = fn.outputSpec?.[0];
  const type = spec?.type ?? (fn.outputs?.[0] as string | undefined);
  if (type) {
    const msg = checkOutputType(type, result);
    if (msg) issues.push({ property: 'result', value: String(JSON.stringify(result) ?? ''), message: msg });
  }
  if (spec?.valueType && result !== null && result !== undefined && typeof result !== 'object') {
    const vt = await getVtForValidation(String(spec.valueType));
    const allowed = vt?.allowedValues;
    if (Array.isArray(allowed) && allowed.length && !allowed.some((a: any) => String(a.value) === String(result))) {
      issues.push({ property: 'result', value: String(result), message: `不在允许值 [${allowed.map((a: any) => a.value).join(', ')}]` });
    }
  }
  return issues;
}

// 统一执行已注册函数：输入校验 → 只读隔离（query）→ 输出校验
async function executeRegisteredFunction(name: string, args: Record<string, unknown>) {
  const fn = await repo.getFunction(name);
  if (!fn) throw new Error(`函数未注册: ${name}`);
  const inputIssues = await validateActionParams({ parameters: fn.inputs ?? [] }, args);
  if (inputIssues.length) {
    await recordValidationIssues('function', inputIssues.map((i) => ({ objectType: name, ...i })), 'reject');
    const err: any = new Error(`参数校验失败: ${inputIssues.map((i) => `${i.property}: ${i.message}`).join('; ')}`);
    err.status = 400;
    throw err;
  }
  const sb = await getSandbox();
  await registerDbFunctions(repo, sb);
  const run = () => sb.execute(name, args);
  const result = fn.kind === 'query' ? await runWithReadOnly(run) : await run();
  const outputIssues = await validateFunctionResult(fn, result);
  if (outputIssues.length) {
    const mode = WRITE_VALIDATION === 'reject' ? 'reject' : 'warn';
    await recordValidationIssues('function', outputIssues.map((i) => ({ objectType: name, ...i })), mode);
    if (mode === 'reject') {
      const err: any = new Error(`输出校验失败: ${outputIssues.map((i) => `${i.property}: ${i.message}`).join('; ')}`);
      err.status = 400;
      throw err;
    }
    console.warn('[validate] 函数输出校验失败', name, outputIssues.map((i) => i.message).join('; '));
  }
  return { fn, result };
}

repo.setPatchValidator(async (objectType, patch, _actor, delta) => {
  if (WRITE_VALIDATION === 'off') return;
  const ot = await getOtForValidation(objectType);
  if (!ot) return;
  const issues: Array<{ property: string; value: string; message: string }> = [];
  for (const p of ot.properties ?? []) {
    // 派生属性只读：由计算产生，不允许通过写入覆盖（先于派生跳过判断）
    if (p.derived) {
      if (delta && (p.apiName in delta)) {
        issues.push({ property: p.apiName, value: JSON.stringify((delta as any)[p.apiName]), message: '派生属性不可写（由计算产生）' });
      }
      continue;
    }
    const v = (patch as any)[p.apiName];
    // 必填校验：针对合并后的完整实例（patch 已包含历史值）
    if (p.required && (v === undefined || v === null || v === '')) {
      issues.push({ property: p.apiName, value: '', message: '缺少必填属性' });
      continue;
    }
    if (!(p.apiName in patch)) continue;
    if (v === null || v === undefined) continue;
    const vt = p.valueType ? await getVtForValidation(p.valueType) : null;
    const allowed = p.allowedValues ?? vt?.allowedValues;
    if (Array.isArray(allowed) && allowed.length) {
      const ok = allowed.some((a: any) => String(a.value) === String(v));
      if (!ok) issues.push({ property: p.apiName, value: String(v), message: `不在允许值 [${allowed.map((a: any) => a.value).join(', ')}]` });
    }
    const c = vt?.constraint;
    if (c?.kind === 'range') {
      const n = Number(v);
      if (Number.isFinite(n)) {
        if (c.min !== undefined && n < c.min) issues.push({ property: p.apiName, value: String(v), message: `小于最小值 ${c.min}` });
        if (c.max !== undefined && n > c.max) issues.push({ property: p.apiName, value: String(v), message: `大于最大值 ${c.max}` });
      }
    } else if (c?.kind === 'regex' && c.pattern) {
      try {
        if (!new RegExp(c.pattern).test(String(v))) issues.push({ property: p.apiName, value: String(v), message: `不匹配 /${c.pattern}/` });
      } catch { /* 忽略非法正则 */ }
    }
  }
  if (!issues.length) return;
  const mode = WRITE_VALIDATION === 'reject' ? 'reject' : 'warn';
  await recordValidationIssues('write', issues.map((i) => ({ objectType, ...i })), mode);
  const msg = `写入校验失败 ${objectType}: ${issues.map((i) => `${i.property}=${JSON.stringify(i.value)} ${i.message}`).join('; ')}`;
  if (mode === 'reject') throw new Error(msg);
  console.warn('[validate]', msg);
});
console.log(`[validate] 写入校验模式: ${WRITE_VALIDATION}`);

app.post('/api/s2/object-types', async (req, res) => {
  try {
    await repo.createObjectType(req.body);
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/s2/object-types/:apiName', async (req, res) => {
  try {
    await repo.updateObjectType(req.params.apiName, req.body);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/object-types/:apiName', async (req, res) => {
  try {
    // 映射已内嵌到对象类型；仅清理底层 object_mapping 记录，再删对象类型
    await store.deleteObjectMappingsByType(req.params.apiName);
    await repo.deleteObjectType(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 共享属性（Shared properties）----------
app.get('/api/s2/shared-properties', async (_req, res) => {
  try {
    const list = await repo.listSharedProperties();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/s2/shared-properties/:apiName', async (req, res) => {
  try {
    const sp = await repo.getSharedProperty(req.params.apiName);
    if (!sp) return res.status(404).json({ error: 'not found' });
    res.json(sp);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s2/shared-properties', async (req, res) => {
  try {
    const def = req.body;
    if (!def?.apiName || !def?.displayName || !def?.type) {
      return res.status(400).json({ error: 'apiName/displayName/type 必填' });
    }
    await repo.createSharedProperty({
      apiName: def.apiName,
      displayName: def.displayName,
      type: def.type,
      description: def.description,
      valueType: def.valueType,
      allowedValues: def.allowedValues,
      unit: def.unit,
      format: def.format,
      defaultValue: def.defaultValue,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/s2/shared-properties/:apiName', async (req, res) => {
  try {
    await repo.updateSharedProperty(req.params.apiName, req.body ?? {});
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/s2/shared-properties/:apiName', async (req, res) => {
  try {
    await repo.deleteSharedProperty(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 把对象类型内嵌属性提升为共享属性
app.post('/api/s2/shared-properties/convert', async (req, res) => {
  try {
    const { objectType, propApiName } = req.body ?? {};
    if (!objectType || !propApiName) {
      return res.status(400).json({ error: 'objectType/propApiName 必填' });
    }
    await repo.convertPropertyToShared(objectType, propApiName);
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 在某对象类型上应用共享属性（引用，可选覆盖）
app.post('/api/s2/shared-properties/:apiName/apply', async (req, res) => {
  try {
    const { objectType, displayName, required } = req.body ?? {};
    if (!objectType) return res.status(400).json({ error: 'objectType 必填' });
    await repo.applySharedToObjectType(req.params.apiName, objectType, {
      ...(displayName !== undefined ? { displayName } : {}),
      ...(required !== undefined ? { required } : {}),
    });
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 关系类型 ----------
app.get('/api/s2/link-types', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const withTotal = req.query.withTotal === '1' || req.query.withTotal === 'true';
    if (keyword || limit !== undefined || offset !== undefined || withTotal) {
      const r = await repo.searchLinkTypes({ keyword, limit, offset });
      return res.json(withTotal ? r : r.items);
    }
    const list = await repo.listLinkTypes();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/s2/link-types', async (req, res) => {
  try {
    await repo.createLinkType(req.body);
    res.status(201).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/s2/link-types/:apiName', async (req, res) => {
  try {
    const lt = await repo.getLinkType(req.params.apiName);
    if (!lt) return res.status(404).json({ error: 'not found' });
    res.json(lt);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/s2/link-types/:apiName', async (req, res) => {
  try {
    await repo.updateLinkType(req.params.apiName, req.body);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/link-types/:apiName', async (req, res) => {
  try {
    await repo.deleteLinkType(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 Explore（探索：实例列表 + 对象关联关系） ----------
// 获取某对象类型的所有实例（含属性）
app.get('/api/s2/explore/instances/:objectType', async (req, res) => {
  try {
    const instances = await repo.listObjectProperties(req.params.objectType);
    res.json(instances);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 实例查询（对齐 Palantir List Objects）：条件过滤 + 游标分页
// query: filter=JSON数组(pageSize,pageToken 可选)。filter 项 {property,operator,value}
app.get('/api/s2/explore/instances/:objectType/query', async (req, res) => {
  try {
    const { objectType } = req.params;
    const filter = req.query.filter ? JSON.parse(String(req.query.filter)) : undefined;
    const orderBy = req.query.orderBy ? String(req.query.orderBy) : undefined;
    const order = req.query.order === 'desc' ? 'desc' : req.query.order === 'asc' ? 'asc' : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    const pageToken = req.query.pageToken ? String(req.query.pageToken) : undefined;
    const result = await repo.listInstances(objectType, { filter, orderBy, order, pageSize, pageToken });
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 获取某个具体对象的所有关联关系（按 link_type 分组，含对端对象属性）
app.get('/api/s2/explore/object/:objectType/:objectRid/links', async (req, res) => {
  try {
    const { objectType } = req.params;
    // RID 规范化：兼容裸 rid（如 "2"）与带类型前缀（如 "Department:2"）
    const objectRid = req.params.objectRid.includes(':')
      ? req.params.objectRid
      : `${objectType}:${req.params.objectRid}`;
    // 查询所有以该对象为 source 或 target 的 link_instance，JOIN link_type 获取元信息
    const { rows } = await pool.query(
      `SELECT li.link_type, lt.display_name AS link_display_name,
              lt.source_type, lt.target_type,
              CASE WHEN lt.source_type = $1 AND li.source_rid = $2 THEN 'target' ELSE 'source' END AS direction,
              CASE WHEN lt.source_type = $1 AND li.source_rid = $2 THEN li.target_rid ELSE li.source_rid END AS other_rid
         FROM link_instance li
         JOIN link_type lt ON lt.api_name = li.link_type
        WHERE ((lt.source_type = $1 AND li.source_rid = $2)
            OR (lt.target_type = $1 AND li.target_rid = $2))
        ORDER BY li.link_type, li.created_at DESC`,
      [objectType, objectRid],
    );
    // 按 link_type 分组
    const groups: Record<string, { linkType: string; linkDisplayName: string; direction: string; otherRid: string }[]> = {};
    for (const r of rows) {
      if (!groups[r.link_type]) groups[r.link_type] = [];
      groups[r.link_type].push({
        linkType: r.link_type,
        linkDisplayName: r.link_display_name,
        direction: r.direction,
        otherRid: r.other_rid,
      });
    }
    // 批量获取对端对象的显示名
    const result = await Promise.all(Object.entries(groups).map(async ([lt, items]) => {
      // 取第一个 item 判断对端类型
      const firstItem = items[0];
      const otherType = firstItem.direction === 'target'
        ? rows.find((r: any) => r.link_type === lt)?.target_type
        : rows.find((r: any) => r.link_type === lt)?.source_type;
      return {
        linkType: lt,
        linkDisplayName: items[0].linkDisplayName,
        otherObjectType: otherType || '',
        links: items.map((item) => ({ direction: item.direction, otherRid: item.otherRid })),
      };
    }));
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 属性聚合：分类属性分组计数（用于条形图）
app.get('/api/s2/explore/:objectType/aggregate', async (req, res) => {
  try {
    const topN = req.query.topN ? parseInt(req.query.topN as string, 10) : 20;
    const data = await repo.aggregateByProperty(
      req.params.objectType,
      req.query.property as string,
      topN,
    );
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 数值直方图：数值属性分桶分布（用于直方图）
app.get('/api/s2/explore/:objectType/histogram', async (req, res) => {
  try {
    const buckets = req.query.buckets ? parseInt(req.query.buckets as string, 10) : 20;
    const data = await repo.histogramByProperty(
      req.params.objectType,
      req.query.property as string,
      buckets,
    );
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- AIP 配置平台：Provider / Model / Agent 三层体系 ----------
// 进程内运行时：把本体能力（函数/动作/规则/探索/告警）桥接给 Agent 工具调用。
// 派生属性口径摘要（优先 derivation，其次兼容旧 reducer/reducerFn）
function summarizePropertyDerivation(p: any): string | undefined {
  if (p.derivation) {
    const d = p.derivation;
    if (d.kind === 'function') {
      const args = d.args && Object.keys(d.args).length ? ` args=${JSON.stringify(d.args)}` : '';
      return `函数 ${d.function}${args}${d.resultNote ? `（${d.resultNote}）` : ''}`;
    }
    if (d.kind === 'linkAggregation') {
      return `${d.aggregation ?? 'count'}(${d.linkType ?? '?'} ${d.direction ?? '?'} → ${d.targetProperty ?? '?'})${d.resultNote ? `（${d.resultNote}）` : ''}`;
    }
    return `表达式 ${d.expression ?? '?'}${d.resultNote ? `（${d.resultNote}）` : ''}`;
  }
  if (p.reducerFn) return `函数 ${p.reducerFn}（未配置口径说明）`;
  if (p.reducer) return `结构化算子 ${String(p.reducer).slice(0, 80)}`;
  return undefined;
}

const agentRuntime: AgentRuntime = {
  listFunctions: (opts) => repo.searchFunctions(opts ?? {}),
  listActions: (opts) => repo.searchActions(opts ?? {}),
  listRules: (opts) => repo.searchRules(opts ?? {}),
  listObjectTypes: (opts) => repo.searchObjectTypes(opts ?? {}),
  invokeFunction: async (name, args) => {
    const { result } = await executeRegisteredFunction(name, (args ?? {}) as Record<string, unknown>);
    return result;
  },
  triggerAction: async (name, args) => {
    const action = await repo.getAction(name);
    if (!action) throw new Error(`动作未注册: ${name}`);
    if (action.effect?.kind !== 'function') throw new Error(`仅支持 function 类型动作，当前为 ${action.effect?.kind}`);
    const sb = await getSandbox();
    await registerDbFunctions(repo, sb);
    return sb.execute(action.effect.ref, args);
  },
  runRules: async () => {
    let scheduler = ruleScheduler;
    if (!scheduler) {
      const sb = await getSandbox();
      scheduler = new RuleScheduler(repo, sb, {
        tickMs: 999_999_999,
        executeCondition: (name, args) => runWithReadOnly(() => sb.execute(name, args)),
      });
    }
    return scheduler.runAll();
  },
  listAlerts: (opts) => repo.searchObjectProperties('Alert', opts ?? {}),
  getInstances: (objectType, opts) => repo.listInstances(objectType, opts),
  getObjectLinks: async (objectType, objectRid) => {
    const normRid = objectRid.includes(':') ? objectRid : `${objectType}:${objectRid}`;
    const { rows } = await pool.query(
      `SELECT li.link_type, lt.display_name AS link_display_name,
              lt.source_type, lt.target_type,
              CASE WHEN lt.source_type = $1 AND li.source_rid = $2 THEN 'target' ELSE 'source' END AS direction,
              CASE WHEN lt.source_type = $1 AND li.source_rid = $2 THEN li.target_rid ELSE li.source_rid END AS other_rid
         FROM link_instance li
         JOIN link_type lt ON lt.api_name = li.link_type
        WHERE ((lt.source_type = $1 AND li.source_rid = $2)
            OR (lt.target_type = $1 AND li.target_rid = $2))
        ORDER BY li.link_type, li.created_at DESC`,
      [objectType, normRid],
    );
    return rows;
  },
  aggregate: (objectType, property, topN) => repo.aggregateByProperty(objectType, property, topN ?? 20),
  aggregateQuery: async (objectType, opts) => {
    const sb = await getSandbox();
    return repo.aggregateQuery(objectType, opts as any, sb);
  },
  searchAround: (objectType, opts) => repo.searchAround(objectType, opts as any),
  histogram: (objectType, property, buckets) => repo.histogramByProperty(objectType, property, buckets ?? 20),
  // 受限 NL2SQL：在 S1 只读源库执行，仅允许 SELECT，且表必须在白名单内
  runSql: async (sql, allowTables, limit) => runReadOnlySql(sql, allowTables, limit ?? 200),
  // 数据源建模：列出已接入数据源（不暴露口令）
  listSourceConnections: async () => {
    const list = await store.listSourceConnections();
    return list.map((c) => {
      const meta = (c.connectionMeta ?? {}) as Record<string, unknown>;
      return {
        id: c.id,
        displayName: c.displayName,
        kind: c.kind,
        dbType: (meta.dbType as string) ?? 'postgres',
        database: (meta.database as string) ?? undefined,
      };
    });
  },
  // 关系建模：读取关系类型列表 / 单个对象类型完整定义
  listLinkTypes: (opts) => repo.searchLinkTypes(opts ?? {}),
  getObjectType: async (apiName: string) => {
    const ot = await repo.getObjectType(apiName);
    if (!ot) return ot;
    // 给智能体返回可读口径（不落库，仅展示）
    return {
      ...ot,
      properties: ot.properties.map((p: any) => ({ ...p, derivationSummary: summarizePropertyDerivation(p) })),
    };
  },
  // 派生/函数建模：注册函数（存在则更新 body）
  createFunction: async (def: {
    apiName: string; displayName: string; description?: string; body: string;
    kind?: 'query' | 'edit'; pure?: boolean;
    inputs?: Array<Record<string, unknown>>; outputSpec?: Array<Record<string, unknown>>;
  }) => {
    if (!def?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(def.apiName)) {
      throw new Error('apiName 必填，且只能以字母开头、仅含字母数字下划线');
    }
    if (!def.body || !/return\s+(async\s*)?\(args,\s*ctx\)\s*=>/.test(def.body)) {
      throw new Error('函数体必须是 TS 源码，形如 "return async (args, ctx) => { ... }"');
    }
    const kind: 'query' | 'edit' = def.kind === 'query' ? 'query' : 'edit';
    const pure = def.pure ?? (kind === 'query');
    const existing = await repo.getFunction(def.apiName);
    const outputSpec = def.outputSpec as any[] | undefined;
    const outputs = outputSpec?.length ? outputSpec.map((o) => String(o.type)) : (existing?.outputs ?? []);
    const inputs = def.inputs ?? existing?.inputs ?? [];
    if (existing) {
      await repo.updateFunction(def.apiName, {
        displayName: def.displayName, description: def.description ?? '', body: def.body,
        language: 'typescript', entry: 'main', kind, pure, inputs: inputs as any, outputs, outputSpec,
      } as any);
      await refreshRuleScheduler(`函数 ${def.apiName} 更新（agent）`);
      return { ok: true, updated: true, apiName: def.apiName, kind, pure };
    }
    await repo.createFunction({
      apiName: def.apiName, displayName: def.displayName, language: 'typescript', entry: 'main',
      inputs: inputs as any, outputs, outputSpec, kind, pure,
      description: def.description ?? '', body: def.body, version: 1,
      createdAt: '', updatedAt: '',
    } as any);
    await refreshRuleScheduler(`函数 ${def.apiName} 创建（agent）`);
    return { ok: true, created: true, apiName: def.apiName, kind, pure };
  },
  // 派生/函数建模：删除函数（被派生属性引用时拒绝）
  deleteFunction: async (apiName: string) => {
    const fn = await repo.getFunction(apiName);
    if (!fn) throw new Error(`函数不存在: ${apiName}`);
    const types = await repo.listObjectTypes();
    const refs: string[] = [];
    for (const ot of types) {
      for (const p of ot.properties) {
        if ((p as any).reducerFn === apiName || (p as any).derivation?.function === apiName) {
          refs.push(`${ot.apiName}.${p.apiName}`);
        }
      }
    }
    if (refs.length) {
      throw new Error(`函数 ${apiName} 正被派生属性引用，不能删除：${refs.join(', ')}（请先移除属性或改绑其他函数）`);
    }
    await repo.deleteFunction(apiName);
    await refreshRuleScheduler(`函数 ${apiName} 删除（agent）`);
    return { ok: true, deleted: apiName };
  },
  // 派生/函数建模：给对象类型新增/更新属性（按 apiName 覆盖，保留其它属性）
  upsertObjectTypeProperty: async (apiName: string, property: Record<string, unknown>) => {
    const ot = await repo.getObjectType(apiName);
    if (!ot) throw new Error(`对象类型不存在: ${apiName}`);
    if (!property?.apiName) throw new Error('property.apiName 必填');
    const existing = ot.properties.find((x) => x.apiName === property.apiName);
    // 合并语义：以现有属性为底，仅覆盖显式传入的字段，避免"改说明"时丢掉类型/映射等元数据
    const p: any = { ...(existing ?? {}) };
    p.apiName = property.apiName;
    p.displayName = property.displayName ?? existing?.displayName ?? property.apiName;
    p.type = property.type ?? existing?.type ?? 'string';
    p.required = property.required !== undefined ? !!property.required : !!existing?.required;
    for (const k of [
      'description', 'allowedValues', 'valueType', 'unit', 'format', 'defaultValue',
      'derived', 'reducerFn', 'reducer', 'sourceMapping', 'sharedRef', 'overridden', 'derivation',
    ]) {
      if (property[k] !== undefined) p[k] = property[k];
    }
    if (p.derivation) {
      if (p.derivation.kind === 'function') {
        if (!p.derivation.function) throw new Error('derivation.function 必填');
        const fn = await repo.getFunction(String(p.derivation.function));
        if (!fn) throw new Error(`派生函数不存在: ${p.derivation.function}（请先 create_function）`);
        if (fn.kind !== 'query') {
          throw new Error(`派生属性只能引用 query 函数；${fn.apiName} 是 ${fn.kind ?? 'edit'} 函数（可通过 Action 触发）`);
        }
      } else if (p.derivation.kind === 'linkAggregation') {
        if (p.derivation.linkType && !(await repo.getLinkType(String(p.derivation.linkType)))) {
          throw new Error(`关系类型不存在: ${p.derivation.linkType}`);
        }
      } else if (p.derivation.kind !== 'expression') {
        throw new Error('derivation.kind 必须是 linkAggregation/function/expression');
      }
    }
    if (p.valueType && !(await repo.getValueType(String(p.valueType)))) {
      throw new Error(`值类型不存在: ${p.valueType}（请先在 Value Types 建好，或改用 allowedValues 直接写枚举）`);
    }
    const props = ot.properties.filter((x) => x.apiName !== p.apiName);
    props.push(p);
    await repo.updateObjectType(apiName, { ...ot, properties: props } as any);
    return {
      ok: true, apiName, property: p.apiName,
      replaced: !!existing,
      totalProperties: props.length,
      semanticFields: ['description', 'allowedValues', 'valueType', 'unit', 'format', 'defaultValue']
        .filter((k) => (p as any)[k] !== undefined),
    };
  },
  // 自动化：创建动作（引用已注册函数）
  createAction: async (def: any) => {
    if (!def?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(def.apiName)) throw new Error('动作 apiName 必填且只能含字母数字下划线');
    if (!def.effectFunction) throw new Error('effectFunction 必填（指向已注册函数）');
    if (!(await repo.getFunction(def.effectFunction))) {
      throw new Error(`动作引用的函数不存在: ${def.effectFunction}（请先 create_function）`);
    }
    if (await repo.getAction(def.apiName)) throw new Error(`动作已存在: ${def.apiName}`);
    await repo.createAction({
      apiName: def.apiName,
      displayName: def.displayName ?? def.apiName,
      kind: 'standard',
      parameters: def.parameters ?? [],
      validationRules: [],
      preconditions: def.preconditions ?? [],
      effect: { kind: 'function', ref: def.effectFunction },
      version: 1,
    } as any);
    return { ok: true, apiName: def.apiName, effectFunction: def.effectFunction };
  },
  // 自动化：创建规则（校验条件函数与动作存在）
  createRule: async (def: any) => {
    if (!def?.apiName || !/^[A-Za-z][A-Za-z0-9_]*$/.test(def.apiName)) throw new Error('规则 apiName 必填且只能含字母数字下划线');
    const trig = def.trigger;
    if (!trig || (trig.kind !== 'schedule' && trig.kind !== 'event')) throw new Error("trigger.kind 必须是 schedule 或 event");
    if (trig.kind === 'schedule' && !(Number(trig.intervalSeconds) >= 5)) throw new Error('schedule 规则 intervalSeconds 需 ≥ 5');
    if (trig.kind === 'event' && (trig.on !== 'object_write' || !trig.objectType)) {
      throw new Error("event 规则需为 {kind:'event', on:'object_write', objectType:'<对象类型>'}");
    }
    {
      const condFn = await repo.getFunction(def.conditionFunction);
      if (!condFn) throw new Error(`条件函数不存在: ${def.conditionFunction}（请先 create_function）`);
      if (condFn.kind !== 'query') {
        throw new Error(`规则条件函数必须是 query（只读）函数；${condFn.apiName} 是 ${condFn.kind ?? 'edit'} 函数`);
      }
    }
    if (!(await repo.getAction(def.actionApiName))) {
      throw new Error(`动作不存在: ${def.actionApiName}（请先 create_action）`);
    }
    if (await repo.getRule(def.apiName)) throw new Error(`规则已存在: ${def.apiName}`);
    await repo.createRule({
      apiName: def.apiName,
      displayName: def.displayName ?? def.apiName,
      enabled: def.enabled ?? true,
      trigger: trig,
      conditionFunction: def.conditionFunction,
      actionApiName: def.actionApiName,
      params: def.params ?? {},
      targetObjectType: def.targetObjectType ?? '',
      version: 1,
    } as any);
    void startRuleSchedulerIfNeeded();
    console.log(`[aip] 已创建规则 ${def.apiName}（${trig.kind}）`);
    return { ok: true, apiName: def.apiName, trigger: trig, enabled: def.enabled ?? true };
  },
  listValueTypes: async () => repo.listValueTypes(),
// 删除平台生成型对象的实例（级联关系边）
  deleteInstance: async (objectType: string, objectRid: string) => {
    const ot = await repo.getObjectType(objectType);
    if (!ot) throw new Error(`对象类型不存在: ${objectType}`);
    if (ot.sourceTable) {
      throw new Error(`对象类型 ${objectType} 为源映射型（sourceTable=${ot.sourceTable}），不允许删除实例；请通过同步或业务侧处理`);
    }
    const rid = ensureRid(objectType, objectRid);
    const links = await repo.deleteLinkInstancesForRid(objectType, rid);
    const deleted = await repo.deleteObjectWrite(objectType, rid);
    if (!deleted) throw new Error(`实例不存在: ${rid}`);
    return { ok: true, objectType, objectRid: rid, deletedLinks: links };
  },
  // 派生/函数建模：计算派生属性（验证用）
  computeDerived: async (objectType: string, property: string, rid: string) => {
    const sb = await getSandbox();
    await registerDbFunctions(repo, sb);
    // 派生属性必须是只读计算
    const { value } = await runWithReadOnly(() => repo.computeDerived(objectType, property, rid, sb));
    return { objectType, property, rid, value };
  },
  // 数据源建模：列出某 schema 下的全部表名（只读）
  listSourceTables: async (connId: string, schema?: string) => {
    const conn = await store.getSourceConnection(connId);
    if (!conn) throw new Error(`数据源不存在: ${connId}`);
    const s = schema || 'public';
    const tables = await store.listSourceTableNames(conn, s);
    return { connId, schema: s, count: tables.length, tables };
  },
  // 数据源建模：读取源表结构与样例行（只读，不创建任何对象类型）
  inspectSourceTable: async (connId: string, schema: string, table: string) => {
    const conn = await store.getSourceConnection(connId);
    if (!conn) throw new Error(`数据源不存在: ${connId}`);
    const probe = await store.probeSourceTables(conn, schema);
    if (!probe.reachable) throw new Error(`数据源不可达: ${probe.error ?? '未知错误'}`);
    const t = probe.tables.find((x) => x.table === table);
    if (!t) {
      const names = probe.tables.map((x) => x.table);
      throw new Error(
        `表不存在: ${schema}.${table}。该 schema 下可用表（${names.length} 张）：${names.slice(0, 40).join(', ')}`,
      );
    }
    const preview = await store.previewSourceTable(conn, { schema, table, limit: 5, offset: 0 });
    return {
      connId,
      schema,
      table,
      columns: t.columns,
      totalRows: preview.total,
      sampleRows: preview.rows,
      note: '只读探测结果：未创建/未修改任何对象类型',
    };
  },
};

// ---------- 受限 NL2SQL 执行 ----------
// 仅 enterprise_biz 这个只读源（S1）可被查询；按 source_connection 动态取连接信息。
// 注意：设计上不回写源库，此处强制只允许只读 SELECT。
// 连接解析：优先用环境变量 SQL_SOURCE_CONN_ID 指定的连接，否则取最早创建的只读连接。
// （之前写死 'src_enterprise_biz'，连接重建后 id 变化会失效，已改为动态解析。）
let sqlPool: import('pg').Pool | null = null;
let sqlPoolConnId: string | null = null;
async function getSqlPool(): Promise<import('pg').Pool> {
  if (sqlPool) return sqlPool;
  const preferId = process.env.SQL_SOURCE_CONN_ID;
  const { rows } = preferId
    ? await pool.query(
        `SELECT id, connection_meta FROM source_connection WHERE id=$1 AND read_only=true`,
        [preferId],
      )
    : await pool.query(
        `SELECT id, connection_meta FROM source_connection WHERE read_only=true ORDER BY created_at ASC LIMIT 1`,
      );
  if (!rows[0]?.connection_meta) {
    throw new Error('未找到可用的只读源连接：请先在 Data Sources 建一个只读连接（或用 SQL_SOURCE_CONN_ID 指定）');
  }
  sqlPoolConnId = rows[0].id;
  const m = rows[0].connection_meta;
  sqlPool = new Pool({
    host: m.host,
    port: m.port,
    user: m.user,
    database: m.database,
    password: process.env.SOURCE_DATABASE_PASSWORD || m.password || 'ontology',
    max: 2,
  });
  return sqlPool;
}

// 简单 SQL 安全校验：剥离注释/字符串后，只允许以只读语句开头，禁止写/DDL。
function validateReadOnlySql(sql: string, allowTables: string[]): string {
  const trimmed = (sql || '').trim().replace(/;+\s*$/, '');
  if (!trimmed) throw new Error('SQL 为空');
  // 去除行内注释 与 引号字符串，避免关键字被字符串内容误导
  const stripped = trimmed
    .replace(/--[^\n]*/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/'(?:[^']|'')*'/g, "''")
    .replace(/"([^"]*)"/g, '$1');
  const upper = stripped.toUpperCase();
  const forbidden = [
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE',
    'GRANT', 'REVOKE', 'MERGE', 'CALL', 'EXEC', 'EXECUTE', 'COPY', 'VACUUM',
    'REINDEX', 'CLUSTER', 'COMMENT', 'BEGIN', 'COMMIT', 'ROLLBACK',
  ];
  for (const kw of forbidden) {
    if (new RegExp(`\\b${kw}\\b`).test(upper)) {
      throw new Error(`受限 NL2SQL 仅允许只读查询，检测到禁用关键字：${kw}`);
    }
  }
  if (!/^\s*SELECT\b/.test(upper) && !/^\s*WITH\b/.test(upper)) {
    throw new Error('受限 NL2SQL 仅允许以 SELECT 或 WITH(CTE) 开头的只读语句');
  }
  // 表白名单校验：提取 FROM / JOIN 后的表名
  if (allowTables.length > 0) {
    const mentioned = new Set<string>();
    const re = /\b(?:FROM|JOIN)\s+([a-zA-Z_][\w.]*)?/gi;
    let mt: RegExpExecArray | null;
    while ((mt = re.exec(stripped)) !== null) {
      if (mt[1]) mentioned.add(mt[1].split('.').pop()!.toLowerCase());
    }
    const allowNorm = allowTables.map((x) => x.split('.').pop()!.toLowerCase());
    const bad = [...mentioned].filter((t) => !allowNorm.includes(t));
    if (bad.length > 0) {
      throw new Error(`检测到白名单外的表：${bad.join(', ')}（白名单：${allowTables.join(', ')}）`);
    }
  }
  return trimmed;
}

async function runReadOnlySql(sql: string, allowTables: string[], limit: number): Promise<unknown> {
  let safeSql = validateReadOnlySql(sql, allowTables);
  const capped = Math.min(Math.max(limit, 1), 1000);
  // 若用户 SQL 末尾已带 LIMIT，移除以统一由我们的上限控制（避免重复 LIMIT 语法错误）
  safeSql = safeSql.replace(/\bLIMIT\s+\d+\s*;?\s*$/i, '').trim();
  const p = await getSqlPool();
  const client = await p.connect();
  try {
    // 用事务包裹并设为只读，双保险
    await client.query('BEGIN TRANSACTION READ ONLY');
    const { rows } = await client.query(`${safeSql} LIMIT ${capped}`, []);
    await client.query('COMMIT');
    return { rowCount: rows.length, rows, note: `受限 NL2SQL：在只读源执行，最多返回 ${capped} 行` };
  } catch (e: any) {
    // 出错必须回滚，避免悬挂事务导致后续命令 "current transaction is aborted"
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// ---------- Provider CRUD ----------
app.get('/api/aip/providers', async (_req, res) => {
  try {
    const list = await repo.listAIPProviders();
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/aip/providers/:id', async (req, res) => {
  try {
    const p = await repo.getAIPProvider(req.params.id);
    if (!p) return res.status(404).json({ error: 'Provider 不存在' });
    res.json(p);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/aip/providers', async (req, res) => {
  try {
    const b = req.body ?? {};
    if (!b?.id || !b?.name || !b?.baseUrl) {
      return res.status(400).json({ error: 'id/name/baseUrl 必填' });
    }
    const provider = {
      id: b.id,
      name: b.name,
      baseUrl: b.baseUrl,
      apiKey: b.apiKey ?? '',
      protocol: b.protocol ?? 'openai-compatible',
      isDefault: b.isDefault ?? false,
    };
    if (provider.isDefault) {
      // 取消其他默认
      const all = await repo.listAIPProviders();
      for (const o of all) if (o.isDefault) await repo.upsertAIPProvider({ ...o, isDefault: false });
    }
    await repo.upsertAIPProvider(provider);
    res.status(201).json({ ok: true, provider });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/aip/providers/:id', async (req, res) => {
  try {
    const existing = await repo.getAIPProvider(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Provider 不存在' });
    const b = req.body ?? {};
    const provider = {
      id: req.params.id,
      name: b.name ?? existing.name,
      baseUrl: b.baseUrl ?? existing.baseUrl,
      apiKey: b.apiKey ?? existing.apiKey,
      protocol: b.protocol ?? existing.protocol,
      isDefault: b.isDefault ?? existing.isDefault ?? false,
    };
    if (provider.isDefault) {
      const all = await repo.listAIPProviders();
      for (const o of all) if (o.id !== provider.id && o.isDefault) await repo.upsertAIPProvider({ ...o, isDefault: false });
    }
    await repo.upsertAIPProvider(provider);
    res.json({ ok: true, provider });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/aip/providers/:id', async (req, res) => {
  try {
    await repo.deleteAIPProvider(req.params.id);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 探测 provider 下的模型列表（GET /v1/models），带启发式推理判断
app.post('/api/aip/providers/probe', async (req, res) => {
  try {
    const { baseUrl, apiKey } = req.body ?? {};
    if (!baseUrl) return res.status(400).json({ error: 'baseUrl 必填' });
    const client = new OpenAICompatibleLLM({ baseURL: baseUrl, apiKey: apiKey || undefined, timeoutMs: 15_000 });
    const models = await client.listModels();
    res.json({ ok: true, models: models.map((m) => ({ ...m, isReasoning: heuristicIsReasoning(m.id) })) });
  } catch (e: any) {
    res.json({ ok: false, error: e.message, models: [] });
  }
});

// ---------- Model CRUD ----------
app.get('/api/aip/models', async (req, res) => {
  try {
    const list = await repo.listAIPModels(req.query.providerId as string | undefined);
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/aip/models', async (req, res) => {
  try {
    const b = req.body ?? {};
    if (!b?.id || !b?.providerId || !b?.apiName) {
      return res.status(400).json({ error: 'id/providerId/apiName 必填' });
    }
    const model = {
      id: b.id,
      providerId: b.providerId,
      apiName: b.apiName,
      displayName: b.displayName ?? b.apiName,
      isReasoning: b.isReasoning ?? false,
      contextWindow: b.contextWindow ?? undefined,
      maxTokens: b.maxTokens ?? undefined,
      extra: b.extra ?? undefined,
    };
    await repo.upsertAIPModel(model);
    res.status(201).json({ ok: true, model });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/aip/models/:id', async (req, res) => {
  try {
    const existing = await repo.getAIPModel(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Model 不存在' });
    const b = req.body ?? {};
    const model = {
      id: req.params.id,
      providerId: b.providerId ?? existing.providerId,
      apiName: b.apiName ?? existing.apiName,
      displayName: b.displayName ?? existing.displayName,
      isReasoning: b.isReasoning ?? existing.isReasoning ?? false,
      contextWindow: b.contextWindow ?? existing.contextWindow,
      maxTokens: b.maxTokens ?? existing.maxTokens,
      extra: b.extra ?? existing.extra,
    };
    await repo.upsertAIPModel(model);
    res.json({ ok: true, model });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/aip/models/:id', async (req, res) => {
  try {
    await repo.deleteAIPModel(req.params.id);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- Agent CRUD ----------
// 新建 Agent（前端"新建"按钮调用）
app.post('/api/aip/agents', async (req, res) => {
  try {
    const body = req.body as Partial<AIPAgentConfig>;
    if (!body.id || !/^[A-Za-z0-9_-]+$/.test(body.id)) {
      return res.status(400).json({ error: 'Agent id 必填，且只能含字母数字/_/-' });
    }
    const existing = await repo.getAIPAgentConfig(body.id);
    if (existing) return res.status(409).json({ error: 'Agent id 已存在' });
    const cfg: AIPAgentConfig = {
      id: body.id,
      displayName: body.displayName ?? '新 Agent',
      systemPrompt: body.systemPrompt ?? DEFAULT_AGENT_PROMPT,
      modelScope: body.modelScope ?? [],
      defaultModelId: body.defaultModelId ?? '',
      temperature: body.temperature ?? 0.2,
      enabledTools: body.enabledTools ?? ['functions', 'actions', 'rules', 'explore', 'alerts', 'modeling'],
      objectTypes: body.objectTypes ?? [],
      maxSteps: body.maxSteps ?? 6,
      version: 1,
    };
    await repo.upsertAIPAgentConfig(cfg);
    res.json({ ok: true, config: cfg });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 删除 Agent（默认 Agent 'default' 不可删）
app.delete('/api/aip/agents/:id', async (req, res) => {
  try {
    if (req.params.id === 'default') return res.status(400).json({ error: '默认 Agent 不可删除' });
    const existing = await repo.getAIPAgentConfig(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Agent 不存在' });
    await repo.deleteAIPAgentConfig(req.params.id);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/aip/agents', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || undefined;
    const limit = req.query.limit ? Math.min(Math.max(Number(req.query.limit), 1), 500) : undefined;
    const offset = req.query.offset ? Math.max(Number(req.query.offset), 0) : undefined;
    const params: unknown[] = [];
    const wheres: string[] = [];
    if (keyword) {
      params.push(`%${keyword}%`);
      wheres.push(`(id ILIKE $${params.length} OR display_name ILIKE $${params.length})`);
    }
    const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
    const paging = limit !== undefined
      ? ` LIMIT ${limit} OFFSET ${offset ?? 0}`
      : '';
    const { rows } = await pool.query(`SELECT * FROM aip_agent ${whereSql} ORDER BY created_at ASC${paging}`, params);
    res.json(rows.map((r: any) => ({
      id: r.id,
      displayName: r.display_name,
      systemPrompt: r.system_prompt,
      modelScope: r.model_scope ?? [],
      defaultModelId: r.default_model_id,
      temperature: r.temperature,
      enabledTools: r.enabled_tools ?? [],
      objectTypes: r.object_types ?? [],
      maxSteps: r.max_steps,
      version: r.version,
    })));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/aip/agents/:id', async (req, res) => {
  try {
    const cfg = await repo.getAIPAgentConfig(req.params.id);
    if (!cfg) return res.status(404).json({ error: 'Agent 不存在' });
    res.json(cfg);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/aip/agents/:id', async (req, res) => {
  try {
    const body = req.body as Partial<AIPAgentConfig>;
    const existing = await repo.getAIPAgentConfig(req.params.id);
    const cfg: AIPAgentConfig = {
      id: req.params.id,
      displayName: body.displayName ?? existing?.displayName ?? 'Ontology Agent',
      systemPrompt: body.systemPrompt ?? existing?.systemPrompt ?? DEFAULT_AGENT_PROMPT,
      modelScope: body.modelScope ?? existing?.modelScope ?? [],
      defaultModelId: body.defaultModelId ?? existing?.defaultModelId ?? '',
      temperature: body.temperature ?? existing?.temperature ?? 0.2,
      enabledTools: body.enabledTools ?? existing?.enabledTools ?? ['functions', 'actions', 'rules', 'explore', 'alerts', 'modeling'],
      objectTypes: body.objectTypes ?? existing?.objectTypes ?? [],
      maxSteps: body.maxSteps ?? existing?.maxSteps ?? 6,
      version: existing?.version,
    };
    if (cfg.modelScope.length && !cfg.modelScope.includes(cfg.defaultModelId)) {
      cfg.defaultModelId = cfg.modelScope[0];
    }
    await repo.upsertAIPAgentConfig(cfg);
    res.json({ ok: true, config: cfg });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 删除 Agent（默认 Agent 'default' 不可删）
app.delete('/api/aip/agents/:id', async (req, res) => {
  try {
    if (req.params.id === 'default') return res.status(400).json({ error: '默认 Agent 不可删除' });
    const existing = await repo.getAIPAgentConfig(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Agent 不存在' });
    await repo.deleteAIPAgentConfig(req.params.id);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- AIP 会话管理 ----------
// 列出某 Agent 下的会话
app.get('/api/aip/agents/:id/conversations', async (req, res) => {
  try {
    const convs = await repo.listConversations(req.params.id);
    res.json(convs);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 新建会话（归属某 Agent）
app.post('/api/aip/agents/:id/conversations', async (req, res) => {
  try {
    const agent = await repo.getAIPAgentConfig(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent 不存在' });
    const conv = { id: crypto.randomUUID(), agentId: req.params.id, title: req.body?.title || '新会话' };
    await repo.createConversation(conv);
    res.json({ ok: true, conversation: conv });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 重命名会话
app.put('/api/aip/conversations/:cid', async (req, res) => {
  try {
    const title = req.body?.title;
    if (!title) return res.status(400).json({ error: 'title 必填' });
    await repo.renameConversation(req.params.cid, title);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 删除会话（连带消息）
app.delete('/api/aip/conversations/:cid', async (req, res) => {
  try {
    await repo.deleteConversation(req.params.cid);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 读取会话消息历史
app.get('/api/aip/conversations/:cid/messages', async (req, res) => {
  try {
    const msgs = await repo.listMessages(req.params.cid);
    res.json(msgs);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 根据 modelId 解析出激活的模型引用（含 provider 接入点）
async function resolveActiveModel(modelId: string): Promise<{ ref: ActiveModelRef; model: any; provider: any } | null> {
  const model = await repo.getAIPModel(modelId);
  if (!model) return null;
  const provider = await repo.getAIPProvider(model.providerId);
  if (!provider) return null;
  return {
    model,
    provider,
    ref: {
      apiName: model.apiName,
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey || undefined,
      isReasoning: model.isReasoning,
      maxTokens: model.maxTokens,
    },
  };
}

// Agent 对话入口（非流式，保留兼容）
app.post('/api/aip/agent/:id/run', async (req, res) => {
  try {
    const cfg = await repo.getAIPAgentConfig(req.params.id);
    if (!cfg) return res.status(404).json({ error: 'Agent 配置不存在，请先保存配置' });
    const message = req.body?.message;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message 必填' });
    }
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    // 模型选择：前端可传 modelId 覆盖默认
    const wantModelId = req.body?.modelId || cfg.defaultModelId;
    const resolved = wantModelId ? await resolveActiveModel(wantModelId) : null;
    const active = resolved?.ref;
    const fullCfg = finalizeAgentConfig(cfg);
    // 上下文预算：滑动窗口裁剪历史（保留首条用户消息 + 最近若干轮）
    const trimmedHistory = trimHistory(history, {
      contextWindow: resolved?.model?.contextWindow,
      maxTokens: resolved?.model?.maxTokens ?? active?.maxTokens,
      reservedTokens: estimateTokens(fullCfg.systemPrompt || '') + estimateTokens(message),
    });
    if (trimmedHistory.length !== history.length) {
      console.log(`[aip] 历史裁剪: ${history.length} → ${trimmedHistory.length} 条 (${message.slice(0, 20)}…)`);
    }
    const agent = new AIPAgent(fullCfg, agentRuntime, active ?? undefined);
    const result = await agent.run(message, trimmedHistory);
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Agent 流式对话入口（SSE）：逐步推送思考/动作/结果，前端实时展示
app.post('/api/aip/agent/:id/stream', async (req, res) => {
  try {
    const cfg = await repo.getAIPAgentConfig(req.params.id);
    if (!cfg) return res.status(404).json({ error: 'Agent 配置不存在，请先保存配置' });
    const message = req.body?.message;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message 必填' });
    }
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const conversationId = req.body?.conversationId || null;
    // 模型选择：前端可传 modelId 覆盖默认（用户对话时切换模型）
    const wantModelId = req.body?.modelId || cfg.defaultModelId;
    const resolved = wantModelId ? await resolveActiveModel(wantModelId) : null;
    const active = resolved?.ref;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // 立刻落库 user 消息：生成期间刷新/切换页面也不会丢请求
    if (conversationId) {
      try {
        await repo.appendMessage({
          id: crypto.randomUUID(), conversationId, role: 'user', content: message, timeline: [],
        });
      } catch (e: any) {
        console.error('[aip] user 消息落库失败', e.message);
      }
    }

    const fullCfg = finalizeAgentConfig(cfg);
    const trimmedHistory = trimHistory(history, {
      contextWindow: resolved?.model?.contextWindow,
      maxTokens: resolved?.model?.maxTokens ?? active?.maxTokens,
      reservedTokens: estimateTokens(fullCfg.systemPrompt || '') + estimateTokens(message),
    });
    if (trimmedHistory.length !== history.length) {
      console.log(`[aip] 历史裁剪(stream): ${history.length} → ${trimmedHistory.length} 条`);
    }
    const agent = new AIPAgent(fullCfg, agentRuntime, active ?? undefined);
    // 客户端主动停止（关闭连接）时中止生成，避免继续消耗模型调用
    let clientGone = false;
    res.on('close', () => { clientGone = true; });
    const send = (event: unknown) => {
      if (!clientGone && !res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    // 收集结构化过程（思考/工具）用于落库
    const timeline: unknown[] = [];
    let finalReply = '';
    let firstThought = true;
    let interrupted = false; // 客户端断开或模型异常导致生成提前结束
    try {
      for await (const ev of agent.runStream(message, trimmedHistory)) {
        if (clientGone) { interrupted = true; break; }
        send(ev);
        if (ev.type === 'thought') {
          // 把逐 token 思考合并为一个条目（落库用）
          if (firstThought) { timeline.push({ kind: 'thought', content: ev.content }); firstThought = false; }
          else (timeline[timeline.length - 1] as any).content += ev.content;
        } else if (ev.type === 'action') {
          timeline.push({ kind: 'action', tool: ev.tool, args: ev.args });
        } else if (ev.type === 'result') {
          const lastAction = [...timeline].reverse().find((t: any) => t.kind === 'action' && !('result' in t));
          if (lastAction) (lastAction as any).result = ev.result;
        } else if (ev.type === 'reply_chunk') {
          finalReply += ev.content;
        } else if (ev.type === 'done') {
          finalReply = finalReply || ev.reply || '';
        }
      }
    } catch (e: any) {
      interrupted = true;
      send({ type: 'error', message: e.message });
    }
    if (interrupted) console.warn(`[aip] 生成被中断，已生成 ${finalReply.length} 字，保存部分回答`);
    if (!clientGone && !res.writableEnded) {
      res.write('event: end\ndata: {}\n\n');
      res.end();
    }

    // 生成结束后只落 assistant（user 已在开始时落库）；空回复不落库，避免出现空气泡
    if (conversationId && finalReply.trim()) {
      const content = interrupted
        ? `${finalReply}\n\n> ⏹ 回答已中断（页面离开/连接关闭或模型异常），可重新发送继续。`
        : finalReply;
      try {
        await repo.appendMessage({ id: crypto.randomUUID(), conversationId, role: 'ai', content, timeline });
      } catch (e: any) {
        console.error('[aip] assistant 消息落库失败', e.message);
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 健康检查
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---------- MCP 端点：把内置智能体的工具集暴露给外部客户端 ----------
// 说明：工具集与内置智能体一致（默认全部工具组），通过 MCP Streamable HTTP 调用。
// 安全：如设置 MCP_TOKEN，则要求 Authorization: Bearer <token>；默认仅监听本机。
const MCP_TOOL_GROUPS = (process.env.MCP_TOOL_GROUPS || 'functions,actions,rules,explore,alerts,modeling')
  .split(',').map((x) => x.trim()).filter(Boolean);
const mcpAgentCfg = {
  id: 'mcp', name: 'MCP', providerId: '', modelId: '', systemPrompt: '',
  temperature: 0, maxSteps: 1, enabledTools: MCP_TOOL_GROUPS, objectTypes: [],
} as any;
const { specs: mcpSpecs, toolMap: mcpToolMap } = buildAgentTools(agentRuntime, mcpAgentCfg);
const mcpTools = mcpSpecs.map((sp) => ({
  name: sp.function.name,
  description: sp.function.description ?? '',
  inputSchema: (sp.function.parameters as any) ?? { type: 'object', properties: {} },
}));

function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: 'ontology-mcp', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: mcpTools }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = mcpToolMap[name];
    if (!handler) throw new McpError(ErrorCode.MethodNotFound, `未知工具: ${name}`);
    try {
      const result = await handler((args ?? {}) as Record<string, unknown>);
      const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      return { content: [{ type: 'text' as const, text }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `ERROR: ${e.message}` }], isError: true };
    }
  });
  return server;
}

app.post('/mcp', async (req, res) => {
  const token = process.env.MCP_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  const server = createMcpServer();
  res.on('close', () => { void transport.close(); void server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e: any) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
});
app.get('/mcp', (_req, res) => res.status(405).json({ error: 'Method Not Allowed（使用 POST）' }));
app.delete('/mcp', (_req, res) => res.status(405).json({ error: 'Method Not Allowed（无状态模式）' }));

// 校验失败记录（健康观测）
app.get('/api/s2/validation-issues', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 500);
    const { rows } = await pool.query(
      `SELECT * FROM validation_issue ORDER BY id DESC LIMIT $1`, [limit],
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- 系统维护：手动重新灌入业务数据 ----------
// 等价于启动时的 bootstrap（S1 数据源 + S2 定义 + S3 实例全量重推），但由用户显式触发。
app.post('/api/admin/reingest', async (_req, res) => {
  try {
    const report = await runReingest();
    res.json(report);
  } catch (e: any) {
    // 并发触发等前置条件不满足时返回 409
    res.status(409).json({ error: e.message });
  }
});

// 查询重新灌入是否正在进行（供前端禁用按钮 / 轮询）
app.get('/api/admin/reingest/status', (_req, res) => res.json({ running: reingestRunning }));

const PORT = Number(process.env.PORT || 4000);

// AIP Agent 默认系统提示词（可在配置平台覆盖）
const DEFAULT_AGENT_PROMPT = `你是 Ontology 平台的智能助理（AIP Agent）。你可以通过工具访问本体的全部能力：
- 查询对象实例与关系图谱（员工/部门/产品/设备/项目/请假记录）
- 执行 Ontology 函数（如离职风险评估）
- 触发动作、运行自动化规则
- 聚合统计与直方图分析
- 查看告警
- 数据源建模：浏览已接入的数据源、分析源表结构，并给出对象类型建模建议（创建动作需用户在前端确认）
请根据用户自然语言意图，自主选择合适的工具并多步串联完成复杂任务，最后用简洁中文总结结果。`;

// 数据源建模工作流：仅在 Agent 启用了 modeling 工具组时追加到系统提示词。
// 关键约束：AI 只做"分析 + 提问 + 给草案"，创建动作由前端确认卡片触发（不由模型直连写库）。
const MODELING_PROMPT = `
## 数据源建模工作流（当用户要求"把某数据源中的某张表引入并创建对象类型"时严格执行）
1. 先调用 list_source_connections 确定数据源 id（名称不完全匹配时列出候选让用户选，不要臆测）。
2. 先用 list_source_tables 拿到该 schema 下的真实表名（禁止猜测表名），再调用 inspect_source_table
   读取表结构（字段名/类型/主键/可空）与样例行，禁止凭猜测编造字段。
3. 分析后给出建模建议，并一次性提出必要的澄清问题（最多 3 个），例如：
   - 主键：用自增 id 还是业务编码（emp_code 等）？
   - 字段裁剪：created_at / updated_at / 敏感字段是否不建为属性？
   - 类型：date/timestamp 是否保留；枚举字段（gender/status）是否需要约束说明？
   - 关系：哪些外键建议同时建成关系类型（如 dept_id → Department）？
4. 用户回答或确认后，输出最终草案：必须用一个 json 代码块，且严格符合以下结构：
\`\`\`json
{"type":"object_type_draft","apiName":"Employee","displayName":"员工","description":"……","sourceConnectionId":"src_enterprise_biz","schema":"public","sourceTable":"employee","primaryKey":"id","titleProperty":"name","properties":[{"apiName":"id","displayName":"ID","type":"integer","required":true,"sourceMapping":"id"},{"apiName":"name","displayName":"姓名","type":"string","required":true,"sourceMapping":"name"}]}
\`\`\`
   - type 只能是 string/integer/float/boolean/date/timestamp；
   - apiName 用 PascalCase，属性 apiName 用 camelCase，displayName 用中文；
   - 枚举型字段（status/level/type 等）请给属性加 description 与 allowedValues：
     allowedValues=[{value:'high',label:'高风险',description:'…'}]，便于规则/动作与 AI 对齐取值；
   - sourceMapping 必须填源表真实列名。
5. 最后告知用户："确认后点击下方「确认创建」将创建对象类型并同步实例。"然后停止，
   不要自行创建、不要调用其他写操作。

## 关系类型建模（当用户问"两个对象之间有没有关系/能不能建关系"时）
1. 先用 list_link_types 看已有关系，再用 inspect_object_type 查看源/目标对象类型的属性与 sourceMapping，
   确认哪一列是外键（如 organization.parent_id）。
2. 输出关系类型草案，必须用 json 代码块：
\`\`\`json
{"type":"link_type_draft","apiName":"OrganizationParent","displayName":"上级组织","sourceType":"Organization","targetType":"Organization","cardinality":"one-to-many","foreignKey":"parent_id","targetKeyProperty":"id","pluralName":"下级组织"}
\`\`\`
   - foreignKey = 源表外键列名；targetKeyProperty = 目标对象主键属性 apiName；
   - 方向规则：**持有外键的一方作为源端**（如 leave_record.employee_id → LeaveRecord → Employee），
     不要把外键所在表放到目标端，否则同步会取不到外键列；
   - cardinality 取 one-to-one / one-to-many / many-to-many；
   - 外键模式只支持"外键值 = 目标对象主键值"；跨键关联（如 emp_code→id）当前不支持，
     建议用户给源表补一列指向目标主键（如 employee_id），或改用关联表模式。
3. 多对多关系（中间表/关联表）用关联表模式，草案示例：
\`\`\`json
{"type":"link_type_draft","apiName":"DeviceDepartment","displayName":"设备使用部门","sourceType":"Device","targetType":"Department","cardinality":"many-to-many","junctionTable":"device_department","sourceColumn":"device_id","targetColumn":"department_id"}
\`\`\`
   - junctionTable 为关联表名；sourceColumn 映射源端主键、targetColumn 映射目标端主键；此模式不需要 foreignKey。
4. 告知用户"确认后点击「确认创建」将创建关系类型并同步关系实例"，然后停止。

## 问数规则（重要）
- 关联/多跳查询优先用 search_around（从对象集沿关系跳到对端对象），再对结果过滤/聚合；
- 用户问对象/关系/属性数据时，优先用对象查询工具：get_instances、aggregate、histogram、get_object_links；
- **禁止用 run_sql 查本体数据**（run_sql 只用于源表探查；当前对智能体默认关闭）；
- 需要排序取 TopN 时用 get_instances 的 orderBy/order/pageSize，不要退化成全量拉取。

## 派生属性 / 统计类属性（当用户要"员工数/人数/统计值"时）
先判断用途，再选路径：
- **只需实时问答** → 直接在本体上算（aggregate / get_instances / get_object_links），**不要用 run_sql 查本体**。
- **要成为对象类型的属性、且在 Explore 列表可见** → **预计算**（推荐）：
  1) create_function 写计算函数，函数体用 ctx.links()/ctx.objects() 多跳统计，并用 ctx.repo.writeObjectPatch() 把结果写入实例属性；
  2) invoke_function 执行一次；
  3) get_instances 抽样验证。
- **只需详情页/接口可查** → **函数派生**：
  1) create_function 写计算函数（只返回数值，不写库）；
  2) add_object_type_property 加属性：{apiName, displayName, type:'integer', derived:true, reducerFn:<函数名>}；
  3) compute_derived 验证若干实例。
硬约束：
- 平台**声明式派生只支持单跳**（countLinks/avg/sum…），两跳及以上必须用函数；
- 源表没有的列**不得**编造 sourceMapping；
- 函数体必须 "return async (args, ctx) => {...}"，args 含 objectType/objectRid/property；
- 关系方向：ctx.links(lt) 返回 [{sourceRid, targetRid}]，按关系类型的源/目标端语义过滤；
- 递归（含下级）必须做环保护与深度上限。
- **预计算必须先读快照、再写回**：严禁先 clearObjectWrites 再读取（清空后 ctx.objects 必然为空，会静默删光实例）；
  需要重置实例时用平台同步接口（/api/s2/object-types/:apiName/sync），不要在函数里 clear。
- 写入前先检查实例数：若读取结果为 0 而源表有数据，立即停止并报告，不要继续写。
- writeObjectPatch 返回 undefined 表示成功（写入无返回值），不要当作失败；落库结果用 get_instances 复核。
- 探测/临时函数用完可用 delete_function 清理；若函数仍被派生属性（reducerFn）引用会被拒绝，需先解绑。
- 函数分两类：query=只读计算（可做派生属性/规则条件，沙箱禁止写对象）；edit=可写对象/关系（应通过 Action 触发）。
  create_function 传 kind；派生属性只能引用 query 函数，否则 add_object_type_property 会拒绝。
- 平台生成型对象（无 sourceTable，如 Alert）的实例可用 delete_instance 删除（会级联关系边）；
  源映射型对象禁止删除实例。删除前先向用户确认 objectType 与 rid。
- 属性语义：add_object_type_property 支持 description / allowedValues / valueType / unit / format / defaultValue / derivation，
  按 apiName 合并（只覆盖传入字段）。派生属性请写 derivation：
  function 模式={kind:'function',function,args?,resultNote}；linkAggregation={kind:'linkAggregation',linkType,direction,targetProperty,aggregation,resultNote}。
  派生属性只读，不能被 writeObjectPatch 覆盖。valueType 必须引用已存在的值类型（先用 list_value_types 查看）；
  不存在时直接用 allowedValues 写枚举，**不要编造** 「ForeignKey:xxx」「OrgType」这类未创建的值类型名。
- 写入后用 inspect_object_type 复核属性字段（它返回完整定义，含 description/allowedValues/valueType）；
  若复查看不到，说明没落库，不要对用户声称"已补齐"。

## 调度与自动化（规则）
- 规则 = trigger + conditionFunction + actionApiName：
  - schedule：{kind:'schedule', intervalSeconds:number}（最小 5 秒，平台 10 秒 tick）；
  - event：{kind:'event', on:'object_write', objectType:'Employee'}（对象写入事件）。
- 条件函数必须返回 {flagged:[...]}；为空则不会执行动作。
- 事件触发只覆盖平台写入（同步/动作/函数），源库直接改动不会触发，需先同步进本体。
- 规则必须有动作（数据库外键约束）；动作通过 create_action 创建，effect 指向已注册函数。
- 创建规则前先向用户说明"规则会在后台自动执行"，并确认参数（尤其 event 的 objectType）。
- 典型用法：定时重算预计算属性（schedule）+ 条件函数返回空；或数据写入后自动生成告警（event）。
`;

// 工具调用格式约束：所有 Agent 统一追加（减少本地模型输出 XML 文本的概率）
const TOOL_FORMAT_HINT = `
## 工具调用格式
请通过平台提供的 function-calling 通道调用工具；不要输出 <tool_call>、<function=...>、<parameter=...> 这类 XML 文本。
`;

// ---------- 应急响应 API（Ontology 之上的业务层） ----------
const emergencyService = new EmergencyService(repo);

app.post('/api/emergency/events', async (req, res) => {
  try {
    res.json(await emergencyService.createOpinionEvent(req.body ?? {}));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/emergency/cases', async (_req, res) => {
  try {
    res.json(await emergencyService.listCases());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id', async (req, res) => {
  try {
    const c = await emergencyService.getCase(req.params.id);
    if (!c) return res.status(404).json({ error: 'not found' });
    res.json(c);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id/graph', async (req, res) => {
  try {
    res.json(await emergencyService.getGraph(req.params.id));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id/candidates', async (req, res) => {
  try {
    res.json(await emergencyService.listCandidates(req.params.id));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/emergency/candidates/:id/accept', async (req, res) => {
  try {
    await emergencyService.decideCandidate(req.params.id, true);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/candidates/:id/reject', async (req, res) => {
  try {
    await emergencyService.decideCandidate(req.params.id, false);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/emergency/inbox', async (req, res) => {
  try {
    const type = req.query.type === 'inspection' ? 'inspection' : 'verification';
    res.json(await emergencyService.listInbox(type));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id/tasks', async (req, res) => {
  try {
    res.json(await emergencyService.listTasks(req.params.id));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/emergency/tasks/:id/receive', async (req, res) => {
  try {
    await emergencyService.receiveTask(req.params.id);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/tasks/:id/submit', async (req, res) => {
  try {
    res.json(await emergencyService.submitTask(req.params.id, req.body ?? {}));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id/analysis', async (req, res) => {
  try {
    res.json(await emergencyService.latestAnalysis(req.params.id));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/analyze', async (req, res) => {
  try {
    res.json(await emergencyService.analyzeCase(req.params.id));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/ref-status', async (req, res) => {
  try {
    const { entityRid, status } = req.body ?? {};
    await emergencyService.setRefStatus(req.params.id, String(entityRid ?? ''), String(status ?? ''));
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/manual-entity', async (req, res) => {
  try {
    res.json(await emergencyService.addManualEntity(req.params.id, req.body ?? {}));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/inspection-task', async (req, res) => {
  try {
    res.json(await emergencyService.createInspectionTask(req.params.id, req.body ?? {}));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/emergency/cases/:id/extracted', async (req, res) => {
  try {
    res.json(await emergencyService.listExtracted(req.params.id));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/emergency/extracted/:id/accept', async (req, res) => {
  try {
    await emergencyService.decideExtracted(req.params.id, true);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/extracted/:id/reject', async (req, res) => {
  try {
    await emergencyService.decideExtracted(req.params.id, false);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/closure-draft', async (req, res) => {
  try {
    res.json(await emergencyService.generateClosureDraft(req.params.id));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/emergency/cases/:id/close', async (req, res) => {
  try {
    res.json(await emergencyService.closeCase(req.params.id, req.body ?? {}));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 注入建模提示词（不影响未启用 modeling 的 Agent）
function finalizeAgentConfig(cfg: AIPAgentConfig): AIPAgentConfig {
  const base = `${cfg.systemPrompt || ''}\n${TOOL_FORMAT_HINT}`;
  if (!Array.isArray(cfg.enabledTools) || !cfg.enabledTools.includes('modeling')) {
    return { ...cfg, systemPrompt: base };
  }
  return { ...cfg, systemPrompt: `${base}\n${MODELING_PROMPT}` };
}
// 仅当作为入口直接运行时才监听端口；被测试 import 时不自动启动，避免 EADDRINUSE。
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`[ontology-server] S1/S2 API on :${PORT}`);
    // 自动 bootstrap 已按要求关闭（2026-11-23）：重启不再自动灌 S1/S2/S3 业务数据。
    // 需要恢复时：取消下面一行注释并重启后端；或手动执行 `npm run bootstrap -w @ontology/enterprise-biz`。
    // bootstrapEnterpriseBiz();
    // 规则调度器独立启动：有启用规则才跑（告警等自动化依赖它）
    startRuleSchedulerIfNeeded();
  });
}

// 优雅关闭
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
