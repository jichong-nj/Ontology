// apps/server — 真实 S1/S2 API 聚合层
// 连接 ontology 元数据库，暴露 REST 端点供前端消费。
import express from 'express';
import { Pool } from 'pg';
import { PostgresMetadataRepository, TypeScriptFunctionSandbox } from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from '@ontology/data-integration';
import {
  functions,
  registerDimissionRisk,
  seedEnterpriseBiz,
  seedEmployeeInstances,
  startScheduler,
} from '@ontology/enterprise-biz';

const META_URL =
  process.env.META_DATABASE_URL ||
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: META_URL });
const repo = new PostgresMetadataRepository(pool);
const store = new PostgresMappingStore(pool);
const mappingSvc = new MappingService(store, repo);

// ---------- 业务场景引导（S3 实例下推 + 函数注册） ----------
const sandbox = new TypeScriptFunctionSandbox();
let alertScheduler: import('@ontology/ontology-core').AlertScheduler | null = null;
async function bootstrapEnterpriseBiz() {
  try {
    // 1) 将企业治理数据写为对象实例（S1 源库在 manage 端；对象/关系/函数定义落在元数据库）
    await seedEnterpriseBiz(pool);
    await seedEmployeeInstances(repo);
    // 2) 注册函数定义 + TS 实现到沙箱
    for (const fn of functions) {
      await repo.createFunction(fn);
    }
    registerDimissionRisk(sandbox, repo);
    // 启动后台告警调度器（可配置 Function 评估 + 可配置 Action 落地告警对象）
    alertScheduler = startScheduler(repo, 10_000);
    console.log('[bootstrap] enterprise-biz 场景已注册（对象实例 + 函数 + 告警调度器）');
  } catch (e: any) {
    console.error('[bootstrap] enterprise-biz 引导失败:', e.message);
  }
}

const app = express();
app.use(express.json());

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

// 探测只读源库的表与字段（映射内嵌在对象类型中，无需独立的映射管理层）
app.get('/api/s1/connections/:id/probe', async (req, res) => {
  try {
    const tables = await mappingSvc.probeSourceTables(req.params.id);
    res.json(tables);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- S2 派生属性 + 函数触发 ----------
app.get('/api/s2/object-types/:apiName/derived/:propApiName', async (req, res) => {
  try {
    const { apiName, propApiName } = req.params;
    const rid = req.query.rid as string | undefined;
    if (!rid) return res.status(400).json({ error: '缺少 rid 查询参数（对象实例标识）' });
    const result = await repo.computeDerived(apiName, propApiName, rid);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 触发一个 Ontology Function（如离职风险评估）。返回函数执行结果。
app.post('/api/s2/functions/:fnApiName/invoke', async (req, res) => {
  try {
    const fn = await repo.getFunction(req.params.fnApiName);
    if (!fn) return res.status(404).json({ error: '函数未注册' });
    const result = await sandbox.execute(req.params.fnApiName, req.body ?? {});
    res.json({ ok: true, function: fn.apiName, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 告警规则列表
app.get('/api/s2/alert-rules', async (_req, res) => {
  try {
    const rules = await repo.listAlertRules();
    res.json(rules);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// 手动触发全部告警规则（后台定时任务的手动入口）
app.post('/api/s2/alert-rules/run', async (_req, res) => {
  try {
    if (!alertScheduler) return res.status(409).json({ error: '调度器尚未初始化' });
    const result = await alertScheduler.runAll();
    res.json({ ok: true, results: result });
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

// 计算一个派生属性的值（如"部门人数" = 以该部门为 target 的关系实例数）
app.get('/api/s2/object-types/:apiName/derived/:propApiName', async (req, res) => {
  try {
    const { apiName, propApiName } = req.params;
    const rid = req.query.rid as string | undefined;
    if (!rid) return res.status(400).json({ error: '缺少 rid 查询参数（对象实例标识）' });
    const result = await repo.computeDerived(apiName, propApiName, rid);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
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

app.delete('/api/s2/link-types/:apiName', async (req, res) => {
  try {
    await repo.deleteLinkType(req.params.apiName);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 健康检查
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`[ontology-server] S1/S2 API on :${PORT}`);
  // 启动后引导业务场景（实例下推 + 函数注册）
  bootstrapEnterpriseBiz();
});

// 优雅关闭
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
