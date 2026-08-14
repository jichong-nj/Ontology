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
  SharedProperty,
  DerivedSpec,
  parseDerivedSpec,
  AutomationRule,
  AIPAgentConfig,
  AIPProvider,
  AIPModel,
  FunctionSandbox,
} from './types';
import { Pool } from 'pg';

export class PostgresMetadataRepository implements MetadataRepository {
  constructor(private pool: Pool) {}

  async listObjectTypes(): Promise<ObjectType[]> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, source_connection_id, source_table, title_property,
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
      titleProperty: r.title_property ?? undefined,
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getObjectType(apiName: string): Promise<ObjectType | null> {
    const { rows } = await this.pool.query(
      `SELECT api_name, display_name, description, properties, source_connection_id, source_table, title_property,
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
      titleProperty: r.title_property ?? undefined,
      version: r.version,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async createObjectType(def: ObjectType): Promise<void> {
    // version 是 NOT NULL 字段，调用方（前端/API）可能未传，缺省为 1
    const version = def.version ?? 1;
    await this.pool.query(
      `INSERT INTO object_type (api_name, display_name, description, properties, source_connection_id, source_table, title_property, version, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
       ON CONFLICT (api_name) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         description = EXCLUDED.description,
         properties = EXCLUDED.properties,
         source_connection_id = EXCLUDED.source_connection_id,
         source_table = EXCLUDED.source_table,
         title_property = EXCLUDED.title_property,
         version = EXCLUDED.version,
         updated_at = now()`,
      [def.apiName, def.displayName, def.description ?? null, JSON.stringify(def.properties),
       def.sourceConnectionId ?? null, def.sourceTable ?? null, def.titleProperty ?? null, version],
    );
  }

  async updateObjectType(apiName: string, def: ObjectType): Promise<void> {
    // version 是 NOT NULL 字段，调用方（前端/API）可能未传，缺省为 1
    const version = def.version ?? 1;
    await this.pool.query(
      `UPDATE object_type
         SET display_name=$2, description=$3, properties=$4, source_connection_id=$5, source_table=$6, title_property=$7, version=$8, updated_at=now()
       WHERE api_name=$1`,
      [apiName, def.displayName, def.description ?? null, JSON.stringify(def.properties),
       def.sourceConnectionId ?? null, def.sourceTable ?? null, def.titleProperty ?? null, version],
    );
  }

  async deleteObjectType(apiName: string): Promise<void> {
    // 级联清理：删除对象类型前，先清掉引用它的关系类型与接口绑定
    await this.pool.query(`DELETE FROM link_type WHERE source_type=$1 OR target_type=$1`, [apiName]);
    await this.pool.query(`DELETE FROM object_interface WHERE object_api_name=$1`, [apiName]);
    await this.pool.query(`DELETE FROM object_type WHERE api_name=$1`, [apiName]);
  }

  // ---------- 共享属性 ----------
  async listSharedProperties(): Promise<SharedProperty[]> {
    const { rows } = await this.pool.query(`SELECT * FROM shared_property ORDER BY api_name`);
    return rows.map(rowToSharedProperty);
  }

  async getSharedProperty(apiName: string): Promise<SharedProperty | null> {
    const { rows } = await this.pool.query(`SELECT * FROM shared_property WHERE api_name=$1`, [apiName]);
    return rows[0] ? rowToSharedProperty(rows[0]) : null;
  }

  async createSharedProperty(def: SharedProperty): Promise<void> {
    await this.pool.query(
      `INSERT INTO shared_property (api_name, display_name, type, description, version, created_at, updated_at)
       VALUES ($1,$2,$3,$4,1,now(),now())`,
      [def.apiName, def.displayName, def.type, def.description ?? null],
    );
  }

  async updateSharedProperty(apiName: string, patch: Partial<SharedProperty>): Promise<void> {
    const cur = await this.getSharedProperty(apiName);
    if (!cur) throw new Error(`SharedProperty not found: ${apiName}`);
    const next: SharedProperty = {
      ...cur,
      ...patch,
      apiName: cur.apiName, // 主键不可变
      version: cur.version + 1,
      updatedAt: new Date().toISOString(),
    };
    await this.pool.query(
      `UPDATE shared_property SET display_name=$2, type=$3, description=$4, version=$5, updated_at=now() WHERE api_name=$1`,
      [next.apiName, next.displayName, next.type, next.description ?? null, next.version],
    );
    // 编辑一处，回写所有引用方的共享元数据字段（displayName/type/description）。
    // 注意：required 由引用方自行配置，共享侧编辑不覆盖。
    await this.propagateSharedEdit(apiName);
  }

  async deleteSharedProperty(apiName: string): Promise<void> {
    // 解绑所有对象类型的共享引用（不删除对象类型本身）
    const ots = await this.listObjectTypes();
    for (const ot of ots) {
      const dirty = ot.properties.filter((p) => p.sharedRef === apiName);
      if (dirty.length === 0) continue;
      for (const p of ot.properties) {
        if (p.sharedRef === apiName) {
          p.sharedRef = undefined;
          p.overridden = false;
        }
      }
      await this.updateObjectType(ot.apiName, ot);
    }
    await this.pool.query(`DELETE FROM shared_property WHERE api_name=$1`, [apiName]);
  }

  // 编辑共享属性后，把所有引用方未覆盖的字段同步为最新共享基准
  private async propagateSharedEdit(sharedApiName: string): Promise<void> {
    const sp = await this.getSharedProperty(sharedApiName);
    if (!sp) return;
    const ots = await this.listObjectTypes();
    for (const ot of ots) {
      let changed = false;
      for (const p of ot.properties) {
        if (p.sharedRef === sharedApiName && !p.overridden) {
          p.displayName = sp.displayName;
          p.type = sp.type;
          changed = true;
        }
      }
      if (changed) await this.updateObjectType(ot.apiName, ot);
    }
  }

  // 把对象类型内嵌属性"提升"为共享属性：创建共享定义 + 把该属性改挂为引用
  async convertPropertyToShared(objectType: string, propApiName: string): Promise<void> {
    const ot = await this.getObjectType(objectType);
    if (!ot) throw new Error(`ObjectType not found: ${objectType}`);
    const prop = ot.properties.find((p) => p.apiName === propApiName);
    if (!prop) throw new Error(`Property not found: ${objectType}.${propApiName}`);
    if (prop.derived) throw new Error(`派生属性不可提升为共享属性: ${propApiName}`);
    if (prop.sharedRef) throw new Error(`属性已引用共享属性: ${propApiName}`);
    if (!(await this.getSharedProperty(propApiName))) {
      await this.createSharedProperty({
        apiName: propApiName,
        displayName: prop.displayName,
        type: prop.type,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    prop.sharedRef = propApiName;
    prop.overridden = false;
    await this.updateObjectType(objectType, ot);
  }

  // 在某对象类型上应用共享属性（引用）。
  // 引用方自决 required（默认 false），共享侧不再携带 required；仅 displayName 可覆盖。
  async applySharedToObjectType(sharedApiName: string, objectType: string, override?: { displayName?: string; required?: boolean }): Promise<void> {
    const sp = await this.getSharedProperty(sharedApiName);
    if (!sp) throw new Error(`SharedProperty not found: ${sharedApiName}`);
    const ot = await this.getObjectType(objectType);
    if (!ot) throw new Error(`ObjectType not found: ${objectType}`);
    if (ot.properties.some((p) => p.apiName === sharedApiName)) {
      throw new Error(`对象类型已含同名属性: ${sharedApiName}`);
    }
    const overridden = !!(override && override.displayName !== undefined);
    ot.properties.push({
      apiName: sp.apiName,
      displayName: override?.displayName ?? sp.displayName,
      type: sp.type,
      required: override?.required ?? false,
      sharedRef: sp.apiName,
      overridden,
    });
    await this.updateObjectType(objectType, ot);
  }

  async getExploreConfig(apiName: string): Promise<{ apiName: string; kind: string }[]> {
    const { rows } = await this.pool.query(
      `SELECT COALESCE(explore_config->'charts', '[]'::jsonb) AS charts FROM object_type WHERE api_name=$1`,
      [apiName],
    );
    if (rows.length === 0) return [];
    const charts = rows[0].charts;
    if (!Array.isArray(charts)) return [];
    // 兼容旧数据：纯字符串 -> {apiName, kind:'bar'}
    return charts.map((c: any) =>
      typeof c === 'string'
        ? { apiName: c, kind: 'bar' }
        : { apiName: String(c.apiName), kind: c.kind || 'bar' },
    );
  }

  async saveExploreConfig(apiName: string, charts: { apiName: string; kind: string }[]): Promise<void> {
    // 规范化，保证存的是 [{apiName, kind}]
    const norm = (Array.isArray(charts) ? charts : []).map((c: any) => ({
      apiName: String(c.apiName),
      kind: c.kind || 'bar',
    }));
    await this.pool.query(
      `UPDATE object_type SET explore_config = jsonb_build_object('charts', $2::jsonb), updated_at = now() WHERE api_name=$1`,
      [apiName, JSON.stringify(norm)],
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
      sourceCardinality: r.source_cardinality || 'one',
      targetCardinality: r.target_cardinality || 'many',
      primaryKey: r.primary_key || undefined,
      foreignKey: r.foreign_key || undefined,
      pluralName: r.plural_name || undefined,
      visibility: r.visibility || 'Normal',
      instanceSource: r.instance_source,
      version: r.version,
    }));
  }

  async deleteLinkType(apiName: string): Promise<void> {
    // 级联清理：先删除该关系类型下的所有关系实例，再删除类型本身
    await this.pool.query(`DELETE FROM link_instance WHERE link_type=$1`, [apiName]);
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
      sourceCardinality: r.source_cardinality || 'one',
      targetCardinality: r.target_cardinality || 'many',
      primaryKey: r.primary_key || undefined,
      foreignKey: r.foreign_key || undefined,
      pluralName: r.plural_name || undefined,
      visibility: r.visibility || 'Normal',
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

  async updateLinkType(apiName: string, patch: Partial<LinkType>): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;
    if (patch.displayName !== undefined) { sets.push(`display_name=$${i++}`); values.push(patch.displayName); }
    if (patch.sourceType !== undefined) { sets.push(`source_type=$${i++}`); values.push(patch.sourceType); }
    if (patch.targetType !== undefined) { sets.push(`target_type=$${i++}`); values.push(patch.targetType); }
    if (patch.sourceCardinality !== undefined) { sets.push(`source_cardinality=$${i++}`); values.push(patch.sourceCardinality); }
    if (patch.targetCardinality !== undefined) { sets.push(`target_cardinality=$${i++}`); values.push(patch.targetCardinality); }
    if (patch.primaryKey !== undefined) { sets.push(`primary_key=$${i++}`); values.push(patch.primaryKey); }
    if (patch.foreignKey !== undefined) { sets.push(`foreign_key=$${i++}`); values.push(patch.foreignKey); }
    if (patch.pluralName !== undefined) { sets.push(`plural_name=$${i++}`); values.push(patch.pluralName); }
    if (patch.visibility !== undefined) { sets.push(`visibility=$${i++}`); values.push(patch.visibility); }
    if (patch.instanceSource !== undefined) { sets.push(`instance_source=$${i++}`); values.push(patch.instanceSource); }
    if (sets.length === 0) return;
    values.push(apiName);
    await this.pool.query(`UPDATE link_type SET ${sets.join(',')} WHERE api_name=$${i}`, values);
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
    sandbox?: FunctionSandbox,
  ): Promise<{ value: unknown }> {
    const ot = await this.getObjectType(apiName);
    if (!ot) throw new Error(`对象类型不存在: ${apiName}`);
    const prop = ot.properties.find((p: PropertyDef) => p.apiName === propApiName);
    if (!prop) throw new Error(`属性不存在: ${propApiName}`);
    if (!prop.derived) throw new Error(`属性不是派生属性: ${propApiName}`);

    // reducerFn 模式：调用已注册函数（运行时上下文注入 objectRid 与对象类型）
    if (prop.reducerFn) {
      if (!sandbox) throw new Error('派生属性引用函数，但缺少运行时沙箱上下文');
      const fn = await this.getFunction(prop.reducerFn);
      if (!fn) throw new Error(`引用的函数未注册: ${prop.reducerFn}`);
      const result = await sandbox.execute(prop.reducerFn, { objectType: apiName, objectRid, property: propApiName });
      return { value: result };
    }

    const spec: DerivedSpec | null = parseDerivedSpec(prop.reducer);
    if (!spec) throw new Error(`派生属性缺少 reducer 配置: ${propApiName}`);

    if (spec.op === 'countLinks') {
      if (!spec.linkType) throw new Error('countLinks 缺少 linkType');
      const mySide = spec.side ?? 'target';
      const col = mySide === 'source' ? 'source_rid' : 'target_rid';
      // distinct: 按对端对象去重计数（Exact cardinality）
      const sql = spec.distinct
        ? `SELECT COUNT(DISTINCT ${mySide === 'source' ? 'target_rid' : 'source_rid'})::int AS n FROM link_instance WHERE link_type=$1 AND ${col}=$2`
        : `SELECT count(*)::int AS n FROM link_instance WHERE link_type=$1 AND ${col}=$2`;
      const { rows } = await this.pool.query(sql, [spec.linkType, objectRid]);
      return { value: rows[0].n };
    }
    if (spec.op === 'expression') {
      // 第一期不执行表达式，返回配置本身以供展示
      return { value: spec.expr ?? null };
    }
    // avg / sum / min / max / collect 共用「对端属性聚合」逻辑
    if (['avgLinks', 'sumLinks', 'minLinks', 'maxLinks', 'collectLinks'].includes(spec.op)) {
      if (!spec.linkType) throw new Error(`${spec.op} 缺少 linkType`);
      if (!spec.prop) throw new Error(`${spec.op} 缺少 prop（对端对象上聚合的属性 apiName）`);
      const lt = await this.getLinkType(spec.linkType);
      if (!lt) throw new Error(`关系类型不存在: ${spec.linkType}`);
      const mySide = spec.side ?? 'source';
      const col = mySide === 'source' ? 'source_rid' : 'target_rid';
      const otherType = mySide === 'source' ? lt.targetType : lt.sourceType;
      const otherCol = mySide === 'source' ? 'target_rid' : 'source_rid'; // 对端 rid 列

      if (spec.op === 'collectLinks') {
        // 收集对端属性为数组（列表或去重集合）；single: 仅取第一个非空的标量（单链接取标量）
        let sql = `SELECT o.patch->>$2 AS v
                     FROM link_instance li
                     JOIN object_write o
                       ON o.object_type = $4
                      AND o.object_rid = li.${otherCol}
                    WHERE li.link_type=$1 AND ${col}=$3`;
        if (spec.single) {
          // single 模式：取唯一/首个对端对象（按 rid 排序保证可复现），返回其属性标量
          sql += ` ORDER BY li.${otherCol} LIMIT 1`;
        } else {
          if (spec.asSet) sql += ' GROUP BY o.patch->>$2';
          if (spec.limit && spec.limit > 0) sql += ` LIMIT ${Number(spec.limit)}`;
        }
        const { rows } = await this.pool.query(sql, [spec.linkType, spec.prop, objectRid, otherType]);
        if (spec.single) {
          const v = rows.length ? rows[0].v : null;
          return { value: v === '' ? null : v };
        }
        const vals = rows.map((r) => r.v).filter((v) => v !== null && v !== undefined && v !== '');
        return { value: spec.asSet ? Array.from(new Set(vals)) : vals };
      }

      const agg = spec.op === 'avgLinks' ? 'AVG'
        : spec.op === 'sumLinks' ? 'SUM'
        : spec.op === 'minLinks' ? 'MIN'
        : 'MAX';
      const { rows } = await this.pool.query(
        `SELECT COALESCE(${agg}(CAST(o.patch->>$2 AS numeric)), 0)::float AS v
           FROM link_instance li
           JOIN object_write o
             ON o.object_type = $4
            AND o.object_rid = li.${otherCol}
          WHERE li.link_type=$1 AND ${col}=$3`,
        [spec.linkType, spec.prop, objectRid, otherType],
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

  /**
   * 实例查询（对齐 Palantir 思路）：支持属性级条件过滤 + 游标分页。
   * - filter: 属性过滤条件列表（AND 组合），operator 支持 eq/neq/gt/gte/lt/lte/contains/isNull
   * - pageSize: 每页条数（默认 100，上限 1000）
   * - pageToken: 上一页返回的 nextPageToken（按 object_rid 游标），为空取首页
   * 返回 { data, nextPageToken }，nextPageToken 为 null 表示末页。
   * 安全性：property 名经白名单过滤（仅保留字母数字下划线），值全部参数化。
   */
  async listInstances(
    objectType: string,
    opts?: {
      filter?: InstanceFilter[];
      pageSize?: number;
      pageToken?: string;
    },
  ): Promise<{ data: { objectRid: string; properties: Record<string, unknown> }[]; nextPageToken: string | null }> {
    const pageSize = Math.min(Math.max(opts?.pageSize ?? 100, 1), 1000);
    const filter = opts?.filter ?? [];
    const params: unknown[] = [objectType];
    const wheres: string[] = ['object_type = $1'];

    filter.forEach((f) => {
      const col = f.property.replace(/[^A-Za-z0-9_]/g, '');
      if (!col) return;
      if (f.operator === 'isNull') {
        wheres.push(`patch->>'${col}' IS ${f.value ? 'NOT ' : ''}NULL`);
        return;
      }
      const ph = `$${params.length + 1}`;
      params.push(String(f.value));
      switch (f.operator) {
        case 'eq':
          wheres.push(`patch->>'${col}' = ${ph}`);
          break;
        case 'neq':
          wheres.push(`patch->>'${col}' <> ${ph}`);
          break;
        case 'gt':
          wheres.push(`(CASE WHEN patch->>'${col}' ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN (patch->>'${col}')::numeric END) > (${ph})::numeric`);
          break;
        case 'gte':
          wheres.push(`(CASE WHEN patch->>'${col}' ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN (patch->>'${col}')::numeric END) >= (${ph})::numeric`);
          break;
        case 'lt':
          wheres.push(`(CASE WHEN patch->>'${col}' ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN (patch->>'${col}')::numeric END) < (${ph})::numeric`);
          break;
        case 'lte':
          wheres.push(`(CASE WHEN patch->>'${col}' ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN (patch->>'${col}')::numeric END) <= (${ph})::numeric`);
          break;
        case 'contains':
          wheres.push(`patch->>'${col}' LIKE ${ph}`);
          params[params.length - 1] = `%${String(f.value)}%`;
          break;
        default:
          break;
      }
    });

    if (opts?.pageToken) {
      params.push(opts.pageToken);
      wheres.push(`object_rid > $${params.length}`);
    }

    // 多取 1 条判断是否还有下一页（游标式，避免 OFFSET 深翻页与快照一致性问题）
    params.push(pageSize + 1);
    const { rows } = await this.pool.query(
      `SELECT object_rid, patch
         FROM (SELECT DISTINCT ON (object_rid) object_rid, patch
                 FROM object_write
                WHERE ${wheres.join(' AND ')}
                ORDER BY object_rid, id DESC) t
        ORDER BY object_rid
        LIMIT $${params.length}`,
      params,
    );

    const hasMore = rows.length > pageSize;
    const page = rows.slice(0, pageSize).map((r: any) => ({
      objectRid: r.object_rid,
      properties: r.patch ?? {},
    }));
    const nextPageToken = hasMore && page.length > 0 ? page[page.length - 1].objectRid : null;
    return { data: page, nextPageToken };
  }

  /**
   * 判断某对象类型的某属性是否为派生属性。
   */
  private async isDerivedProp(objectType: string, property: string): Promise<boolean> {
    const ot = await this.getObjectType(objectType);
    if (!ot) return false;
    const prop = ot.properties.find((p: PropertyDef) => p.apiName === property);
    return !!prop?.derived;
  }

  /**
   * 逐实例计算派生属性值，返回 [value, ...]。用于图表聚合（histogram/aggregate）时
   * 派生属性不落库、需实时计算的场景。
   * reducerFn 模式依赖沙箱，此处不传沙箱，仅支持结构化算子（countLinks 等无需沙箱的算子）。
   */
  private async collectDerivedValues(objectType: string, property: string): Promise<unknown[]> {
    const { rows } = await this.pool.query(
      `SELECT DISTINCT object_rid FROM object_write WHERE object_type = $1 ORDER BY object_rid`,
      [objectType],
    );
    const values: unknown[] = [];
    for (const r of rows) {
      try {
        const { value } = await this.computeDerived(objectType, property, r.object_rid);
        values.push(value);
      } catch {
        // 单个实例计算失败忽略（如缺配置）
      }
    }
    return values;
  }

  /**
   * 按属性分组计数（用于分类属性的条形图）。
   * 取每个实例最新 patch 中的属性值，GROUP BY 计数。
   * 若属性为派生属性，则实时计算各实例派生值后再聚合。
   */
  async aggregateByProperty(
    objectType: string,
    property: string,
    topN = 20,
  ): Promise<{ key: string; count: number }[]> {
    if (await this.isDerivedProp(objectType, property)) {
      const vals = await this.collectDerivedValues(objectType, property);
      const map = new Map<string, number>();
      for (const v of vals) {
        if (v == null) continue;
        const k = String(v);
        map.set(k, (map.get(k) ?? 0) + 1);
      }
      return [...map.entries()]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
    }
    const col = property.replace(/[^A-Za-z0-9_]/g, '');
    const { rows } = await this.pool.query(
      `SELECT (patch->>$1) AS k, count(*)::int AS n
         FROM (SELECT DISTINCT ON (object_rid) patch
                 FROM object_write WHERE object_type = $2
                ORDER BY object_rid, id DESC) t
        WHERE patch->>$1 IS NOT NULL
        GROUP BY k
        ORDER BY n DESC
        LIMIT $3`,
      [col, objectType, topN],
    );
    return rows.map((r: any) => ({ key: r.k ?? '(空)', count: r.n }));
  }

  /**
   * 数值属性的直方图分桶（用于数值属性的分布图）。
   * 自动计算 min/max，按 bucketCount 等分。
   * 若属性为派生属性，则实时计算各实例派生值后再分桶。
   */
  async histogramByProperty(
    objectType: string,
    property: string,
    bucketCount = 20,
  ): Promise<{ bucket: number; min: number; max: number; count: number }[]> {
    let values: number[] = [];
    if (await this.isDerivedProp(objectType, property)) {
      const raw = await this.collectDerivedValues(objectType, property);
      values = raw.filter((v): v is number => typeof v === 'number' && isFinite(v));
    }
    if (values.length > 0) {
      const mn = Math.min(...values);
      const mx = Math.max(...values);
      if (!isFinite(mn) || !isFinite(mx) || mn === mx) {
        return [{ bucket: 0, min: mn, max: mx, count: values.length }];
      }
      const width = (mx - mn) / bucketCount;
      const buckets: { bucket: number; min: number; max: number; count: number }[] = [];
      for (let i = 0; i < bucketCount; i++) {
        const bMin = mn + i * width;
        const bMax = mn + (i + 1) * width;
        const cnt = values.filter((v) =>
          v >= bMin && (i === bucketCount - 1 ? v <= bMax : v < bMax),
        ).length;
        buckets.push({ bucket: i, min: bMin, max: bMax, count: cnt });
      }
      return buckets;
    }
    const col = property.replace(/[^A-Za-z0-9_]/g, '');
    const { rows: ext } = await this.pool.query(
      `SELECT min((patch->>$1)::numeric) AS mn, max((patch->>$1)::numeric) AS mx
         FROM (SELECT DISTINCT ON (object_rid) patch
                 FROM object_write WHERE object_type = $2
                ORDER BY object_rid, id DESC) t
        WHERE patch->>$1 IS NOT NULL`,
      [col, objectType],
    );
    const mn = parseFloat(ext[0]?.mn ?? '0');
    const mx = parseFloat(ext[0]?.mx ?? '0');
    if (!isFinite(mn) || !isFinite(mx) || mn === mx) {
      return [{ bucket: 0, min: mn, max: mx, count: ext[0]?.mn != null ? 1 : 0 }];
    }
    const width = (mx - mn) / bucketCount;
    const buckets: { bucket: number; min: number; max: number; count: number }[] = [];
    for (let i = 0; i < bucketCount; i++) {
      const bMin = mn + i * width;
      const bMax = mn + (i + 1) * width;
      const { rows: b } = await this.pool.query(
        `SELECT count(*)::int AS n
           FROM (SELECT DISTINCT ON (object_rid) patch
                   FROM object_write WHERE object_type = $2
                  ORDER BY object_rid, id DESC) t
          WHERE (patch->>$1)::numeric >= $3 AND (patch->>$1)::numeric < $4`,
        [col, objectType, bMin, i === bucketCount - 1 ? mx + 1 : bMax],
      );
      buckets.push({ bucket: i, min: bMin, max: bMax, count: b[0]?.n ?? 0 });
    }
    return buckets;
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
    const validationRules = def.validationRules ?? [];
    const preconditions = def.preconditions ?? [];
    await this.pool.query(
      `INSERT INTO action_type (api_name, display_name, parameters, validation_rules, preconditions, effect, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, JSON.stringify(def.parameters), JSON.stringify(validationRules), JSON.stringify(preconditions), JSON.stringify(def.effect), def.version],
    );
  }

  async updateAction(apiName: string, patch: Partial<ActionType>): Promise<void> {
    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;
    const map: Record<string, string> = {
      displayName: 'display_name', parameters: 'parameters', validationRules: 'validation_rules', preconditions: 'preconditions', effect: 'effect', version: 'version',
    };
    for (const [k, col] of Object.entries(map)) {
      if (k in patch) {
        sets.push(`${col} = $${i++}`);
        const v = (patch as any)[k];
        vals.push(
          k === 'parameters' || k === 'validationRules' || k === 'preconditions' || k === 'effect'
            ? JSON.stringify(v)
            : v,
        );
      }
    }
    if (sets.length === 0) return;
    vals.push(apiName);
    await this.pool.query(`UPDATE action_type SET ${sets.join(', ')} WHERE api_name = $${i}`, vals);
  }

  async deleteAction(apiName: string): Promise<void> {
    await this.pool.query(`DELETE FROM action_type WHERE api_name = $1`, [apiName]);
  }

  async listActions(): Promise<ActionType[]> {
    const { rows } = await this.pool.query(`SELECT * FROM action_type ORDER BY api_name`);
    return rows.map((r) => ({
      apiName: r.api_name,
      displayName: r.display_name ?? r.api_name,
      kind: r.kind,
      parameters: r.parameters,
      validationRules: r.validation_rules,
      preconditions: r.preconditions ?? [],
      effect: r.effect,
      version: r.version,
    }));
  }

  async createFunction(def: OntologyFunction): Promise<void> {
    await this.pool.query(
      `INSERT INTO ontology_function (api_name, display_name, language, entry, inputs, outputs, description, body, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, def.language, def.entry, JSON.stringify(def.inputs), JSON.stringify(def.outputs), def.description ?? null, def.body ?? null, def.version],
    );
  }

  async updateFunction(apiName: string, patch: Partial<OntologyFunction>): Promise<void> {
    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;
    const map: Record<string, string> = {
      displayName: 'display_name', language: 'language', entry: 'entry',
      inputs: 'inputs', outputs: 'outputs', description: 'description', body: 'body', version: 'version',
    };
    for (const [k, col] of Object.entries(map)) {
      if (k in patch) {
        sets.push(`${col} = $${i++}`);
        let v = (patch as any)[k];
        if (k === 'inputs' || k === 'outputs') v = JSON.stringify(v);
        vals.push(v);
      }
    }
    if (sets.length === 0) return;
    vals.push(apiName);
    await this.pool.query(
      `UPDATE ontology_function SET ${sets.join(', ')} WHERE api_name = $${i}`,
      vals,
    );
  }

  async deleteFunction(apiName: string): Promise<void> {
    await this.pool.query(`DELETE FROM ontology_function WHERE api_name = $1`, [apiName]);
  }

  async listFunctions(): Promise<OntologyFunction[]> {
    const { rows } = await this.pool.query(`SELECT * FROM ontology_function ORDER BY api_name`);
    return rows.map((r) => ({
      apiName: r.api_name,
      displayName: r.display_name ?? r.api_name,
      language: r.language,
      entry: r.entry,
      inputs: r.inputs,
      outputs: r.outputs,
      description: r.description ?? null,
      body: r.body,
      version: r.version,
    }));
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
      description: r.description ?? null,
      body: r.body,
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
      preconditions: r.preconditions ?? [],
      effect: r.effect,
      version: r.version,
    };
  }

  async createRule(def: AutomationRule): Promise<void> {
    await this.pool.query(
      `INSERT INTO rule
        (api_name, display_name, enabled, trigger, condition_function, action_api_name, params, target_object_type, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (api_name) DO NOTHING`,
      [def.apiName, def.displayName, def.enabled, JSON.stringify(def.trigger), def.conditionFunction,
        def.actionApiName, JSON.stringify(def.params ?? {}), def.targetObjectType, def.version],
    );
  }

  async listRules(): Promise<AutomationRule[]> {
    const { rows } = await this.pool.query(`SELECT * FROM rule ORDER BY api_name`);
    return rows.map(rowToRule);
  }

  async getRule(apiName: string): Promise<AutomationRule | null> {
    const { rows } = await this.pool.query(`SELECT * FROM rule WHERE api_name = $1`, [apiName]);
    return rows[0] ? rowToRule(rows[0]) : null;
  }

  async updateRule(apiName: string, patch: Partial<AutomationRule>): Promise<void> {
    const current = await this.getRule(apiName);
    if (!current) throw new Error(`自动化规则不存在: ${apiName}`);
    const merged: AutomationRule = {
      ...current,
      ...patch,
      apiName, // 主键不可改
      version: (current.version ?? 1) + 1,
    };
    await this.pool.query(
      `UPDATE rule SET
        display_name = $2, enabled = $3, trigger = $4,
        condition_function = $5, action_api_name = $6, params = $7,
        target_object_type = $8, version = $9
       WHERE api_name = $1`,
      [apiName, merged.displayName, merged.enabled, JSON.stringify(merged.trigger),
        merged.conditionFunction, merged.actionApiName, JSON.stringify(merged.params ?? {}),
        merged.targetObjectType, merged.version],
    );
  }

  async deleteRule(apiName: string): Promise<void> {
    await this.pool.query(`DELETE FROM rule WHERE api_name = $1`, [apiName]);
  }

  // ---------- AIP Provider / Model / Agent 三层 ----------
  async upsertAIPProvider(p: AIPProvider): Promise<void> {
    await this.pool.query(
      `INSERT INTO aip_provider (id, name, base_url, api_key, protocol, is_default, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6, now(), now())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, base_url = EXCLUDED.base_url, api_key = EXCLUDED.api_key,
         protocol = EXCLUDED.protocol, is_default = EXCLUDED.is_default, updated_at = now()`,
      [p.id, p.name, p.baseUrl, p.apiKey, p.protocol, p.isDefault ?? false],
    );
  }
  async getAIPProvider(id: string): Promise<AIPProvider | null> {
    const { rows } = await this.pool.query(`SELECT * FROM aip_provider WHERE id = $1`, [id]);
    return rows[0] ? rowToAIPProvider(rows[0]) : null;
  }
  async listAIPProviders(): Promise<AIPProvider[]> {
    const { rows } = await this.pool.query(`SELECT * FROM aip_provider ORDER BY created_at ASC`);
    return rows.map(rowToAIPProvider);
  }
  async deleteAIPProvider(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM aip_provider WHERE id = $1`, [id]);
  }

  async upsertAIPModel(m: AIPModel): Promise<void> {
    await this.pool.query(
      `INSERT INTO aip_model
        (id, provider_id, api_name, display_name, is_reasoning, context_window, max_tokens, extra, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now())
       ON CONFLICT (id) DO UPDATE SET
         provider_id = EXCLUDED.provider_id, api_name = EXCLUDED.api_name,
         display_name = EXCLUDED.display_name, is_reasoning = EXCLUDED.is_reasoning,
         context_window = EXCLUDED.context_window, max_tokens = EXCLUDED.max_tokens,
         extra = EXCLUDED.extra, updated_at = now()`,
      [m.id, m.providerId, m.apiName, m.displayName, m.isReasoning ?? false,
        m.contextWindow ?? null, m.maxTokens ?? null,
        m.extra ? JSON.stringify(m.extra) : null],
    );
  }
  async getAIPModel(id: string): Promise<AIPModel | null> {
    const { rows } = await this.pool.query(`SELECT * FROM aip_model WHERE id = $1`, [id]);
    return rows[0] ? rowToAIPModel(rows[0]) : null;
  }
  async listAIPModels(providerId?: string): Promise<AIPModel[]> {
    const { rows } = providerId
      ? await this.pool.query(`SELECT * FROM aip_model WHERE provider_id = $1 ORDER BY created_at ASC`, [providerId])
      : await this.pool.query(`SELECT * FROM aip_model ORDER BY created_at ASC`);
    return rows.map(rowToAIPModel);
  }
  async deleteAIPModel(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM aip_model WHERE id = $1`, [id]);
  }

  async upsertAIPAgentConfig(cfg: AIPAgentConfig): Promise<void> {
    await this.pool.query(
      `INSERT INTO aip_agent
        (id, display_name, system_prompt, model_scope, default_model_id, temperature, enabled_tools, max_steps, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE
       SET display_name = EXCLUDED.display_name,
           system_prompt = EXCLUDED.system_prompt,
           model_scope = EXCLUDED.model_scope,
           default_model_id = EXCLUDED.default_model_id,
           temperature = EXCLUDED.temperature,
           enabled_tools = EXCLUDED.enabled_tools,
           max_steps = EXCLUDED.max_steps,
           version = aip_agent.version + 1,
           updated_at = now()`,
      [cfg.id, cfg.displayName, cfg.systemPrompt, JSON.stringify(cfg.modelScope ?? []),
        cfg.defaultModelId, cfg.temperature, JSON.stringify(cfg.enabledTools ?? []),
        cfg.maxSteps, (cfg.version ?? 1)],
    );
  }

  async getAIPAgentConfig(id: string): Promise<AIPAgentConfig | null> {
    const { rows } = await this.pool.query(`SELECT * FROM aip_agent WHERE id = $1`, [id]);
    if (rows.length === 0) return null;
    return rowToAIPAgentConfig(rows[0]);
  }
}

function rowToAIPProvider(r: any): AIPProvider {
  return {
    id: r.id,
    name: r.name,
    baseUrl: r.base_url,
    apiKey: r.api_key,
    protocol: r.protocol,
    isDefault: r.is_default,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
function rowToAIPModel(r: any): AIPModel {
  return {
    id: r.id,
    providerId: r.provider_id,
    apiName: r.api_name,
    displayName: r.display_name,
    isReasoning: r.is_reasoning,
    contextWindow: r.context_window ?? undefined,
    maxTokens: r.max_tokens ?? undefined,
    extra: r.extra ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
function rowToAIPAgentConfig(r: any): AIPAgentConfig {
  return {
    id: r.id,
    displayName: r.display_name,
    systemPrompt: r.system_prompt,
    modelScope: r.model_scope ?? [],
    defaultModelId: r.default_model_id,
    temperature: r.temperature,
    enabledTools: r.enabled_tools ?? [],
    maxSteps: r.max_steps,
    version: r.version,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToRule(r: any): AutomationRule {
  return {
    apiName: r.api_name,
    displayName: r.display_name,
    enabled: r.enabled,
    trigger: r.trigger,
    conditionFunction: r.condition_function,
    actionApiName: r.action_api_name,
    params: r.params,
    targetObjectType: r.target_object_type,
    version: r.version,
  };
}

function rowToSharedProperty(r: any): SharedProperty {
  return {
    apiName: r.api_name,
    displayName: r.display_name,
    type: r.type,
    description: r.description ?? undefined,
    version: r.version,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
