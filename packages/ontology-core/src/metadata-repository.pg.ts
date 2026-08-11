// S2 Ontology 内核 — PostgreSQL 实现的 MetadataRepository（邻接表表达图拓扑）
// 统一存储决策见 docs/S0-storage-design.md。真实连接 PostgreSQL（统一单库）。

import {
  MetadataRepository,
  ObjectType,
  LinkType,
  InterfaceDef,
  ActionType,
  OntologyFunction,
  PropertyDef,
  DerivedSpec,
  parseDerivedSpec,
  AlertRule,
} from './types';
import { Pool } from 'pg';

export class PostgresMetadataRepository implements MetadataRepository {
  constructor(private pool: Pool) {}

  async listObjectTypes(): Promise<ObjectType[]> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, source_connection_id, source_table,
              version, created_at, updated_at,
              COALESCE((SELECT array_agg(interface_api_name)
                        FROM object_interface WHERE object_api_name = o.api_name), ARRAY[]::text[]) AS implements_interfaces
       FROM object_type o ORDER BY api_name`,
    );
    return rows.map((r: any) => ({
      apiName: r.api_name,
      displayName: r.display_name,
      description: r.description,
      properties: r.properties,
      implementsInterfaces: r.implements_interfaces,
      sourceConnectionId: r.source_connection_id ?? undefined,
      sourceTable: r.source_table ?? undefined,
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getObjectType(apiName: string): Promise<ObjectType | null> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, source_connection_id, source_table,
              version, created_at, updated_at,
              COALESCE((SELECT array_agg(interface_api_name)
                        FROM object_interface WHERE object_api_name = $1), ARRAY[]::text[]) AS implements_interfaces
       FROM object_type WHERE api_name = $1`,
      [apiName],
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      apiName: r.api_name,
      displayName: r.display_name,
      description: r.description,
      properties: r.properties,
      implementsInterfaces: r.implements_interfaces,
      sourceConnectionId: r.source_connection_id ?? undefined,
      sourceTable: r.source_table ?? undefined,
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async createObjectType(def: ObjectType): Promise<void> {
    // version 是 NOT NULL 字段，调用方（前端/API）可能未传，缺省为 1
    const version = def.version ?? 1;
    await this.pool.query(
      `INSERT INTO object_type (api_name, display_name, description, properties, source_connection_id, source_table, version, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
       ON CONFLICT (api_name) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         description = EXCLUDED.description,
         properties = EXCLUDED.properties,
         source_connection_id = EXCLUDED.source_connection_id,
         source_table = EXCLUDED.source_table,
         version = EXCLUDED.version,
         updated_at = now()`,
      [def.apiName, def.displayName, def.description ?? null, JSON.stringify(def.properties),
       def.sourceConnectionId ?? null, def.sourceTable ?? null, version],
    );
  }

  async updateObjectType(apiName: string, def: ObjectType): Promise<void> {
    // version 是 NOT NULL 字段，调用方（前端/API）可能未传，缺省为 1
    const version = def.version ?? 1;
    await this.pool.query(
      `UPDATE object_type
         SET display_name=$2, description=$3, properties=$4, source_connection_id=$5, source_table=$6, version=$7, updated_at=now()
       WHERE api_name=$1`,
      [apiName, def.displayName, def.description ?? null, JSON.stringify(def.properties),
       def.sourceConnectionId ?? null, def.sourceTable ?? null, version],
    );
  }

  async deleteObjectType(apiName: string): Promise<void> {
    // 级联清理：删除对象类型前，先清掉引用它的关系类型与接口绑定
    await this.pool.query(`DELETE FROM link_type WHERE source_type=$1 OR target_type=$1`, [apiName]);
    await this.pool.query(`DELETE FROM object_interface WHERE object_api_name=$1`, [apiName]);
    await this.pool.query(`DELETE FROM object_type WHERE api_name=$1`, [apiName]);
  }

  async listLinkTypes(): Promise<LinkType[]> {
    const { rows } = await this.pool.query(`SELECT * FROM link_type ORDER BY api_name`);
    return rows.map((r: any) => ({
      apiName: r.api_name,
      displayName: r.display_name,
      sourceType: r.source_type,
      targetType: r.target_type,
      cardinality: r.cardinality,
      instanceSource: r.instance_source,
      version: r.version,
    }));
  }

  async deleteLinkType(apiName: string): Promise<void> {
    await this.pool.query(`DELETE FROM link_type WHERE api_name=$1`, [apiName]);
  }

  async getLinkType(apiName: string): Promise<LinkType | null> {
    const { rows } = await this.pool.query(`SELECT * FROM link_type WHERE api_name=$1`, [apiName]);
    if (!rows.length) return null;
    const r = rows[0];
    return {
      apiName: r.api_name,
      displayName: r.display_name,
      sourceType: r.source_type,
      targetType: r.target_type,
      cardinality: r.cardinality,
      instanceSource: r.instance_source,
      version: r.version,
    };
  }

