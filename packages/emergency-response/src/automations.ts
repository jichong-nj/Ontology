import type { ActionType, AutomationRule, OntologyFunction } from '@ontology/ontology-core';

export const CREATE_EMERGENCY_RESPONSE_BODY = `
return async (args, ctx) => {
  const { repo } = ctx;
  const flagged = Array.isArray(args.flagged) ? args.flagged : [];
  const created = [];
  for (const f of flagged) {
    const eventRid = String(f.rid ?? f.objectRid ?? '');
    if (!eventRid) continue;
    const eventId = String(f.eventId ?? eventRid.split(':').pop() ?? '');
    const cases = await ctx.objects('EmergencyResponse');
    if (cases.some((c) => String(c.properties.sourceEventId ?? '') === eventId || String(c.properties.sourceEventRid ?? '') === eventRid)) continue;
    const id = 'ER-' + eventId;
    const now = new Date().toISOString();
    const title = '应急响应：' + String(f.title ?? eventId);
    await repo.writeObjectPatch('EmergencyResponse', id, {
      id, title, sourceEventId: eventId, sourceEventRid: eventRid,
      sourceSystem: String(f.sourceSystem ?? '舆情监控'),
      level: String(f.classificationLevel ?? ''),
      status: 'in_progress',
      discoveredAt: now, startedAt: now,
      summary: '舆情事件触发自动建案：' + String(f.contentText ?? f.title ?? ''),
    }, 'action:createEmergencyResponse');
    await repo.createLinkInstance('EmergencyResponseSourceEvent', 'EmergencyResponse:' + id, eventRid);
    await repo.createNotification({
      title: '新的应急响应：' + title,
      body: '来源：' + String(f.websiteName ?? '') + ' / ' + String(f.websiteUrl ?? ''),
      level: 'warning', source: 'emergencyResponseCreateRule',
    });
    created.push({ id, eventRid });
  }
  return { created };
};`;

export const INITIAL_CASE_ASSOCIATION_BODY = `
return async (args, ctx) => {
  const { repo } = ctx;
  const cases = Array.isArray(args.flagged) ? args.flagged : [];
  const events = await ctx.objects('PublicOpinionEvent');
  const docs = await ctx.objects('Document');
  const existing = await ctx.objects('DocumentCandidate');
  const created = [];
  for (const c of cases) {
    const caseRid = String(c.rid ?? '');
    if (!caseRid) continue;
    const eventRid = String(c.sourceEventRid ?? '');
    const ev = events.find((e) => e.objectRid === eventRid);
    if (!ev) continue;
    const text = [ev.properties.title, ev.properties.contentText, ev.properties.attachmentText]
      .map((x) => String(x ?? '')).join(' ');
    for (const d of docs) {
      const p = d.properties;
      const docNo = String(p.docNo ?? '');
      const title = String(p.title ?? '');
      const hit = (docNo && text.includes(docNo)) || (title && text.includes(title));
      if (!hit) continue;
      if (existing.some((x) => x.properties.caseRid === caseRid && x.properties.documentRid === d.objectRid)) continue;
      const id = 'DC-' + Date.now() + '-' + created.length;
      await repo.writeObjectPatch('DocumentCandidate', id, {
        id, caseRid, documentRid: d.objectRid, matchScore: 0.9,
        source: 'search', status: 'pending', reason: '事件内容/文号命中：' + (docNo || title),
      }, 'action:initialCaseAssociation');
      created.push({ id, caseRid, documentRid: d.objectRid });
    }
  }
  return { created };
};`;

export const functions: OntologyFunction[] = [
  {
    apiName: 'createEmergencyResponse',
    displayName: '创建应急响应案件',
    language: 'typescript',
    entry: 'createEmergencyResponse',
    inputs: [
      { name: 'rule', type: 'string', required: false },
      { name: 'targetObjectType', type: 'string', required: false },
      { name: 'flagged', type: 'object', required: true },
    ],
    outputs: ['object'],
    description: '动作实现：境外涉密舆情事件命中后创建 EmergencyResponse，并通知当前操作人。',
    body: CREATE_EMERGENCY_RESPONSE_BODY,
    version: 1,
  },
  {
    apiName: 'initialCaseAssociation',
    displayName: '应急响应初始关联',
    language: 'typescript',
    entry: 'initialCaseAssociation',
    inputs: [
      { name: 'rule', type: 'string', required: false },
      { name: 'flagged', type: 'object', required: true },
    ],
    outputs: ['object'],
    description: '案件创建后：按事件标题/正文/文号匹配文档，生成待确认的 DocumentCandidate。',
    body: INITIAL_CASE_ASSOCIATION_BODY,
    version: 1,
  },
];

export const actions: ActionType[] = [
  {
    apiName: 'createEmergencyResponse',
    displayName: '创建应急响应案件',
    kind: 'standard',
    parameters: [],
    validationRules: [],
    effect: { kind: 'function', ref: 'createEmergencyResponse' },
    version: 1,
  },
  {
    apiName: 'initialCaseAssociation',
    displayName: '应急响应初始关联',
    kind: 'standard',
    parameters: [],
    validationRules: [],
    effect: { kind: 'function', ref: 'initialCaseAssociation' },
    version: 1,
  },
];

export const rules: AutomationRule[] = [
  {
    apiName: 'emergencyResponseCreateRule',
    displayName: '境外涉密舆情自动建案',
    description: '境外网站 + 机密/绝密 → 创建应急响应',
    enabled: true,
    trigger: { kind: 'event', on: 'object_write', objectType: 'PublicOpinionEvent' },
    condition: {
      kind: 'all',
      conditions: [
        { kind: 'property', objectType: 'PublicOpinionEvent', property: 'websiteRegion', operator: 'eq', value: '境外' },
        {
          kind: 'any',
          conditions: [
            { kind: 'property', objectType: 'PublicOpinionEvent', property: 'classificationLevel', operator: 'eq', value: '机密' },
            { kind: 'property', objectType: 'PublicOpinionEvent', property: 'classificationLevel', operator: 'eq', value: '绝密' },
          ],
        },
      ],
    },
    actionApiName: 'createEmergencyResponse',
    targetObjectType: 'EmergencyResponse',
    params: {},
    version: 1,
  },
  {
    apiName: 'emergencyInitialAssociationRule',
    displayName: '应急响应初始关联',
    description: '案件创建后匹配文档，生成待确认候选',
    enabled: true,
    trigger: { kind: 'event', on: 'object_write', objectType: 'EmergencyResponse' },
    condition: {
      kind: 'property', objectType: 'EmergencyResponse', property: 'status', operator: 'eq', value: 'in_progress',
    },
    actionApiName: 'initialCaseAssociation',
    targetObjectType: 'EmergencyResponse',
    params: {},
    version: 1,
  },
];
