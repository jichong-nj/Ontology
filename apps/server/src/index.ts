// apps/server — 真实 S1/S2 API 聚合层
// 连接 ontology 元数据库，暴露 REST 端点供前端消费。
import express from 'express';
import { Pool } from 'pg';
import { PostgresMetadataRepository, TypeScriptFunctionSandbox } from '@ontology/ontology-core';
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
  startScheduler,
  buildSandbox,
  registerDbFunctions,
} from '@ontology/enterprise-biz';
import { RuleScheduler } from '@ontology/ontology-core';
import { AIPAgent } from '@ontology/ai-orchestration';
import type { AgentRuntime, ActiveModelRef } from '@ontology/ai-orchestration';
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
// 共享沙箱：首次使用时惰性构建（注册企业业务函数），供 HTTP 调用与后台调度器复用，
// 不依赖 bootstrap 是否已执行，提升健壮性与可测试性。
let sharedSandbox: TypeScriptFunctionSandbox | null = null;
async function getSandbox(): Promise<TypeScriptFunctionSandbox> {
  if (!sharedSandbox) {
    sharedSandbox = buildSandbox(repo);
    // 预热时把元数据库中存库可编辑的函数体注册进来（含前端创建的函数）
    await registerDbFunctions(repo, sharedSandbox);
  }
  return sharedSandbox;
}
let ruleScheduler: import('@ontology/ontology-core').RuleScheduler | null = null;
async function bootstrapEnterpriseBiz() {
  try {
    // 1) 将企业治理数据写为对象实例（S1 源库在 manage 端；对象/关系/函数定义落在元数据库）
    await seedEnterpriseBiz(pool);
    await seedDepartmentInstances(repo);
    await seedEmployeeInstances(repo);
    await seedLeaveRecordInstances(repo);
    await seedBusinessObjectInstances(repo);
    await seedExtensionInstances(repo);
    // 2) 注册函数定义 + TS 实现到沙箱
    for (const fn of functions) {
      await repo.createFunction(fn);
    }
    await getSandbox(); // 预热共享沙箱（注册 evaluateDimissionRisk / createDimissionAlert）
    // 启动后台告警调度器（可配置 Function 评估 + 可配置 Action 落地告警对象）
    ruleScheduler = startScheduler(repo, 10_000);
    console.log('[bootstrap] enterprise-biz 场景已注册（对象实例 + 函数 + 告警调度器）');
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
    const result = await mappingSvc.probeSourceTables(req.params.id);
    res.json(result);
  } catch (e: any) {
    // 源端不可达（如源库未部署）或连接不存在，返回结构化结果而非裸 500。
    res.json({ reachable: false, error: e.message, tables: [] });
  }
});

