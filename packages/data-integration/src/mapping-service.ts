// S1 数据接入与映射 — 映射服务（质量校验 + 发布门禁）
// 规则（见 docs/S1-data-integration.md）：
// - 源连接强制只读（readOnly=true），凭据仅存引用（secretRef）。
// - 映射创建前需校验：目标对象类型存在、每个 fieldMapping.property 属于该对象属性。
// - 质量状态由校验结果推导：全部通过→passed；对象存在但部分属性缺失→warning；对象不存在→failed。
import type { MetadataRepository } from '@ontology/ontology-core';
import type { PostgresMappingStore } from './mapping-store.pg';
import type { ObjectMapping, SourceConnection } from './mapping-model';

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

  // 校验映射引用合法性，并推导质量状态后持久化
  async createObjectMapping(m: ObjectMapping): Promise<{ qualityStatus: ObjectMapping['qualityStatus'] }> {
    const objectType = await this.metadata.getObjectType(m.objectType);
    if (!objectType) {
      const withStatus: ObjectMapping = { ...m, qualityStatus: 'failed' };
      await this.store.createObjectMapping(withStatus);
      return { qualityStatus: 'failed' };
    }
    const definedProps = new Set(objectType.properties.map((p) => p.apiName));
    const allMapped = m.fieldMappings.every((fm) => definedProps.has(fm.property));
    const qualityStatus: ObjectMapping['qualityStatus'] = allMapped ? 'passed' : 'warning';
    await this.store.createObjectMapping({ ...m, qualityStatus });
    return { qualityStatus };
  }

  async listObjectMappings(): Promise<ObjectMapping[]> {
    return this.store.listObjectMappings();
  }

  async setQualityStatus(id: string, status: ObjectMapping['qualityStatus']): Promise<void> {
    await this.store.updateQualityStatus(id, status);
  }
}
