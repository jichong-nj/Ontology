// S1 集成测试：真实 PostgreSQL（映射配置 + 质量门禁）
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from './index';
import type { SourceConnection, ObjectMapping } from './mapping-model';

const DATABASE_URL = process.env.DATABASE_URL ??
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: DATABASE_URL });
const store = new PostgresMappingStore(pool);
const metadata = new PostgresMetadataRepository(pool);
const svc = new MappingService(store, metadata);

beforeAll(async () => {
  await pool.query('SELECT 1');
});
afterAll(async () => {
  await pool.end();
});
beforeEach(async () => {
  await pool.query(`
    TRUNCATE source_connection, object_mapping RESTART IDENTITY CASCADE;
    TRUNCATE object_type, interface_def, object_interface RESTART IDENTITY CASCADE;
  `);
});

describe('S1 MappingService', () => {
  it('源连接必须 readOnly=true（只读门禁）', async () => {
    const good: SourceConnection = {
      id: 'src1', displayName: 'HR DB', kind: 'database',
      readOnly: true, connectionMeta: { host: 'x' }, secretRef: 'vault://hr',
      status: 'connected', createdAt: '', updatedAt: '',
    };
    await svc.registerSourceConnection(good);
    const list = await store.listSourceConnections();
    expect(list[0].readOnly).toBe(true);

    const bad: SourceConnection = { ...good, id: 'src2', readOnly: false as true };
    await expect(svc.registerSourceConnection(bad)).rejects.toThrow(/readOnly/);
  });

  it('映射质量门禁：对象不存在→failed；属性不全→warning；完整→passed', async () => {
    await svc.registerSourceConnection({
      id: 'src1', displayName: 'HR DB', kind: 'database',
      readOnly: true, connectionMeta: {}, secretRef: 'vault://hr',
      status: 'connected', createdAt: '', updatedAt: '',
    });

    // 对象类型未创建 → failed
    const mMissing: ObjectMapping = {
      id: 'm1', objectType: 'Person', sourceConnectionId: 'src1', sourceTable: 't_person',
      fieldMappings: [{ property: 'name', sourceColumn: 'name' }],
      incrementalMeta: { syncMode: 'full' }, qualityStatus: 'unknown',
      createdAt: '', updatedAt: '',
    };
    const r1 = await svc.createObjectMapping(mMissing);
    expect(r1.qualityStatus).toBe('failed');

    // 创建对象（name 属性），映射缺属性 → warning
    await metadata.createObjectType({
      apiName: 'Person', displayName: '人员',
      properties: [{ apiName: 'name', displayName: '姓名', type: 'string', required: true }],
      implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '',
    });
    const r2 = await svc.createObjectMapping({
      ...mMissing, id: 'm2', fieldMappings: [{ property: 'age', sourceColumn: 'age' }],
    });
    expect(r2.qualityStatus).toBe('warning');

    // 完整映射 → passed
    const r3 = await svc.createObjectMapping({
      ...mMissing, id: 'm3', fieldMappings: [{ property: 'name', sourceColumn: 'name' }],
    });
    expect(r3.qualityStatus).toBe('passed');
  });
});