// 仅测试连接连通性（建立连接 + SELECT 1），不列举表。
app.post('/api/s1/connections/:id/test', async (req, res) => {
  try {
    const result = await mappingSvc.testConnection(req.params.id);
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
    const result = await repo.computeDerived(apiName, propApiName, rid, sandbox);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- S2 函数管理（CRUD）----------
app.get('/api/s2/functions', async (_req, res) => {
  try {
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
    const fn: OntologyFunction = {
      apiName: def.apiName,
      displayName: def.displayName,
      language: def.language,
      entry: def.entry,
      inputs: def.inputs ?? [],
      outputs: def.outputs ?? [],
      description: def.description ?? null,
      body: def.body ?? null,
      version: def.version ?? 1,
    };
    await repo.createFunction(fn);
    // 立即注册到共享沙箱（若已预热）
    if (sharedSandbox && fn.body && fn.language === 'typescript') {
      await registerDbFunctions(repo, sharedSandbox);
    }
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
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/s2/functions/:apiName', async (req, res) => {
  try {
    await repo.deleteFunction(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 动作管理（CRUD + 触发）----------
app.get('/api/s2/actions', async (_req, res) => {
  try {
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
    const fn = await repo.getFunction(req.params.fnApiName);
    if (!fn) return res.status(404).json({ error: '函数未注册' });
    // 每次 invoke 前刷新 DB 函数体（让前端新建/修改的函数即时生效）
    const sandbox = await getSandbox();
    await registerDbFunctions(repo, sandbox);
    const result = await sandbox.execute(req.params.fnApiName, req.body ?? {});
    res.json({ ok: true, function: fn.apiName, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 自动化规则列表（通用「满足条件→执行动作」）
app.get('/api/s2/rules', async (_req, res) => {
  try {
    const rules = await repo.listRules();
    res.json(rules);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 新建自动化规则（FDE 可自助配置，无需改码）
app.post('/api/s2/rules', async (req, res) => {
  try {
    const def = req.body as AutomationRule;
    if (!def?.apiName) return res.status(400).json({ error: 'apiName 必填' });
    if (await repo.getRule(def.apiName)) {
      return res.status(409).json({ error: `规则已存在: ${def.apiName}` });
    }
    await repo.createRule(def);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 手动触发全部自动化规则（后台定时任务的手动入口）
app.post('/api/s2/rules/run', async (_req, res) => {
  try {
    // 优先复用后台调度器；若后台未启动（如仅测试/轻量部署），按需构建设置了函数的调度器。
    let scheduler = ruleScheduler;
    if (!scheduler) {
      const sb = await getSandbox();
      scheduler = new RuleScheduler(repo, sb, { tickMs: 999_999_999 });
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
    await repo.updateRule(req.params.apiName, patch);
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
app.get('/api/s2/alerts', async (_req, res) => {
  try {
    const props = await repo.listObjectProperties('Alert');
    res.json(props);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- S2 对象类型 ----------
app.get('/api/s2/object-types', async (_req, res) => {
  try {
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
app.get('/api/s2/link-types', async (_req, res) => {
  try {
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
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    const pageToken = req.query.pageToken ? String(req.query.pageToken) : undefined;
    const result = await repo.listInstances(objectType, { filter, pageSize, pageToken });
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 获取某个具体对象的所有关联关系（按 link_type 分组，含对端对象属性）
app.get('/api/s2/explore/object/:objectType/:objectRid/links', async (req, res) => {
  try {
    const { objectType, objectRid } = req.params;
    // 查询所有以该对象为 source 或 target 的 link_instance，JOIN link_type 获取元信息
    const { rows } = await pool.query(
      `SELECT li.link_type, lt.display_name AS link_display_name,
              lt.source_type, lt.target_type,
              CASE WHEN li.source_rid = $2 THEN 'target' ELSE 'source' END AS direction,
              CASE WHEN li.source_rid = $2 THEN li.target_rid ELSE li.source_rid END AS other_rid
         FROM link_instance li
         JOIN link_type lt ON lt.api_name = li.link_type
        WHERE (li.source_rid = $2 OR li.target_rid = $2)
          AND (lt.source_type = $1 OR lt.target_type = $1)
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
const agentRuntime: AgentRuntime = {
  listFunctions: () => repo.listFunctions(),
  listActions: () => repo.listActions(),
  listRules: () => repo.listRules(),
  listObjectTypes: (opts) => repo.listObjectTypes(opts),
  invokeFunction: async (name, args) => {
    const sb = await getSandbox();
    await registerDbFunctions(repo, sb);
    return sb.execute(name, args);
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
      scheduler = new RuleScheduler(repo, sb, { tickMs: 999_999_999 });
    }
    return scheduler.runAll();
  },
  listAlerts: () => repo.listObjectProperties('Alert'),
  getInstances: (objectType, opts) => repo.listInstances(objectType, opts),
  getObjectLinks: async (objectType, objectRid) => {
    const { rows } = await pool.query(
      `SELECT li.link_type, lt.display_name AS link_display_name,
              lt.source_type, lt.target_type,
              CASE WHEN li.source_rid = $2 THEN 'target' ELSE 'source' END AS direction,
              CASE WHEN li.source_rid = $2 THEN li.target_rid ELSE li.source_rid END AS other_rid
         FROM link_instance li
         JOIN link_type lt ON lt.api_name = li.link_type
        WHERE (li.source_rid = $2 OR li.target_rid = $2)
          AND (lt.source_type = $1 OR lt.target_type = $1)
        ORDER BY li.link_type, li.created_at DESC`,
      [objectType, objectRid],
    );
    return rows;
  },
  aggregate: (objectType, property, topN) => repo.aggregateByProperty(objectType, property, topN ?? 20),
  histogram: (objectType, property, buckets) => repo.histogramByProperty(objectType, property, buckets ?? 20),
};

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
      enabledTools: body.enabledTools ?? ['functions', 'actions', 'rules', 'explore', 'alerts'],
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

app.get('/api/aip/agents', async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM aip_agent ORDER BY created_at ASC`);
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
      enabledTools: body.enabledTools ?? existing?.enabledTools ?? ['functions', 'actions', 'rules', 'explore', 'alerts'],
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
    const agent = new AIPAgent(cfg, agentRuntime, active ?? undefined);
    const result = await agent.run(message, history);
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

    const agent = new AIPAgent(cfg, agentRuntime, active ?? undefined);
    const send = (event: unknown) => res.write(`data: ${JSON.stringify(event)}\n\n`);
    // 收集结构化过程（思考/工具）用于落库
    const timeline: unknown[] = [];
    let finalReply = '';
    let firstThought = true;
    try {
      for await (const ev of agent.runStream(message, history)) {
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
      send({ type: 'error', message: e.message });
    }
    res.write('event: end\ndata: {}\n\n');
    res.end();

    // 落库（会话存在时记录 user + assistant）
    if (conversationId) {
      try {
        await repo.appendMessage({ id: crypto.randomUUID(), conversationId, role: 'user', content: message, timeline: [] });
        await repo.appendMessage({ id: crypto.randomUUID(), conversationId, role: 'ai', content: finalReply, timeline });
      } catch (e: any) {
        console.error('[aip] 会话落库失败', e.message);
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 健康检查
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);

// AIP Agent 默认系统提示词（可在配置平台覆盖）
const DEFAULT_AGENT_PROMPT = `你是 Ontology 平台的智能助理（AIP Agent）。你可以通过工具访问本体的全部能力：
- 查询对象实例与关系图谱（员工/部门/产品/设备/项目/请假记录）
- 执行 Ontology 函数（如离职风险评估）
- 触发动作、运行自动化规则
- 聚合统计与直方图分析
- 查看告警
请根据用户自然语言意图，自主选择合适的工具并多步串联完成复杂任务，最后用简洁中文总结结果。`;
// 仅当作为入口直接运行时才监听端口；被测试 import 时不自动启动，避免 EADDRINUSE。
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`[ontology-server] S1/S2 API on :${PORT}`);
    // 启动后引导业务场景（实例下推 + 函数注册）
    bootstrapEnterpriseBiz();
  });
}

// 优雅关闭
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
