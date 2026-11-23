// S1 数据接入与映射 — PostgreSQL 存储实现（映射配置持久化，源端始终只读）
import { Pool } from 'pg';
import type { SourceConnection, ObjectMapping, ConnectionMeta, DbType, TestResult, TablePreview } from './mapping-model';

// MySQL 驱动按需加载（仅当连接为 mysql 时引入，避免无 mysql 依赖时启动失败）
let mysqlMod: typeof import('mysql2/promise') | null = null;
async function loadMysql() {
  if (!mysqlMod) {
    mysqlMod = await import('mysql2/promise');
  }
  return mysqlMod;
}

export class PostgresMappingStore {
  constructor(private pool: Pool) {}

  async createSourceConnection(c: SourceConnection): Promise<void> {
    await this.pool.query(
      `INSERT INTO source_connection
         (id, display_name, kind, read_only, connection_meta, secret_ref, status, icon, created_at, updated_at)
       VALUES ($1,$2,$3,TRUE,$4,$5,$6,$7,now(),now())
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.displayName, c.kind, JSON.stringify(c.connectionMeta), c.secretRef, c.status, c.icon ?? null],
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
      icon: r.icon ?? undefined,
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
      icon: r.icon ?? undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async updateSourceConnection(c: SourceConnection): Promise<void> {
    await this.pool.query(
      `UPDATE source_connection
         SET display_name=$2, kind=$3, connection_meta=$4, secret_ref=$5, status=$6, icon=$7, updated_at=now()
       WHERE id=$1`,
      [c.id, c.displayName, c.kind, JSON.stringify(c.connectionMeta), c.secretRef, c.status, c.icon ?? null],
    );
  }

  async deleteSourceConnection(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM source_connection WHERE id=$1`, [id]);
  }

