#!/usr/bin/env node
// Automation API 回归测试：多 effect / notify / webhook / fallback / 级联防护 / 运行历史 / cron
// 前置：后端运行在 API_BASE（默认 http://localhost:4000），PostgreSQL 可连接（DATABASE_URL）
// 用法：npm run qa:automation
import http from 'node:http';
import pg from 'pg';

const API = process.env.API_BASE ?? 'http://localhost:4000';
const DB = process.env.DATABASE_URL ?? 'postgresql://ontology:ontology@localhost:5432/ontology';
const { Pool } = pg;
const pool = new Pool({ connectionString: DB });

let pass = 0;
let fail = 0;
const results = [];
const webhookRequests = [];

function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`✅ ${name}`); }
  else { fail++; console.log(`❌ ${name} ${detail}`); }
  results.push({ name, ok: !!cond, detail });
}

async function req(path, method = 'GET', body) {
  const r = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, body: json };
}

const condition = { kind: 'property', objectType: 'Employee', property: 'workHours', operator: 'gt', value: 0 };

async function create(def) {
  const r = await req('/api/s2/automations', 'POST', def);
  if (r.status !== 200) throw new Error(`create ${def.apiName}: ${r.status} ${JSON.stringify(r.body)}`);
}
const run = (name) => req(`/api/s2/automations/${name}/run`, 'POST');
const runs = async (name) => (await req(`/api/s2/automations/${name}/runs?limit=100`)).body;
const del = (name) => req(`/api/s2/automations/${name}`, 'DELETE');

async function waitFor(name, pred, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const list = await runs(name);
    if (Array.isArray(list) && list.some(pred)) return list;
    await new Promise((r) => setTimeout(r, 500));
  }
  return await runs(name);
}

async function dbCleanup() {
  await pool.query("DELETE FROM automation_run WHERE automation_api_name LIKE 'qa\\_%'");
  await pool.query("DELETE FROM notification WHERE source LIKE 'qa\\_%'");
  await pool.query("DELETE FROM automation WHERE api_name LIKE 'qa\\_%'");
}

