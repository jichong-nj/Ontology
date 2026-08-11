// S1 集成测试：真实 PostgreSQL（数据源接入 + 映射内嵌质量门禁）
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import { PostgresMappingStore, MappingService } from './index';
import type { SourceConnection, CreateObjectTypeWithMappingInput } from './index';

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

  it('映射内嵌质量门禁：属性不全→warning；完整→passed', async () => {
    await svc.registerSourceConnection({
      id: 'src1', displayName: 'HR DB', kind: 'database',
      readOnly: true, connectionMeta: {}, secretRef: 'vault://hr',
      status: 'connected', createdAt: '', updatedAt: '',
    });

    // 创建对象（name 属性），映射缺属性 → warning（来源仍内嵌进对象类型）
    const base: CreateObjectTypeWithMappingInput = {
      objectType: {
        apiName: 'Person', displayName: '人员', description: '',
        properties: [{ apiName: 'name', displayName: '姓名', type: 'string', required: true }],
        implementsInterfaces: [], version: 1, createdAt: '', updatedAt: '',
      },
      sourceConnectionId: 'src1', sourceTable: 't_person',
      fieldMappings: [{ property: 'age', sourceColumn: 'age' }],
    };
    const r2 = await svc.createObjectTypeWithMapping(base);
    expect(r2.qualityStatus).toBe('warning');
    const ot2 = await metadata.getObjectType('Person');
    expect(ot2?.sourceConnectionId).toBe('src1');
    expect(ot2?.sourceTable).toBe('t_person');

    // 完整映射 → passed
    const r3 = await svc.createObjectTypeWithMapping({
      ...base, fieldMappings: [{ property: 'name', sourceColumn: 'name' }],
    });
    expect(r3.qualityStatus).toBe('passed');
  });
});
