// S1 数据接入与映射 — 映射服务
// 映射已内嵌到对象类型（S2）：对象类型携带 sourceConnectionId / sourceTable，
// 字段级映射记录在对象属性 property.sourceMapping 上。
// 本服务保留的能力：源连接注册、表结构探测、以及“创建对象类型时关联数据源并映射字段”的组合动作。
import type { MetadataRepository, ChildTableMapping } from '@ontology/ontology-core';
import type { PostgresMappingStore } from './mapping-store.pg';
import type { ObjectMapping, SourceConnection, TestResult } from './mapping-model';
import type { ObjectType } from '@ontology/ontology-core';

export type { TestResult } from './mapping-model';

export interface ProbeColumn {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

export interface CreateObjectTypeWithMappingInput {
  // S2 对象类型定义（其 properties 上携带 sourceMapping）
  objectType: ObjectType;
  // S1 映射：关联到某个数据源的某张表（可选；未绑定数据源时对象类型独立存在）
  sourceConnectionId?: string;
  sourceTable?: string;
  fieldMappings: { property: string; sourceColumn: string }[];
  mappingId?: string;
  // 父子明细映射（主表 + 明细表纵向关联）：明细行按外键聚合为数组/计数属性挂到主对象。
  childTableMappings?: ChildTableMapping[];
}

export class MappingService {
  constructor(
    private store: PostgresMappingStore,
    private metadata: MetadataRepository,
  ) {}

  async registerSourceConnection(c: SourceConnection): Promise<void> {
    if (!c.readOnly) {
      throw new Error('S1 源连接必须 readOnly=true（只读接入，禁止写回源端）');
    }
    await this.store.createSourceConnection(c);
  }

  async getSourceConnection(id: string) {
    return this.store.getSourceConnection(id);
  }

  // 探测只读源库中的表与字段
  async probeSourceTables(connId: string): Promise<TestResult> {
    const conn = await this.store.getSourceConnection(connId);
    if (!conn) throw new Error(`数据源不存在: ${connId}`);
    return this.store.probeSourceTables(conn);
  }

  // 仅做连通性测试（不列举表）
  async testConnection(connId: string): Promise<TestResult> {
    const conn = await this.store.getSourceConnection(connId);
    if (!conn) throw new Error(`数据源不存在: ${connId}`);
    return this.store.testConnection(conn);
  }

  // 更新已存在的连接（编辑）
  async updateConnection(c: SourceConnection): Promise<void> {
    await this.store.updateSourceConnection(c);
  }

  // 删除连接
  async deleteConnection(id: string): Promise<void> {
    await this.store.deleteSourceConnection(id);
  }

  // 参数化测试（新建/编辑对话框内，未持久化也可用表单当前值）
  async testSourceConnection(meta: ConnectionMeta): Promise<TestResult> {
    return this.store.testSourceConnection(meta);
  }

  // 列出现有数据库（连接测试通过后调用，供选择库/schema）
  async listSourceDatabases(meta: ConnectionMeta): Promise<string[]> {
    return this.store.listSourceDatabases(meta);
  }

  // 组合动作：创建对象类型并把映射内嵌进对象类型（同时保留 object_mapping 底层记录）
  // 这是“创建对象类型时关联数据源的表并把字段映射为属性”的落地点。
  async createObjectTypeWithMapping(input: CreateObjectTypeWithMappingInput): Promise<{ qualityStatus: ObjectMapping['qualityStatus'] }> {
    // 1) 校验：映射的 property 必须属于对象类型定义
    const definedProps = new Set(input.objectType.properties.map((p) => p.apiName));
    const allMapped = input.fieldMappings.every((fm) => definedProps.has(fm.property));
    const qualityStatus: ObjectMapping['qualityStatus'] = allMapped ? 'passed' : 'warning';

    // 2) 把来源内嵌进对象类型（取代独立的映射管理层）
    //    父子明细映射：优先取入参顶层 childTableMappings，其次回退到 objectType 上声明的（数据驱动场景）。
    const childTableMappings = input.childTableMappings?.length
      ? input.childTableMappings
      : (input.objectType.childTableMappings?.length ? input.objectType.childTableMappings : undefined);
    const ot: ObjectType = {
      ...input.objectType,
      version: input.objectType.version || 1,
      sourceConnectionId: input.sourceConnectionId || undefined,
      sourceTable: input.sourceTable || undefined,
      childTableMappings,
    };
    await this.metadata.createObjectType(ot);

    // 3) 仅当指定了有效数据源时才写入 object_mapping（避免外键约束失败）。
    //    object_mapping.source_connection_id 强制引用 source_connection(id)，
    //    未选连接时对象类型可独立存在（无 S1 映射）。
    if (input.sourceConnectionId) {
      const connId = input.sourceConnectionId;
      const conn = await this.store.getSourceConnection(connId);
      if (!conn) throw new Error(`数据源连接不存在: ${connId}`);
      const mapping: ObjectMapping = {
        id: input.mappingId || `map_${input.objectType.apiName.toLowerCase()}_${input.sourceTable}`,
        objectType: input.objectType.apiName,
        sourceConnectionId: connId,
        sourceTable: input.sourceTable ?? '',
        fieldMappings: input.fieldMappings,
        incrementalMeta: { syncMode: 'full' },
        qualityStatus,
        createdAt: '',
        updatedAt: '',
      };
      await this.store.createObjectMapping(mapping);
    }
    return { qualityStatus };
  }
}
