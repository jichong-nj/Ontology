// S1 数据接入与映射 — PostgreSQL 存储实现（映射配置持久化，源端始终只读）
import { Pool } from 'pg';
import type { SourceConnection, ObjectMapping } from './mapping-model';

export class PostgresMappingStore {
  constructor(private pool: Pool) {}

  async createSourceConnection(c: SourceConnection): Promise<void> {
    await this.pool.query(
      `INSERT INTO source_connection
         (id, display_name, kind, read_only, connection_meta, secret_ref, status, created_at, updated_at)
       VALUES ($1,$2,$3,TRUE,$4,$5,$6,now(),now())
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.displayName, c.kind, JSON.stringify(c.connectionMeta), c.secretRef, c.status],
    );
  }

  async listSourceConnections(): Promise<SourceConnection[]> {
    const { rows } = await this.pool.query(`SELECT * FROM source_connection ORDER BY id`);
    return rows.map((r: any) => ({
      id: r.id,
      displayName: r.display_name,
      kind: r.kind,
      readOnly: true,
      connectionMeta: r.connection_meta,
      secretRef: r.secret_ref,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getSourceConnection(id: string): Promise<SourceConnection | null> {
    const { rows } = await this.pool.query(`SELECT * FROM source_connection WHERE id=$1`, [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      displayName: r.display_name,
      kind: r.kind,
      readOnly: true,
      connectionMeta: r.connection_meta,
      secretRef: r.secret_ref,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async createObjectMapping(m: ObjectMapping): Promise<void> {
    await this.pool.query(
      `INSERT INTO object_mapping
         (id, object_type, source_connection_id, source_table, field_mappings, incremental_meta, quality_status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
       ON CONFLICT (id) DO NOTHING`,
      [
        m.id,
        m.objectType,
        m.sourceConnectionId,
        m.sourceTable,
        JSON.stringify(m.fieldMappings),
        JSON.stringify(m.incrementalMeta),
        m.qualityStatus,
      ],
    );
  }

  async listObjectMappings(): Promise<ObjectMapping[]> {
    const { rows } = await this.pool.query(`SELECT * FROM object_mapping ORDER BY id`);
    return rows.map((r: any) => ({
      id: r.id,
      objectType: r.object_type,
      sourceConnectionId: r.source_connection_id,
      sourceTable: r.source_table,
      fieldMappings: r.field_mappings,
      incrementalMeta: r.incremental_meta,
      qualityStatus: r.quality_status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async updateQualityStatus(id: string, status: ObjectMapping['qualityStatus']): Promise<void> {
    await this.pool.query(
      `UPDATE object_mapping SET quality_status = $2, updated_at = now() WHERE id = $1`,
      [id, status],
    );
  }

  async getMapping(id: string): Promise<ObjectMapping | null> {
    const { rows } = await this.pool.query(
      `SELECT id, object_type, source_connection_id, source_table, field_mappings,
              incremental_meta, quality_status, created_at, updated_at
       FROM object_mapping WHERE id = $1`,
      [id],
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      objectType: r.object_type,
      sourceConnectionId: r.source_connection_id,
      sourceTable: r.source_table,
      fieldMappings: r.field_mappings ?? [],
      incrementalMeta: r.incremental_meta ?? { syncMode: 'full' },
      qualityStatus: r.quality_status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async updateObjectMapping(m: ObjectMapping): Promise<void> {
    await this.pool.query(
      `UPDATE object_mapping
         SET object_type=$2, source_connection_id=$3, source_table=$4,
             field_mappings=$5, incremental_meta=$6, updated_at=now()
       WHERE id=$1`,
      [
        m.id,
        m.objectType,
        m.sourceConnectionId,
        m.sourceTable,
        JSON.stringify(m.fieldMappings),
        JSON.stringify(m.incrementalMeta),
      ],
    );
  }

  async deleteObjectMapping(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM object_mapping WHERE id=$1`, [id]);
  }

  async deleteObjectMappingsByType(objectType: string): Promise<void> {
    await this.pool.query(`DELETE FROM object_mapping WHERE object_type=$1`, [objectType]);
  }

  // ---------- 源表字段探测 ----------
  // 连接只读源库，列出所有表及字段信息（前端创建对象类型时选表/映射字段用）。
  // 凭据演示从 connectionMeta 取；生产应走 secretRef，且始终只读。
  async probeSourceTables(conn: SourceConnection): Promise<
    { table: string; columns: { name: string; dataType: string; isNullable: boolean; isPrimaryKey: boolean }[] }[]
  > {
    const meta = (conn.connectionMeta as Record<string, any>) || {};
    const url =
      `postgresql://${meta.user || 'ontology'}:${meta.password || 'ontology'}` +
      `@${meta.host || 'localhost'}:${meta.port || 5432}/${meta.database}`;
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows: tbls } = await srcPool.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`,
      );
      const result: { table: string; columns: { name: string; dataType: string; isNullable: boolean; isPrimaryKey: boolean }[] }[] = [];
      for (const t of tbls) {
        const { rows: cols } = await srcPool.query(
          `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns
           WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`,
          [t.table_name],
        );
        const { rows: pk } = await srcPool.query(
          `SELECT a.attname AS col
           FROM pg_index i JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attnum=ANY(i.indkey)
           WHERE i.indrelid=($1::text)::regclass AND i.indisprimary`,
          [t.table_name],
        );
        const pkSet = new Set(pk.map((r: any) => r.col));
        result.push({
          table: t.table_name,
          columns: cols.map((c: any) => ({
            name: c.column_name,
            dataType: c.data_type,
            isNullable: c.is_nullable === 'YES',
            isPrimaryKey: pkSet.has(c.column_name),
          })),
        });
      }
      return result;
    } finally {
      await srcPool.end();
    }
  }
}