  // 列出源库（postgres: pg_database；mysql: SHOW DATABASES）。不依赖已持久化连接。
  async listSourceDatabases(meta: ConnectionMeta): Promise<string[]> {
    const { dbType, database } = this.resolveMetaForParams(meta);
    if (dbType === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        connectTimeout: 3000,
      });
      try {
        const [rows] = await c.query('SHOW DATABASES');
        return (rows as any[]).map((r) => Object.values(r)[0] as string);
      } finally {
        await c.end();
      }
    }
    const url = this.buildPgUrl(meta, database);
    const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows } = await pool.query(
        `SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname`,
      );
      return rows.map((r: any) => r.datname);
    } finally {
      await pool.end();
    }
  }

  // 仅做连通性测试（参数化，不依赖已持久化连接）。
  async testSourceConnection(meta: ConnectionMeta): Promise<TestResult> {
    const { database } = this.resolveMetaForParams(meta);
    if ((meta.dbType ?? 'postgres') === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        database,
        connectTimeout: 3000,
      });
      try {
        await c.query('SELECT 1');
        return { reachable: true, dbType: 'mysql', tables: [] };
      } catch (e: any) {
        return { reachable: false, error: e.message, dbType: 'mysql', tables: [] };
      } finally {
        await c.end();
      }
    }
    const url = this.buildPgUrl(meta, database);
    const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      await pool.query('SELECT 1');
      return { reachable: true, dbType: 'postgres', tables: [] };
    } catch (e: any) {
      return { reachable: false, error: e.message, dbType: 'postgres', tables: [] };
    } finally {
      await pool.end();
    }
  }

  // 从裸参数解析 meta（用于未持久化的表单测试 / 列库）
  private resolveMetaForParams(meta: ConnectionMeta): { dbType: DbType; database: string } {
    const dbType: DbType = meta.dbType === 'mysql' ? 'mysql' : 'postgres';
    const database = meta.database || (dbType === 'mysql' ? '' : 'postgres');
    return { dbType, database };
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

  // ---------- 源连接测试 / 表结构探测 ----------
  // 连接只读源库，列出所有表及字段信息（前端创建对象类型时选表/映射字段用）。
  // 凭据演示从 connectionMeta 取；生产应走 secretRef，且始终只读。
  // 支持 postgres / mysql 两种数据库类型。

  private resolveMeta(conn: SourceConnection): { meta: ConnectionMeta; dbType: DbType; database: string } {
    const meta = (conn.connectionMeta as ConnectionMeta) || {};
    const dbType: DbType = meta.dbType === 'mysql' ? 'mysql' : 'postgres';
    const database = meta.database || 'enterprise_biz';
    if (!meta.database) {
      console.warn(`[probe] 数据源 ${conn.id} 未配置 database，回退默认库 enterprise_biz`);
    }
    return { meta, dbType, database };
  }

  // 仅做连通性测试：建立连接并执行一个最小查询（SELECT 1），不列举表。
  async testConnection(conn: SourceConnection): Promise<TestResult> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    try {
      if (dbType === 'mysql') {
        const mysql = await loadMysql();
        const c = await mysql.createConnection({
          host: meta.host || 'localhost',
          port: Number(meta.port || 3306),
          user: meta.user || 'root',
          password: meta.password || '',
          database,
          connectTimeout: 3000,
        });
        try {
          await c.query('SELECT 1');
        } finally {
          await c.end();
        }
        return { reachable: true, dbType, tables: [] };
      }
      // postgres
      const url = this.buildPgUrl(meta, database);
      const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
      try {
        await srcPool.query('SELECT 1');
        return { reachable: true, dbType, tables: [] };
      } finally {
        await srcPool.end();
      }
    } catch (e: any) {
      return { reachable: false, error: e.message, dbType, tables: [] };
    }
  }

  private buildPgUrl(meta: ConnectionMeta, database: string): string {
    return (
      `postgresql://${meta.user || 'ontology'}:${meta.password || 'ontology'}` +
      `@${meta.host || 'localhost'}:${meta.port || 5432}/${encodeURIComponent(database)}`
    );
  }

  async probeSourceTables(conn: SourceConnection, schema = 'public'): Promise<TestResult> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    if (dbType === 'mysql') {
      return this.probeMysql(conn, meta, database);
    }
    return this.probePostgres(conn, meta, database, schema);
  }

  // 列出源库内可见 schema（供数据源浏览：库 → schema → 表）
  async listSourceSchemas(conn: SourceConnection): Promise<string[]> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    if (dbType === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        connectTimeout: 3000,
      });
      try {
        const [rows] = await c.query(
          `SELECT schema_name FROM information_schema.schemata ORDER BY schema_name`,
        );
        return (rows as any[]).map((r) => r.schema_name ?? Object.values(r)[0]) as string[];
      } finally {
        await c.end();
      }
    }
    const url = this.buildPgUrl(meta, database);
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows } = await srcPool.query(
        `SELECT schema_name FROM information_schema.schemata
         WHERE schema_name NOT LIKE 'pg\\_%' AND schema_name <> 'information_schema'
         ORDER BY schema_name`,
      );
      return rows.map((r: any) => r.schema_name);
    } finally {
      await srcPool.end();
    }
  }

  // 数据预览：只读 SELECT * FROM <schema>.<table> LIMIT/OFFSET，附带字段与总行数
  async previewSourceTable(
    conn: SourceConnection,
    opts: { schema?: string; table: string; limit?: number; offset?: number },
  ): Promise<TablePreview> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    const schema = opts.schema || (dbType === 'mysql' ? database : 'public');
    const table = opts.table;
    const limit = Math.min(Math.max(1, Number(opts.limit) || 50), 500);
    const offset = Math.max(0, Number(opts.offset) || 0);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
      throw new Error(`非法表名或 schema：${schema}.${table}`);
    }

    if (dbType === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        database,
        connectTimeout: 3000,
      });
      try {
        const [chk] = await c.query(
          `SELECT 1 FROM information_schema.tables
           WHERE table_schema = ? AND table_name = ? AND table_type = 'BASE TABLE'`,
          [schema, table],
        );
        if ((chk as any[]).length === 0) throw new Error(`表 ${schema}.${table} 不存在`);
        const [cols] = await c.query(
          `SELECT column_name, data_type FROM information_schema.columns
           WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position`,
          [schema, table],
        );
        const [rows] = await c.query(
          `SELECT * FROM \`${schema}\`.\`${table}\` LIMIT ? OFFSET ?`,
          [limit, offset],
        );
        const [cnt] = await c.query(`SELECT COUNT(*) AS n FROM \`${schema}\`.\`${table}\``);
        return {
          schema, table, dbType: 'mysql',
          columns: (cols as any[]).map((x) => ({ name: x.column_name, dataType: x.data_type })),
          rows: rows as Record<string, unknown>[],
          total: Number((cnt as any[])[0]?.n ?? 0),
          limit, offset,
        };
      } finally {
        await c.end();
      }
    }

    const url = this.buildPgUrl(meta, database);
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const chk = await srcPool.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema=$1 AND table_name=$2 AND table_type='BASE TABLE'`,
        [schema, table],
      );
      if (chk.rowCount === 0) throw new Error(`表 ${schema}.${table} 不存在`);
      const { rows: cols } = await srcPool.query(
        `SELECT column_name, data_type FROM information_schema.columns
         WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`,
        [schema, table],
      );
      const { rows } = await srcPool.query(
        `SELECT * FROM "${schema}"."${table}" LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      const { rows: cnt } = await srcPool.query(
        `SELECT count(*)::bigint AS n FROM "${schema}"."${table}"`,
      );
      return {
        schema, table, dbType: 'postgres',
        columns: cols.map((x: any) => ({ name: x.column_name, dataType: x.data_type })),
        rows,
        total: Number(cnt[0]?.n ?? 0),
        limit, offset,
      };
    } finally {
      await srcPool.end();
    }
  }

  // 列出源库指定 schema 下的表名（供建模/浏览快速枚举，只读）
  async listSourceTableNames(conn: SourceConnection, schema = 'public'): Promise<string[]> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    const s = dbType === 'mysql' ? (schema || database) : schema;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(s)) throw new Error(`非法 schema：${s}`);
    if (dbType === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        database,
        connectTimeout: 3000,
      });
      try {
        const [rows] = await c.query(
          `SELECT table_name FROM information_schema.tables
           WHERE table_schema = ? AND table_type = 'BASE TABLE' ORDER BY table_name`,
          [s],
        );
        return (rows as any[]).map((r) => r.table_name ?? Object.values(r)[0]) as string[];
      } finally {
        await c.end();
      }
    }
    const url = this.buildPgUrl(meta, database);
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows } = await srcPool.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema=$1 AND table_type='BASE TABLE' ORDER BY table_name`,
        [s],
      );
      return rows.map((r: any) => r.table_name);
    } finally {
      await srcPool.end();
    }
  }

  // 全量读取源表（供 S3 通用实例同步）：只读 SELECT，rows 为原始行
  async readSourceTable(
    conn: SourceConnection,
    opts: { schema?: string; table: string; limit?: number },
  ): Promise<{ columns: { name: string; dataType: string }[]; rows: Record<string, unknown>[] }> {
    const { meta, dbType, database } = this.resolveMeta(conn);
    const schema = opts.schema || (dbType === 'mysql' ? database : 'public');
    const table = opts.table;
    const limit = Math.min(Math.max(1, Number(opts.limit) || 50000), 200000);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
      throw new Error(`非法表名或 schema：${schema}.${table}`);
    }
    if (dbType === 'mysql') {
      const mysql = await loadMysql();
      const c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        database,
        connectTimeout: 3000,
      });
      try {
        const [cols] = await c.query(
          `SELECT column_name, data_type FROM information_schema.columns
           WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position`,
          [schema, table],
        );
        const [rows] = await c.query(`SELECT * FROM \`${schema}\`.\`${table}\` LIMIT ?`, [limit]);
        return {
          columns: (cols as any[]).map((x) => ({ name: x.column_name, dataType: x.data_type })),
          rows: rows as Record<string, unknown>[],
        };
      } finally {
        await c.end();
      }
    }
    const url = this.buildPgUrl(meta, database);
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows: cols } = await srcPool.query(
        `SELECT column_name, data_type FROM information_schema.columns
         WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`,
        [schema, table],
      );
      const { rows } = await srcPool.query(
        `SELECT * FROM "${schema}"."${table}" LIMIT $1`,
        [limit],
      );
      return {
        columns: cols.map((x: any) => ({ name: x.column_name, dataType: x.data_type })),
        rows,
      };
    } finally {
      await srcPool.end();
    }
  }

  private async probePostgres(conn: SourceConnection, meta: ConnectionMeta, database: string, schema: string): Promise<TestResult> {
    const url = this.buildPgUrl(meta, database);
    const srcPool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 3000 });
    try {
      const { rows: tbls } = await srcPool.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema=$1 AND table_type='BASE TABLE' ORDER BY table_name`,
        [schema],
      );
      const tables = [];
      for (const t of tbls) {
        const { rows: cols } = await srcPool.query(
          `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns
           WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`,
          [schema, t.table_name],
        );
        const { rows: pk } = await srcPool.query(
          `SELECT a.attname AS col
           FROM pg_index i
           JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attnum=ANY(i.indkey)
           JOIN pg_class c ON c.oid=i.indrelid
           JOIN pg_namespace n ON n.oid=c.relnamespace
           WHERE n.nspname=$1 AND c.relname=$2 AND i.indisprimary`,
          [schema, t.table_name],
        );
        const pkSet = new Set(pk.map((r: any) => r.col));
        tables.push({
          table: t.table_name,
          columns: cols.map((c: any) => ({
            name: c.column_name,
            dataType: c.data_type,
            isNullable: c.is_nullable === 'YES',
            isPrimaryKey: pkSet.has(c.column_name),
          })),
        });
      }
      return { reachable: true, dbType: 'postgres', tables };
    } catch (e: any) {
      return { reachable: false, error: e.message, dbType: 'postgres', tables: [] };
    } finally {
      await srcPool.end();
    }
  }

  private async probeMysql(conn: SourceConnection, meta: ConnectionMeta, database: string): Promise<TestResult> {
    let c: any;
    try {
      const mysql = await loadMysql();
      c = await mysql.createConnection({
        host: meta.host || 'localhost',
        port: Number(meta.port || 3306),
        user: meta.user || 'root',
        password: meta.password || '',
        database,
        connectTimeout: 3000,
      });
      const [tbls] = await c.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = ? AND table_type = 'BASE TABLE' ORDER BY table_name`,
        [database],
      );
      const tables = [];
      for (const t of tbls as any[]) {
        const [cols] = await c.query(
          `SELECT column_name, data_type, is_nullable, column_key
           FROM information_schema.columns
           WHERE table_schema = ? AND table_name = ?
           ORDER BY ordinal_position`,
          [database, t.table_name],
        );
        tables.push({
          table: t.table_name,
          columns: (cols as any[]).map((col) => ({
            name: col.column_name,
            dataType: col.data_type,
            isNullable: col.is_nullable === 'YES',
            isPrimaryKey: col.column_key === 'PRI',
          })),
        });
      }
      return { reachable: true, dbType: 'mysql', tables };
    } catch (e: any) {
      return { reachable: false, error: e.message, dbType: 'mysql', tables: [] };
    } finally {
      if (c) await c.end();
    }
  }
}