  async createLinkType(def: LinkType): Promise<void> {
    await this.pool.query(
      `INSERT INTO link_type (api_name, display_name, source_type, target_type, cardinality, instance_source, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, def.sourceType, def.targetType, def.cardinality, def.instanceSource, def.version],
    );
  }

  async createLinkInstance(linkType: string, sourceRid: string, targetRid: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO link_instance (link_type, source_rid, target_rid) VALUES ($1,$2,$3)`,
      [linkType, sourceRid, targetRid],
    );
  }

  async listLinkInstances(linkType: string, sourceRid?: string): Promise<{ sourceRid: string; targetRid: string }[]> {
    const params = sourceRid ? [linkType, sourceRid] : [linkType];
    const sql = sourceRid
      ? `SELECT source_rid, target_rid FROM link_instance WHERE link_type=$1 AND source_rid=$2`
      : `SELECT source_rid, target_rid FROM link_instance WHERE link_type=$1`;
    const { rows } = await this.pool.query(sql, params);
    return rows.map((r: any) => ({ sourceRid: r.source_rid, targetRid: r.target_rid }));
  }

  // 计算一个派生属性的值（当前支持 countLinks：统计某关系类型中以本对象为 source/target 的实例数）。
  // 返回 { value }，非派生属性或无法计算时抛错。
  async computeDerived(
    apiName: string,
    propApiName: string,
    objectRid: string,
  ): Promise<{ value: unknown }> {
    const ot = await this.getObjectType(apiName);
    if (!ot) throw new Error(`对象类型不存在: ${apiName}`);
    const prop = ot.properties.find((p: PropertyDef) => p.apiName === propApiName);
    if (!prop) throw new Error(`属性不存在: ${propApiName}`);
    if (!prop.derived) throw new Error(`属性不是派生属性: ${propApiName}`);
    const spec: DerivedSpec | null = parseDerivedSpec(prop.reducer);
    if (!spec) throw new Error(`派生属性缺少 reducer 配置: ${propApiName}`);

    if (spec.op === 'countLinks') {
      if (!spec.linkType) throw new Error('countLinks 缺少 linkType');
      const col = spec.side === 'source' ? 'source_rid' : 'target_rid';
      const { rows } = await this.pool.query(
        `SELECT count(*)::int AS n FROM link_instance WHERE link_type=$1 AND ${col}=$2`,
        [spec.linkType, objectRid],
      );
      return { value: rows[0].n };
    }
    if (spec.op === 'expression') {
      // 第一期不执行表达式，返回配置本身以供展示
      return { value: spec.expr ?? null };
    }
    if (spec.op === 'avgLinks') {
      if (!spec.linkType) throw new Error('avgLinks 缺少 linkType');
      if (!spec.prop) throw new Error('avgLinks 缺少 prop（对端对象上求平均的属性 apiName）');
      const lt = await this.getLinkType(spec.linkType);
      if (!lt) throw new Error(`关系类型不存在: ${spec.linkType}`);
      // side 指定「本对象」在关系中的角色；对端为另一端的对象类型
      const mySide = spec.side ?? 'source';
      const col = mySide === 'source' ? 'source_rid' : 'target_rid';
      const otherType = mySide === 'source' ? lt.targetType : lt.sourceType;
      const { rows } = await this.pool.query(
        `SELECT COALESCE(AVG(CAST(o.patch->>$2 AS numeric)), 0)::float AS v
           FROM link_instance li
           JOIN object_write o
             ON o.object_type = $5
            AND o.object_rid = CASE WHEN $3='source' THEN li.target_rid ELSE li.source_rid END
          WHERE li.link_type=$1 AND ${col}=$4`,
        [spec.linkType, spec.prop, spec.side ?? 'source', objectRid, otherType],
      );
      return { value: rows[0].v ?? 0 };
    }
    throw new Error(`不支持的派生算子: ${spec.op}`);
  }

  async writeObjectPatch(objectType: string, objectRid: string, patch: unknown, actor: string): Promise<void> {
    // 每实例一行：存在则合并 patch（修改单个属性不覆盖其他属性），不存在则插入。
    await this.pool.query(
      `INSERT INTO object_write (object_type, object_rid, patch, actor) VALUES ($1,$2,$3,$4)
       ON CONFLICT (object_type, object_rid)
       DO UPDATE SET patch = object_write.patch || EXCLUDED.patch, actor = EXCLUDED.actor`,
      [objectType, objectRid, JSON.stringify(patch), actor],
    );
  }

  async clearObjectWrites(objectType: string): Promise<void> {
    await this.pool.query(`DELETE FROM object_write WHERE object_type = $1`, [objectType]);
  }

