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
}