let sink;
try {
  const health = await fetch(API + '/api/health').then((r) => r.json()).catch(() => null);
  if (!health?.ok) throw new Error(`后端不可用: ${API}（先启动 apps/server）`);

  sink = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try { webhookRequests.push(JSON.parse(body)); } catch { webhookRequests.push(body); }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
  });
  await new Promise((resolve) => sink.listen(0, '127.0.0.1', resolve));
  const sinkUrl = `http://127.0.0.1:${sink.address().port}/hook`;

  await dbCleanup();

  // 1. 现有 automation 回归
  const all = await req('/api/s2/rules/run', 'POST');
  check('现有 automation 可运行',
    all.status === 200 && all.body?.results?.length >= 3 && all.body.results.every((r) => r.ran),
    JSON.stringify(all.body));

  // 2. 多 effect：notify(inapp) + webhook
  await create({
    apiName: 'qa_multi', displayName: 'QA 多效果', enabled: true,
    trigger: { kind: 'schedule', intervalSeconds: 300 }, condition,
    effects: [
      { kind: 'notify', channel: 'inapp', title: 'QA 多效果通知', body: 'ok' },
      { kind: 'webhook', url: sinkUrl },
    ],
    execution: { mode: 'sequential', maxRetries: 1, timeoutMs: 5000 },
    targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_multi');
  const multi = await waitFor('qa_multi', (r) => r.status === 'succeeded');
  const mr = multi.find((r) => r.status === 'succeeded');
  check('多 effect succeeded', !!mr && mr.effectResults?.length === 2 && mr.effectResults.every((e) => e.ok), JSON.stringify(mr?.effectResults));
  const notes = await req('/api/s2/notifications?limit=20');
  check('notify(inapp) 写入通知', Array.isArray(notes.body) && notes.body.some((n) => n.source === 'qa_multi'), JSON.stringify(notes.body?.slice(0, 2)));
  check('webhook 收到请求', webhookRequests.some((b) => b?.automation === 'qa_multi'));

  // 3. 部分失败
  await create({
    apiName: 'qa_partial', displayName: 'QA 部分失败', enabled: true,
    trigger: { kind: 'schedule', intervalSeconds: 300 }, condition,
    effects: [
      { kind: 'notify', channel: 'inapp', title: 'QA partial' },
      { kind: 'webhook', url: 'http://127.0.0.1:4598/dead' },
    ],
    execution: { mode: 'sequential', maxRetries: 1, timeoutMs: 3000 },
    targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_partial');
  const partial = await waitFor('qa_partial', (r) => r.status === 'partial');
  const pr = partial.find((r) => r.status === 'partial');
  check('失败 effect 标记 partial', !!pr && pr.effectResults?.some((e) => !e.ok) && pr.effectResults?.some((e) => e.ok), JSON.stringify(pr?.effectResults));

  // 4. fallback
  await create({
    apiName: 'qa_fallback', displayName: 'QA fallback', enabled: true,
    trigger: { kind: 'schedule', intervalSeconds: 300 }, condition,
    effects: [{
      kind: 'webhook', url: 'http://127.0.0.1:4598/dead', retry: { maxAttempts: 1 },
      fallback: { kind: 'notify', channel: 'inapp', title: 'QA fallback 成功' },
    }],
    execution: { mode: 'sequential', timeoutMs: 3000 },
    targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_fallback');
  const fb = (await waitFor('qa_fallback', (r) => r.status === 'succeeded')).find((r) => r.status === 'succeeded');
  check('effect fallback 生效', !!fb && JSON.stringify(fb.effectResults).includes('fallback'), JSON.stringify(fb?.effectResults));

  // 5. A -> B 链路
  await create({
    apiName: 'qa_chain_a', displayName: 'QA 链路 A', enabled: true,
    trigger: { kind: 'schedule', intervalSeconds: 300 }, condition,
    effects: [{ kind: 'action', actionApiName: 'recomputeEmpLeaveStatsJob' }],
    execution: { chainDepthLimit: 5 }, targetObjectType: 'Employee', params: {}, version: 1,
  });
  await create({
    apiName: 'qa_chain_b', displayName: 'QA 链路 B', enabled: true,
    trigger: { kind: 'event', on: 'object_write', objectType: 'Employee' }, condition,
    effects: [{ kind: 'notify', channel: 'inapp', title: 'QA 链路 B' }],
    execution: { chainDepthLimit: 5 }, targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_chain_a');
  const aRun = (await runs('qa_chain_a')).find((r) => r.status === 'succeeded');
  const bRun = (await waitFor('qa_chain_b', (r) => r.status === 'succeeded', 10000)).find((r) => r.status === 'succeeded');
  check('A 产生 chainId', !!aRun?.chainId, JSON.stringify(aRun));
  check('B 继承 chainId 且 depth=1', !!bRun && bRun.chainId === aRun?.chainId && bRun.depth === 1, JSON.stringify(bRun));
  await del('qa_chain_a');
  await del('qa_chain_b');

  // 6. 自循环
  await create({
    apiName: 'qa_cycle', displayName: 'QA 自循环', enabled: true,
    trigger: { kind: 'event', on: 'object_write', objectType: 'Employee' }, condition,
    effects: [{ kind: 'action', actionApiName: 'recomputeEmpLeaveStatsJob' }],
    execution: { chainDepthLimit: 5 }, targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_cycle');
  const cyc = await waitFor('qa_cycle', (r) => r.status === 'skipped', 10000);
  check('自循环拦截 chain_cycle', cyc.some((r) => r.status === 'skipped' && String(r.error).includes('chain_cycle')), JSON.stringify(cyc.map((r) => ({ status: r.status, error: r.error, depth: r.depth }))));
  await del('qa_cycle');

  // 7. 深度限制
  await create({
    apiName: 'qa_depth', displayName: 'QA 深度限制', enabled: true,
    trigger: { kind: 'event', on: 'object_write', objectType: 'Employee' }, condition,
    effects: [{ kind: 'action', actionApiName: 'recomputeEmpLeaveStatsJob' }],
    execution: { chainDepthLimit: 0 }, targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_depth');
  const dep = await waitFor('qa_depth', (r) => r.status === 'skipped', 10000);
  check('超深拦截 chain_depth', dep.some((r) => r.status === 'skipped' && String(r.error).includes('chain_depth')), JSON.stringify(dep.map((r) => ({ status: r.status, error: r.error, depth: r.depth }))));
  await del('qa_depth');

  // 8. 删除后历史保留
  await create({
    apiName: 'qa_del', displayName: 'QA 删除历史', enabled: true,
    trigger: { kind: 'schedule', intervalSeconds: 300 }, condition,
    effects: [{ kind: 'notify', channel: 'inapp', title: 'QA del' }],
    targetObjectType: 'Employee', params: {}, version: 1,
  });
  await run('qa_del');
  await waitFor('qa_del', (r) => r.status === 'succeeded');
  const beforeDel = (await runs('qa_del')).length;
  await del('qa_del');
  const afterDel = await req('/api/s2/automations/qa_del/runs?limit=100');
  check('删除 automation 后历史保留', beforeDel > 0 && afterDel.status === 200 && afterDel.body.length === beforeDel, `${beforeDel} -> ${afterDel.body?.length}`);

  // 9. cron 触发
  await create({
    apiName: 'qa_cron', displayName: 'QA cron', enabled: true,
    trigger: { kind: 'schedule', cron: '* * * * *' }, condition,
    effects: [{ kind: 'notify', channel: 'inapp', title: 'QA cron' }],
    targetObjectType: 'Employee', params: {}, version: 1,
  });
  const cronRuns = await waitFor('qa_cron', (r) => r.status === 'succeeded', 25000);
  check('cron 自动触发', cronRuns.some((r) => r.status === 'succeeded'), JSON.stringify(cronRuns.slice(0, 2)));
} catch (e) {
  console.error('测试异常:', e);
  fail++;
} finally {
  try { await dbCleanup(); } catch (e) { console.error('清理失败:', e.message); fail++; }
  await pool.end().catch(() => {});
  if (sink) await new Promise((resolve) => sink.close(resolve));
}

console.log(`\nAPI 结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