  async clearLinkInstances(linkType: string): Promise<void> {
    await this.pool.query(`DELETE FROM link_instance WHERE link_type = $1`, [linkType]);
  }

  async listObjectProperties(
    objectType: string,
  ): Promise<{ objectRid: string; properties: Record<string, unknown> }[]> {
    // 取每个 object_rid 最新一次写入的 patch 作为该实例当前属性
    const { rows } = await this.pool.query(
      `SELECT DISTINCT ON (object_rid) object_rid, patch
         FROM object_write
        WHERE object_type = $1
        ORDER BY object_rid, id DESC`,
      [objectType],
    );
    return rows.map((r: any) => ({ objectRid: r.object_rid, properties: r.patch ?? {} }));
  }

  async listInterfaces(): Promise<InterfaceDef[]> {
    const { rows } = await this.pool.query(`SELECT * FROM interface_def ORDER BY api_name`);
    return rows.map((r: any) => ({
      apiName: r.api_name,
      displayName: r.display_name,
      properties: r.properties,
      methods: r.methods ?? [],
      version: r.version,
    }));
  }

  async setObjectInterface(objectApi: string, interfaceApi: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO object_interface (object_api_name, interface_api_name) VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [objectApi, interfaceApi],
    );
  }

  async bindInterfaceMethod(
    objectApi: string,
    interfaceApi: string,
    methodApi: string,
    functionApi: string,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO interface_method_impl
         (object_api_name, interface_api_name, method_api_name, function_api_name)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (object_api_name, interface_api_name, method_api_name)
       DO UPDATE SET function_api_name = EXCLUDED.function_api_name`,
      [objectApi, interfaceApi, methodApi, functionApi],
    );
  }

  async resolveInterfaceMethod(objectApi: string, interfaceApi: string, methodApi: string): Promise<string | null> {
    const { rows } = await this.pool.query(
      `SELECT function_api_name FROM interface_method_impl
       WHERE object_api_name = $1 AND interface_api_name = $2 AND method_api_name = $3`,
      [objectApi, interfaceApi, methodApi],
    );
    return rows.length ? rows[0].function_api_name : null;
  }

  async getObjectsImplementing(interfaceApi: string): Promise<string[]> {
    const { rows } = await this.pool.query(
      `SELECT object_api_name FROM object_interface WHERE interface_api_name = $1`,
      [interfaceApi],
    );
    return rows.map((r: any) => r.object_api_name);
  }

  async createAction(def: ActionType): Promise<void> {
    await this.pool.query(
      `INSERT INTO action_type (api_name, display_name, parameters, validation_rules, effect, version)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, JSON.stringify(def.parameters), JSON.stringify(def.validationRules), JSON.stringify(def.effect), def.version],
    );
  }

  async createFunction(def: OntologyFunction): Promise<void> {
    await this.pool.query(
      `INSERT INTO ontology_function (api_name, display_name, language, entry, inputs, outputs, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, def.language, def.entry, JSON.stringify(def.inputs), JSON.stringify(def.outputs), def.version],
    );
  }

  async getFunction(apiName: string): Promise<OntologyFunction | null> {
    const { rows } = await this.pool.query(`SELECT * FROM ontology_function WHERE api_name = $1`, [apiName]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      apiName: r.api_name,
      displayName: r.display_name ?? r.api_name,
      language: r.language,
      entry: r.entry,
      inputs: r.inputs,
      outputs: r.outputs,
      version: r.version,
    };
  }

  async getAction(apiName: string): Promise<ActionType | null> {
    const { rows } = await this.pool.query(`SELECT * FROM action_type WHERE api_name = $1`, [apiName]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      apiName: r.api_name,
      displayName: r.display_name ?? r.api_name,
      kind: r.kind,
      parameters: r.parameters,
      validationRules: r.validation_rules,
      effect: r.effect,
      version: r.version,
    };
  }

  async createAlertRule(def: AlertRule): Promise<void> {
    await this.pool.query(
      `INSERT INTO alert_rule
        (api_name, display_name, enabled, interval_seconds, function_api_name, action_api_name, params, alert_object_type, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, def.enabled, def.intervalSeconds, def.functionApiName,
        def.actionApiName, JSON.stringify(def.params ?? {}), def.alertObjectType, def.version],
    );
  }

  async listAlertRules(): Promise<AlertRule[]> {
    const { rows } = await this.pool.query(`SELECT * FROM alert_rule ORDER BY api_name`);
    return rows.map((r: any) => ({
      apiName: r.api_name,
      displayName: r.display_name,
      enabled: r.enabled,
      intervalSeconds: r.interval_seconds,
      functionApiName: r.function_api_name,
      actionApiName: r.action_api_name,
      params: r.params,
      alertObjectType: r.alert_object_type,
      version: r.version,
    }));
  }
}
