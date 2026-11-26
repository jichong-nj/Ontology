import { randomUUID } from 'node:crypto';
import type { MetadataRepository } from '@ontology/ontology-core';
import { extractFromText } from './ai';

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
  caseStatus?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  linkType: string;
  recordRid?: string;
}

export interface CaseSummary {
  id: string;
  title: string;
  level: string;
  status: string;
  sourceSystem?: string;
  discoveredAt?: string;
  updatedAt?: string;
  pendingTasks: number;
  openTasks: number;
}

function labelOf(type: string, p: Record<string, any>, rid: string): string {
  return String(p.title ?? p.name ?? p.displayName ?? p.id ?? rid);
}

export class EmergencyService {
  constructor(private repo: MetadataRepository) {}

  private async all(type: string): Promise<Array<{ objectRid: string; properties: Record<string, any> }>> {
    const out: Array<{ objectRid: string; properties: Record<string, any> }> = [];
    let token: string | undefined;
    do {
      const page = await this.repo.listInstances(type, { pageSize: 500, pageToken: token });
      out.push(...page.data.map((d) => ({ objectRid: d.objectRid, properties: (d.properties ?? {}) as any })));
      token = page.nextPageToken ?? undefined;
    } while (token);
    return out;
  }

  private async links(linkType: string): Promise<Array<{ sourceRid: string; targetRid: string }>> {
    return this.repo.listLinkInstances(linkType);
  }

  private async instance(type: string, rid: string): Promise<{ objectRid: string; properties: Record<string, any> } | null> {
    const fullRid = String(rid).includes(':') ? rid : `${type}:${rid}`;
    const page = await this.repo.listInstances(type, { rids: [fullRid], pageSize: 1 });
    const d = page.data[0];
    return d ? { objectRid: d.objectRid, properties: (d.properties ?? {}) as any } : null;
  }

  async createOpinionEvent(payload: Record<string, any>): Promise<any> {
    const id = String(payload.id ?? `POE-${Date.now()}`);
    const now = new Date().toISOString();
    await this.repo.writeObjectPatch('PublicOpinionEvent', id, {
      id, eventId: String(payload.eventId ?? id), sourceSystem: payload.sourceSystem ?? '舆情监控',
      websiteName: payload.websiteName ?? '', websiteUrl: payload.websiteUrl ?? '',
      websiteRegion: payload.websiteRegion ?? '境外', country: payload.country ?? '',
      accountName: payload.accountName ?? '', accountId: payload.accountId ?? '',
      publishedAt: payload.publishedAt ?? now.slice(0, 10), title: payload.title ?? '未命名舆情事件',
      contentText: payload.contentText ?? '', language: payload.language ?? 'zh',
      keywords: payload.keywords ?? '', classificationLevel: payload.classificationLevel ?? '公开',
      severity: payload.severity ?? '中', attachments: payload.attachments ?? [],
      attachmentText: payload.attachmentText ?? '', discoveredAt: now,
    }, 'sim:opinion');
    return { id, objectRid: `PublicOpinionEvent:${id}` };
  }

  async listCases(): Promise<CaseSummary[]> {
    const cases = await this.all('EmergencyResponse');
    const vtLinks = await this.links('VerificationTaskCase');
    const itLinks = await this.links('InspectionTaskCase');
    const vts = await this.all('VerificationTask');
    const its = await this.all('InspectionTask');
    const vtById = new Map(vts.map((t) => [t.objectRid, t.properties]));
    const itById = new Map(its.map((t) => [t.objectRid, t.properties]));

    return cases
      .map((c) => {
        const p = c.properties;
        const taskRids = [
          ...vtLinks.filter((l) => l.targetRid === c.objectRid).map((l) => l.sourceRid),
          ...itLinks.filter((l) => l.targetRid === c.objectRid).map((l) => l.sourceRid),
        ];
        const tasks = taskRids.map((rid) => vtById.get(rid) ?? itById.get(rid)).filter(Boolean) as any[];
        return {
          id: c.objectRid,
          title: String(p.title ?? p.id ?? c.objectRid),
          level: String(p.level ?? ''),
          status: String(p.status ?? ''),
          sourceSystem: p.sourceSystem ? String(p.sourceSystem) : undefined,
          discoveredAt: p.discoveredAt ? String(p.discoveredAt) : undefined,
          updatedAt: p.closedAt ? String(p.closedAt) : p.startedAt ? String(p.startedAt) : undefined,
          pendingTasks: tasks.filter((t) => t.status === 'pending').length,
          openTasks: tasks.filter((t) => t.status !== 'submitted').length,
        } satisfies CaseSummary;
      })
      .sort((a, b) => (a.status === b.status ? String(b.discoveredAt ?? '').localeCompare(String(a.discoveredAt ?? '')) : a.status === 'in_progress' ? -1 : 1));
  }

