// S2 Ontology 内核 — PostgreSQL 实现的 MetadataRepository（邻接表表达图拓扑）
// 统一存储决策见 docs/S0-storage-design.md。真实连接 PostgreSQL（统一单库）。

import {
  MetadataRepository,
  ObjectType,
  LinkType,
  InterfaceDef,
  ActionType,
  OntologyFunction,
} from './types';
import { Pool } from 'pg';

export class PostgresMetadataRepository implements MetadataRepository {
  constructor(private pool: Pool) {}

  async listObjectTypes(): Promise<ObjectType[]> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, version, created_at, updated_at,
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
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getObjectType(apiName: string): Promise<ObjectType | null> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, version, created_at, updated_at,
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
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async createObjectType(def: ObjectType): Promise<void> {
    await this.pool.query(
      `INSERT INTO object_type (api_name, display_name, description, properties, version, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,now(),now())
       ON CONFLICT (api_name) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         description = EXCLUDED.description,
         properties = EXCLUDED.properties,
         version = EXCLUDED.version,
         updated_at = now()`,
      [def.apiName, def.displayName, def.description ?? null, JSON.stringify(def.properties), def.version],
    );
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

  async writeObjectPatch(objectType: string, objectRid: string, patch: unknown, actor: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO object_write (object_type, object_rid, patch, actor) VALUES ($1,$2,$3,$4)`,
      [objectType, objectRid, JSON.stringify(patch), actor],
    );
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
}
