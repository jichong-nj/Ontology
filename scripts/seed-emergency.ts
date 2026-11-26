import { Pool } from 'pg';
import { PostgresMetadataRepository } from '@ontology/ontology-core';
import { ensureEmergencyOntology, seedEmergencyDemo } from '@ontology/emergency-response';

const url = process.env.META_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://ontology:ontology@localhost:5432/ontology';
const pool = new Pool({ connectionString: url });
const repo = new PostgresMetadataRepository(pool);

try {
  await ensureEmergencyOntology(repo);
  await seedEmergencyDemo(repo);
  console.log('[emergency] 初始化完成');
} finally {
  await pool.end();
}