  async getCase(caseRid: string): Promise<Record<string, unknown> | null> {
    const c = await this.instance('EmergencyResponse', caseRid);
    if (!c) return null;
    const refs = (await this.all('CaseEntityRef')).filter((r) => r.properties.caseRid === caseRid);
    const candidates = (await this.all('DocumentCandidate')).filter((r) => r.properties.caseRid === caseRid);
    return { ...c.properties, objectRid: c.objectRid, refs: refs.map((r) => r.properties), candidates: candidates.map((r) => r.properties) };
  }

  async getGraph(caseRid: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();
    const addNode = (rid: string, type: string, props: Record<string, any>, caseStatus?: string) => {
      if (!nodes.has(rid)) nodes.set(rid, { id: rid, type, label: labelOf(type, props, rid), properties: props, caseStatus });
    };
    const addEdge = (source: string, target: string, label: string, linkType: string, recordRid?: string) => {
      const id = `${linkType}:${source}->${target}`;
      if (!edges.has(id)) edges.set(id, { id, source, target, label, linkType, recordRid });
    };
    const addEntity = async (rid: string, type?: string) => {
      const t = type ?? rid.split(':')[0];
      const inst = await this.instance(t, rid);
      if (inst) addNode(rid, t, inst.properties);
    };

    const caseInst = await this.instance('EmergencyResponse', caseRid);
    if (!caseInst) return { nodes: [], edges: [] };
    addNode(caseRid, 'EmergencyResponse', caseInst.properties);

    // 来源事件
    for (const l of await this.links('EmergencyResponseSourceEvent')) {
      if (l.sourceRid !== caseRid) continue;
      const ev = await this.instance('PublicOpinionEvent', l.targetRid);
      if (ev) {
        addNode(ev.objectRid, 'PublicOpinionEvent', ev.properties);
        addEdge(caseRid, ev.objectRid, '来源事件', 'EmergencyResponseSourceEvent');
      }
    }

    // 数据池成员
    const refs = (await this.all('CaseEntityRef')).filter((r) => r.properties.caseRid === caseRid);
    for (const r of refs) {
      const { entityRid, entityType, status } = r.properties as any;
      if (!entityRid) continue;
      await addEntity(String(entityRid), String(entityType ?? String(entityRid).split(':')[0]));
      addEdge(caseRid, String(entityRid), `纳入(${status ?? 'included'})`, 'CaseEntityRef');
    }

    // 任务 + 回复/报告
    for (const [taskType, caseLink, orgLink, docLink, respType, respLink] of [
      ['VerificationTask', 'VerificationTaskCase', 'VerificationTaskOrg', 'VerificationTaskDocument', 'VerificationResponse', 'VerificationResponseTask'],
      ['InspectionTask', 'InspectionTaskCase', 'InspectionTaskOrg', 'InspectionTaskDocument', 'InspectionReport', 'InspectionReportTask'],
    ] as const) {
      const caseLinks = await this.links(caseLink);
      const taskRids = caseLinks.filter((l) => l.targetRid === caseRid).map((l) => l.sourceRid);
      for (const taskRid of taskRids) {
        const task = await this.instance(taskType, taskRid);
        if (!task) continue;
        addNode(taskRid, taskType, task.properties);
        addEdge(caseRid, taskRid, taskType === 'VerificationTask' ? '核查' : '检查', caseLink);

        for (const l of await this.links(orgLink)) if (l.sourceRid === taskRid) {
          await addEntity(l.targetRid, 'Organization');
          addEdge(taskRid, l.targetRid, '单位', orgLink);
        }
        for (const l of await this.links(docLink)) if (l.sourceRid === taskRid) {
          await addEntity(l.targetRid, 'Document');
          addEdge(taskRid, l.targetRid, '文档', docLink);
        }
        for (const l of await this.links(respLink)) if (l.targetRid === taskRid) {
          const resp = await this.instance(respType, l.sourceRid);
          if (resp) {
            addNode(resp.objectRid, respType, resp.properties);
            addEdge(resp.objectRid, taskRid, respType === 'VerificationResponse' ? '回复' : '报告', respLink);
          }
        }
      }
    }

    // 收发文/借阅/转交/发布（关系实例对象）
    const included = new Set(nodes.keys());
    const relationSpecs = [
      ['DispatchRecord', 'DispatchRecordDocument', 'DispatchRecordSender', 'DispatchRecordReceiver'],
      ['BorrowRecord', 'BorrowRecordDocument', 'BorrowRecordOrg', 'BorrowRecordBorrower'],
    ] as const;
    for (const [type, docLink, aLink, bLink] of relationSpecs) {
      for (const rec of await this.all(type)) {
        const links = [
          ...(await this.links(docLink)).filter((l) => l.sourceRid === rec.objectRid).map((l) => ({ rid: l.targetRid, linkType: docLink, label: '文档' })),
          ...(await this.links(aLink)).filter((l) => l.sourceRid === rec.objectRid).map((l) => ({ rid: l.targetRid, linkType: aLink, label: type === 'DispatchRecord' ? '发送' : '单位' })),
          ...(await this.links(bLink)).filter((l) => l.sourceRid === rec.objectRid).map((l) => ({ rid: l.targetRid, linkType: bLink, label: type === 'DispatchRecord' ? '接收' : '借阅人' })),
        ];
        // 只有当至少一个端点已纳入案件时才加入关系实例
        if (!links.some((l) => included.has(l.rid))) continue;
        addNode(rec.objectRid, type, rec.properties);
        for (const l of links) {
          await addEntity(l.rid, l.rid.split(':')[0]);
          addEdge(rec.objectRid, l.rid, l.label, l.linkType);
        }
      }
    }

    return { nodes: [...nodes.values()], edges: [...edges.values()] };
  }

