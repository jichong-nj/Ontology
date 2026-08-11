// HTTP 集成测试：启动真实 express 应用（apps/server），
// 覆盖 S1/S2 全部 REST 端点，按业务场景串联：
//   数据源 -> 对象/关系/函数/动作/告警规则 -> 派生属性 -> 函数调用 -> 告警生成。
//
// 直接复用 index.ts 的 app 与 enterprise-biz 引导逻辑，对真实 PostgreSQL 进行端到端校验。
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { createApp } from './index';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import { seedEnterpriseBiz, seedEmployeeInstances, SOURCE_ID } from '@ontology/enterprise-biz';

const META_URL =
  process.env.META_DATABASE_URL ||
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: META_URL });
const repo = new PostgresMetadataRepository(pool);
const app = createApp();
const BASE = `http://127.0.0.1`;
let server: any;
let port = 0;

async function request(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; json: any }> {
  const res = await fetch(`${BASE}:${port}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

beforeAll(async () => {
  // 业务引导：S1 数据源 + S2 定义 + S3 实例下推（不启动后台调度器，避免 tick 干扰断言）
  await seedEnterpriseBiz(pool);
  await seedEmployeeInstances(repo);
  // 测试隔离：清空上一次运行可能残留的 Alert 实例
  await repo.clearObjectWrites('Alert');
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(async () => {
  if (server) await new Promise<void>((r) => server.close(() => r()));
  await pool.end();
});

describe('S1 数据源端点', () => {
  it('GET /api/s1/connections 返回已注册只读源', async () => {
    const { status, json } = await request('GET', '/api/s1/connections');
    expect(status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.some((c: any) => c.id === SOURCE_ID)).toBe(true);
  });

  it('GET /api/s1/connections/:id 命中单条', async () => {
    const { status, json } = await request('GET', `/api/s1/connections/${SOURCE_ID}`);
    expect(status).toBe(200);
    expect(json.id).toBe(SOURCE_ID);
  });

  it('GET /api/s1/connections/:id/probe 返回结构化探测结果', async () => {
    const { status, json } = await request('GET', `/api/s1/connections/${SOURCE_ID}/probe`);
    // 源端可达返回 {reachable:true,tables}，不可达返回 {reachable:false,error}；均不应 500。
    expect(status).toBe(200);
    expect(typeof json.reachable).toBe('boolean');
  });
});

describe('S2 对象/关系类型端点', () => {
  it('GET /api/s2/object-types 包含 Employee/Department/Alert', async () => {
    const { status, json } = await request('GET', '/api/s2/object-types');
    expect(status).toBe(200);
    const names = json.map((o: any) => o.apiName);
    expect(names).toContain('Employee');
    expect(names).toContain('Department');
    expect(names).toContain('Alert');
  });

  it('GET /api/s2/object-types/:apiName 命中 Employee', async () => {
    const { status, json } = await request('GET', '/api/s2/object-types/Employee');
    expect(status).toBe(200);
    expect(json.apiName).toBe('Employee');
  });

  it('GET /api/s2/link-types 包含 EmployeeDepartment', async () => {
    const { status, json } = await request('GET', '/api/s2/link-types');
    expect(status).toBe(200);
    expect(json.some((l: any) => l.apiName === 'EmployeeDepartment')).toBe(true);
  });
});

describe('派生属性端点', () => {
  it('GET derived avgWorkHours 缺少 rid 返回 400', async () => {
    const { status } = await request('GET', '/api/s2/object-types/Department/derived/avgWorkHours');
    expect(status).toBe(400);
  });

  it('GET derived avgWorkHours 返回部门平均工时', async () => {
    const { status, json } = await request(
      'GET',
      '/api/s2/object-types/Department/derived/avgWorkHours?rid=5',
    );
    expect(status).toBe(200);
    expect(typeof json.value).toBe('number');
    // 部门5：E0005(5.0) E0006(7.2) E0007(7.8) -> 平均 6.67
    expect(json.value).toBeCloseTo(6.6667, 2);
  });
});

describe('函数调用端点', () => {
  it('POST functions/evaluateDimissionRisk/invoke 返回标记结果', async () => {
    const { status, json } = await request('POST', '/api/s2/functions/evaluateDimissionRisk/invoke', {
      threshold: 0.8,
    });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.result.flagged)).toBe(true);
    // E0005(5.0 < 6.67*0.8=5.33) 与 E0008(4.5 < 7.0*0.8=5.6) 被标记
    const flagged = json.result.flagged.map((f: any) => f.rid);
    expect(flagged).toContain('E0005');
    expect(flagged).toContain('E0008');
  });

  it('POST 调用未注册函数返回 404', async () => {
    const { status } = await request('POST', '/api/s2/functions/doesNotExist/invoke', {});
    expect(status).toBe(404);
  });
});

describe('告警规则 + 告警对象端点', () => {
  it('GET /api/s2/alert-rules 返回启用规则', async () => {
    const { status, json } = await request('GET', '/api/s2/alert-rules');
    expect(status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.some((r: any) => r.apiName === 'dimissionRiskRule')).toBe(true);
  });

  it('规则运行前 /api/s2/alerts 为空', async () => {
    const { status, json } = await request('GET', '/api/s2/alerts');
    expect(status).toBe(200);
    expect(json.length).toBe(0);
  });

  it('POST /api/s2/alert-rules/run 生成告警对象', async () => {
    const { status, json } = await request('POST', '/api/s2/alert-rules/run');
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    const dimissionResult = json.results.find((r: any) => r.rule === 'dimissionRiskRule');
    expect(dimissionResult).toBeTruthy();
    expect(dimissionResult.flaggedCount).toBeGreaterThan(0);
    expect(dimissionResult.alertsCreated).toBeGreaterThan(0);
  });

  it('运行后 /api/s2/alerts 出现 Alert 实例', async () => {
    const { status, json } = await request('GET', '/api/s2/alerts');
    expect(status).toBe(200);
    expect(json.length).toBeGreaterThan(0);
    expect(json.some((a: any) => a.properties?.subjectRid === 'E0005')).toBe(true);
  });
});

describe('健康检查', () => {
  it('GET /api/health 返回 ok', async () => {
    const { status, json } = await request('GET', '/api/health');
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });
});
