// S2 集成测试：真实 PostgreSQL（统一单库，邻接表）
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Pool } from 'pg';
import {
  PostgresMetadataRepository,
  DefaultInterfaceMethodEngine,
  TypeScriptFunctionSandbox,
} from './index';
import type { ObjectType, LinkType, InterfaceDef, OntologyFunction } from './types';

const DATABASE_URL = process.env.DATABASE_URL ??
  'postgresql://ontology:ontology@localhost:5432/ontology';

const pool = new Pool({ connectionString: DATABASE_URL });
const repo = new PostgresMetadataRepository(pool);

beforeAll(async () => {
  await pool.query('SELECT 1');
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query(`
    TRUNCATE object_type, link_type, link_instance, object_write,
      interface_def, object_interface, interface_method_impl,
      action_type, ontology_function RESTART IDENTITY CASCADE;
  `);
});

describe('S2 MetadataRepository', () => {
  const person: ObjectType = {
    apiName: 'Person',
    displayName: '人员',
    properties: [{ apiName: 'name', displayName: '姓名', type: 'string', required: true }],
    implementsInterfaces: [],
    version: 1,
    createdAt: '', updatedAt: '',
  };
  const employer: LinkType = {
    apiName: 'Employer',
    displayName: '雇主',
    sourceType: 'Person', targetType: 'Person',
    cardinality: 'many-to-many',
    instanceSource: 'managed',
    version: 1,
  };

  it('创建并读取对象类型（含接口反查）', async () => {
    await repo.createObjectType(person);
    const got = await repo.getObjectType('Person');
    expect(got?.apiName).toBe('Person');
    expect(got?.properties[0].apiName).toBe('name');
    const list = await repo.listObjectTypes();
    expect(list.map((o) => o.apiName)).toContain('Person');
  });

  it('创建关系类型并维护关系实例（图拓扑）', async () => {
    await repo.createObjectType(person);
    await repo.createLinkType(employer);
    await repo.createLinkInstance('Employer', 'p1', 'c1');
    await repo.createLinkInstance('Employer', 'p1', 'c2');
    const inst = await repo.listLinkInstances('Employer', 'p1');
    expect(inst).toEqual([
      { sourceRid: 'p1', targetRid: 'c1' },
      { sourceRid: 'p1', targetRid: 'c2' },
    ]);
  });

  it('本体可写侧 object_write（动作 effect.write 落库，不写回源端）', async () => {
    await repo.writeObjectPatch('Person', 'p1', { name: 'Alice' }, 'system');
    const { rows } = await pool.query('SELECT * FROM object_write WHERE object_rid=$1', ['p1']);
    expect(rows.length).toBe(1);
    expect(rows[0].patch).toMatchObject({ name: 'Alice' });
    expect(rows[0].actor).toBe('system');
  });

  it('接口方法多态绑定与解析（getObjectsImplementing 递归 CTE）', async () => {
    await repo.createObjectType(person);
    const iface: InterfaceDef = {
      apiName: 'Named', displayName: '可命名',
      properties: [], methods: [], version: 1,
    };
    // 直接写入接口定义（listInterfaces 需要），通过 repo 间接：用 createObjectType 已含，这里用 SQL
    await pool.query(
      `INSERT INTO interface_def (api_name, display_name, properties, methods, version) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      ['Named', '可命名', '[]', '[]', 1],
    );
    await repo.setObjectInterface('Person', 'Named');
    const impl = await repo.getObjectsImplementing('Named');
    expect(impl).toContain('Person');

    const fn: OntologyFunction = {
      apiName: 'Person.greet', displayName: '打招呼', language: 'typescript',
      entry: 'greet', inputs: [], outputs: ['string'], version: 1,
    };
    await repo.createFunction(fn);
    await repo.bindInterfaceMethod('Person', 'Named', 'greet', 'Person.greet');
    const resolved = await repo.resolveInterfaceMethod('Person', 'Named', 'greet');
    expect(resolved).toBe('Person.greet');
  });

  it('接口方法运行时引擎：python 返回未实现，typescript 可执行', async () => {
    await repo.createObjectType(person);
    await pool.query(
      `INSERT INTO interface_def (api_name, display_name, properties, methods, version) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      ['Named', '可命名', '[]', '[]', 1],
    );
    await repo.setObjectInterface('Person', 'Named');

    const sandbox = new TypeScriptFunctionSandbox();
    sandbox.register('Person.greet', (args) => `hi ${(args.name as string) ?? ''}`);
    const engine = new DefaultInterfaceMethodEngine(repo, sandbox);

    await repo.createFunction({
      apiName: 'Person.greet', displayName: '打招呼', language: 'typescript',
      entry: 'greet', inputs: [], outputs: ['string'], version: 1,
    });
    await repo.bindInterfaceMethod('Person', 'Named', 'greet', 'Person.greet');
    const res = await engine.invoke({
      objectType: 'Person', objectRid: 'p1', interfaceApi: 'Named', methodApi: 'greet', args: { name: 'Bob' },
    });
    expect(res.ok).toBe(true);
    expect(res.value).toBe('hi Bob');

    // python 占位 → 未实现
    await repo.createFunction({
      apiName: 'Person.greetPy', displayName: '打招呼Py', language: 'python',
      entry: 'greet.py', inputs: [], outputs: ['string'], version: 1,
    });
    await repo.bindInterfaceMethod('Person', 'Named', 'greet', 'Person.greetPy');
    const resPy = await engine.invoke({
      objectType: 'Person', objectRid: 'p1', interfaceApi: 'Named', methodApi: 'greet', args: {},
    });
    expect(resPy.ok).toBe(false);
    expect(resPy.error).toContain('未实现');
  });
});