  private async addRef(
    caseRid: string, entityRid: string, entityType: string,
    sourceType: string, sourceRid?: string, reason?: string, addedBy = 'rule',
  ): Promise<void> {
    const refs = await this.all('CaseEntityRef');
    if (refs.some((r) => r.properties.caseRid === caseRid && r.properties.entityRid === entityRid)) return;
    const id = `CER-${randomUUID().slice(0, 8)}`;
    await this.repo.writeObjectPatch('CaseEntityRef', id, {
      id, caseRid, entityRid, entityType, status: 'included', addedBy,
      sourceType, sourceRid: sourceRid ?? '', reason: reason ?? '', addedAt: new Date().toISOString(),
    }, `emergency:${addedBy}`);
  }

  // 文档确认后展开：收发文/借阅记录 + 相关单位、人员
  private async expandDocument(caseRid: string, documentRid: string): Promise<void> {
    for (const rec of await this.all('DispatchRecord')) {
      if (rec.properties.documentRid !== documentRid) continue;
      await this.addRef(caseRid, rec.objectRid, 'DispatchRecord', 'dispatch', rec.objectRid, '文档收发文记录');
      for (const [field, type] of [['senderOrgRid', 'Organization'], ['receiverOrgRid', 'Organization']] as const) {
        const rid = rec.properties[field];
        if (rid) await this.addRef(caseRid, String(rid), type, 'dispatch', rec.objectRid, '收发文相关单位');
      }
    }
    for (const rec of await this.all('BorrowRecord')) {
      if (rec.properties.documentRid !== documentRid) continue;
      await this.addRef(caseRid, rec.objectRid, 'BorrowRecord', 'borrow', rec.objectRid, '文档借阅记录');
      if (rec.properties.orgRid) await this.addRef(caseRid, String(rec.properties.orgRid), 'Organization', 'borrow', rec.objectRid, '借阅单位');
      if (rec.properties.borrowerRid) await this.addRef(caseRid, String(rec.properties.borrowerRid), 'Employee', 'borrow', rec.objectRid, '借阅人');
    }
  }

  async listCandidates(caseRid: string): Promise<any[]> {
    const docs = await this.all('Document');
    const docById = new Map(docs.map((d) => [d.objectRid, d.properties]));
    return (await this.all('DocumentCandidate'))
      .filter((c) => c.properties.caseRid === caseRid)
      .map((c) => ({ ...c.properties, document: docById.get(String(c.properties.documentRid)) ?? null }));
  }

  async decideCandidate(candidateRid: string, accept: boolean): Promise<void> {
    const cand = await this.instance('DocumentCandidate', candidateRid);
    if (!cand) throw new Error('候选不存在');
    const p = cand.properties;
    await this.repo.writeObjectPatch('DocumentCandidate', candidateRid, { status: accept ? 'accepted' : 'rejected' }, 'emergency:expert');
    if (accept) {
      await this.addRef(String(p.caseRid), String(p.documentRid), 'Document', 'search', candidateRid, '专家确认文档候选', 'expert');
      await this.expandDocument(String(p.caseRid), String(p.documentRid));
    }
  }

  async listTasks(caseRid: string): Promise<any[]> {
    const out: any[] = [];
    for (const [type, linkType] of [['VerificationTask', 'VerificationTaskCase'], ['InspectionTask', 'InspectionTaskCase']] as const) {
      const links = await this.links(linkType);
      const rids = links.filter((l) => l.targetRid === caseRid).map((l) => l.sourceRid);
      for (const rid of rids) {
        const t = await this.instance(type, rid);
        if (t) out.push({ ...t.properties, objectRid: t.objectRid, taskType: type });
      }
    }
    return out.sort((a, b) => String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')));
  }

  async listInbox(type: 'verification' | 'inspection'): Promise<any[]> {
    const taskType = type === 'verification' ? 'VerificationTask' : 'InspectionTask';
    const tasks = await this.all(taskType);
    const cases = await this.all('EmergencyResponse');
    const orgs = await this.all('Organization');
    const caseById = new Map(cases.map((c) => [c.objectRid, c.properties]));
    const orgById = new Map(orgs.map((o) => [o.objectRid, o.properties]));
    return tasks
      .filter((t) => t.properties.status !== 'submitted')
      .map((t) => ({
        ...t.properties,
        objectRid: t.objectRid,
        taskType,
        caseTitle: caseById.get(String(t.properties.caseRid))?.title ?? t.properties.caseRid,
        orgName: orgById.get(String(t.properties.orgRid))?.name ?? t.properties.orgRid,
      }))
      .sort((a, b) => String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')));
  }

  async receiveTask(taskRid: string): Promise<void> {
    const type = String(taskRid).split(':')[0];
    if (!['VerificationTask', 'InspectionTask'].includes(type)) throw new Error('不是任务');
    await this.repo.writeObjectPatch(type, taskRid, { status: 'in_progress', receivedAt: new Date().toISOString() }, 'sim:receiver');
  }

  async submitTask(taskRid: string, payload: { contentText?: string; attachments?: unknown[]; summary?: string }): Promise<any> {
    const type = String(taskRid).split(':')[0];
    const task = await this.instance(type, taskRid);
    if (!task) throw new Error('任务不存在');
    const p = task.properties;
    const now = new Date().toISOString();
    if (type === 'VerificationTask') {
      const id = `VR-${randomUUID().slice(0, 8)}`;
      await this.repo.writeObjectPatch('VerificationResponse', id, {
        id, taskRid, orgRid: p.orgRid, contentText: payload.contentText ?? '',
        attachments: payload.attachments ?? [], submittedAt: now,
      }, 'sim:unit');
      await this.repo.createLinkInstance('VerificationResponseTask', `VerificationResponse:${id}`, taskRid);
      await this.repo.writeObjectPatch(type, taskRid, { status: 'submitted', submittedAt: now }, 'sim:unit');
      await this.extractResponse(`VerificationResponse:${id}`).catch(() => {});
      return { id, type: 'VerificationResponse' };
    }
    const id = `IR-${randomUUID().slice(0, 8)}`;
    await this.repo.writeObjectPatch('InspectionReport', id, {
      id, taskRid, orgRid: p.orgRid, contentText: payload.contentText ?? '',
      attachments: payload.attachments ?? [], summary: payload.summary ?? '', submittedAt: now,
    }, 'sim:inspector');
    await this.repo.createLinkInstance('InspectionReportTask', `InspectionReport:${id}`, taskRid);
    await this.repo.writeObjectPatch(type, taskRid, { status: 'submitted', submittedAt: now }, 'sim:inspector');
    await this.extractResponse(`InspectionReport:${id}`).catch(() => {});
    return { id, type: 'InspectionReport' };
  }

  async extractResponse(sourceRid: string): Promise<any[]> {
    const sourceType = String(sourceRid).split(':')[0];
    if (!['VerificationResponse', 'InspectionReport'].includes(sourceType)) throw new Error('不是回复/报告');
    const inst = await this.instance(sourceType, sourceRid);
    if (!inst) throw new Error('来源不存在');
    const p = inst.properties;
    const task = await this.instance(sourceType === 'VerificationResponse' ? 'VerificationTask' : 'InspectionTask', String(p.taskRid ?? ''));
    const caseRid = String(task?.properties.caseRid ?? '');
    if (!caseRid) throw new Error('任务未关联案件');
    const result = await extractFromText(String(p.contentText ?? ''), sourceType);
    if (sourceType === 'InspectionReport' && result.summary) {
      await this.repo.writeObjectPatch('InspectionReport', sourceRid, { summary: result.summary }, 'ai:extract');
    }
    const out: any[] = [];
    for (const e of result.entities) {
      const id = `EE-${randomUUID().slice(0, 8)}`;
      await this.repo.writeObjectPatch('ExtractedEntity', id, {
        id, caseRid, sourceRid, sourceType: sourceType === 'VerificationResponse' ? 'verification' : 'inspection',
        entityType: e.entityType, rawText: e.rawText ?? '', value: e.value,
        confidence: e.confidence ?? 0.5, status: 'pending', createdByAction: 'extractFromText',
      }, 'ai:extract');
      out.push({ id, caseRid, ...e });
    }
    return out;
  }

  async listExtracted(caseRid: string): Promise<any[]> {
    return (await this.all('ExtractedEntity')).filter((e) => e.properties.caseRid === caseRid).map((e) => ({ ...e.properties, objectRid: e.objectRid }));
  }

  async decideExtracted(id: string, accept: boolean): Promise<void> {
    const full = String(id).includes(':') ? id : `ExtractedEntity:${id}`;
    const inst = await this.instance('ExtractedEntity', full);
    if (!inst) throw new Error('候选不存在');
    const p = inst.properties;
    await this.repo.writeObjectPatch('ExtractedEntity', full, { status: accept ? 'accepted' : 'rejected' }, 'emergency:expert');
    if (!accept) return;
    // 简单按名称匹配已有本体对象
    const map: Record<string, string> = { organization: 'Organization', employee: 'Employee', document: 'Document' };
    const type = map[String(p.entityType)];
    if (!type) return;
    const all = await this.all(type);
    const name = String(p.value ?? '');
    const hit = all.find((x) => String(x.properties.name ?? x.properties.title ?? x.properties.docNo ?? '') === name);
    if (hit) {
      await this.repo.writeObjectPatch('ExtractedEntity', full, { matchedEntityRid: hit.objectRid }, 'emergency:expert');
      await this.addRef(String(p.caseRid), hit.objectRid, type, 'response', full, `AI抽取：${name}`, 'ai');
    }
  }

  async closeCase(caseRid: string, payload: { note?: string; closureType?: string; finalText?: string; attachments?: unknown[] }): Promise<any> {
    const c = await this.instance('EmergencyResponse', caseRid);
    if (!c) throw new Error('案件不存在');
    const now = new Date().toISOString();
    const reportId = `CR-${randomUUID().slice(0, 8)}`;
    await this.repo.writeObjectPatch('ClosureReport', reportId, {
      id: reportId, caseRid, aiDraft: payload.finalText ?? '', finalText: payload.finalText ?? '',
      note: payload.note ?? '', attachments: payload.attachments ?? [],
      closureType: payload.closureType ?? 'normal', createdAt: now, submittedAt: now,
    }, 'emergency:expert');
    await this.repo.writeObjectPatch('EmergencyResponse', caseRid, {
      status: 'closed', closedAt: now, closureType: payload.closureType ?? 'normal',
    }, 'emergency:expert');
    return { reportId };
  }
}
