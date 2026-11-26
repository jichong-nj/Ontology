import type { MetadataRepository } from '@ontology/ontology-core';
import { objectTypes, linkTypes } from './definitions';

export async function ensureEmergencyOntology(repo: MetadataRepository): Promise<void> {
  for (const ot of objectTypes) {
    const existing = await repo.getObjectType(ot.apiName);
    if (!existing) {
      await repo.createObjectType(ot);
      console.log(`[emergency] 对象类型已创建: ${ot.apiName}`);
    }
  }
  for (const lt of linkTypes) {
    const existing = await repo.getLinkType(lt.apiName);
    if (!existing) {
      await repo.createLinkType(lt);
      console.log(`[emergency] 关系类型已创建: ${lt.apiName}`);
    }
  }
}

async function ensureLink(
  repo: MetadataRepository,
  linkType: string,
  sourceRid: string,
  targetRid: string,
): Promise<void> {
  const rows = await repo.listLinkInstances(linkType, sourceRid);
  if (!rows.some((r) => r.targetRid === targetRid)) {
    await repo.createLinkInstance(linkType, sourceRid, targetRid);
  }
}

async function write(repo: MetadataRepository, objectType: string, rid: string, patch: Record<string, unknown>): Promise<void> {
  await repo.writeObjectPatch(objectType, rid, patch, 'seed:emergency');
}

// 插入演示数据：文档、收发文、借阅、舆情事件、一个进行中的应急响应
export async function seedEmergencyDemo(repo: MetadataRepository): Promise<void> {
  const orgs = (await repo.listInstances('Organization', { pageSize: 20 })).data;
  const employees = (await repo.listInstances('Employee', { pageSize: 20 })).data;
  if (!orgs.length || !employees.length) {
    console.warn('[emergency] 缺少 Organization/Employee 演示数据，跳过 seed');
    return;
  }
  const orgA = orgs[0], orgB = orgs[1 % orgs.length], orgC = orgs[2 % orgs.length];
  const empA = employees[0], empB = employees[1 % employees.length];

  await write(repo, 'Document', 'DOC-2026-001', {
    id: 'DOC-2026-001', docNo: '机要〔2026〕12号', title: '境外机构专项情况通报',
    classificationLevel: '机密', summary: '某境外机构关注的重点领域情况通报。',
    contentText: '通报涉及某重点领域风险排查情况，附相关单位名单和工作要求。',
    attachments: [], issuedAt: '2026-11-18', sourceType: 'sync', externalId: 'DOC-2026-001',
  });
  await write(repo, 'Document', 'DOC-2026-002', {
    id: 'DOC-2026-002', docNo: '绝密〔2026〕07号', title: '重点领域风险排查材料',
    classificationLevel: '绝密', summary: '重点领域风险排查工作材料。',
    contentText: '材料包含重点单位排查结论和线索清单。',
    attachments: [], issuedAt: '2026-11-20', sourceType: 'sync', externalId: 'DOC-2026-002',
  });

  await write(repo, 'DispatchRecord', 'DR-2026-001', {
    id: 'DR-2026-001', documentRid: 'Document:DOC-2026-001',
    senderOrgRid: orgA.objectRid, receiverOrgRid: orgB.objectRid,
    sentAt: '2026-11-19', receivedAt: '2026-11-19', channel: '机要', operator: '机要员',
  });
  await write(repo, 'DispatchRecord', 'DR-2026-002', {
    id: 'DR-2026-002', documentRid: 'Document:DOC-2026-001',
    senderOrgRid: orgB.objectRid, receiverOrgRid: orgC.objectRid,
    sentAt: '2026-11-20', receivedAt: '2026-11-20', channel: '机要', operator: '机要员',
  });
  await write(repo, 'DispatchRecord', 'DR-2026-003', {
    id: 'DR-2026-003', documentRid: 'Document:DOC-2026-002',
    senderOrgRid: orgA.objectRid, receiverOrgRid: orgC.objectRid,
    sentAt: '2026-11-21', receivedAt: '2026-11-21', channel: '专送', operator: '专送员',
  });

  await write(repo, 'BorrowRecord', 'BR-2026-001', {
    id: 'BR-2026-001', documentRid: 'Document:DOC-2026-001', orgRid: orgB.objectRid,
    borrowerRid: empA.objectRid, borrowedAt: '2026-11-20', dueAt: '2026-11-27',
    returnedAt: '2026-11-22', purpose: '专项工作查阅', status: 'returned', approver: '办公室主任',
  });
  await write(repo, 'BorrowRecord', 'BR-2026-002', {
    id: 'BR-2026-002', documentRid: 'Document:DOC-2026-002', orgRid: orgC.objectRid,
    borrowerRid: empB.objectRid, borrowedAt: '2026-11-22', dueAt: '2026-11-29',
    purpose: '风险排查', status: 'borrowed', approver: '部门负责人',
  });

  await write(repo, 'PublicOpinionEvent', 'POE-2026-001', {
    id: 'POE-2026-001', eventId: 'POE-2026-001', sourceSystem: '舆情监控',
    websiteName: '某境外网站', websiteUrl: 'https://example-overseas.test/post/1',
    websiteRegion: '境外', country: 'US', accountName: 'anonymous_1', accountId: 'acc-1',
    publishedAt: '2026-11-24', title: '疑似涉密文件被发布',
    contentText: '该网站发布了一份疑似机要〔2026〕12号文件的内容截图。',
    language: 'zh', keywords: '涉密,文件,境外', classificationLevel: '机密', severity: '高',
    attachments: [{ name: 'screenshot.png', type: 'image/png' }],
    attachmentText: '截图显示机要〔2026〕12号文件标题及部分正文。',
    discoveredAt: '2026-11-24',
  });
  await write(repo, 'PublicOpinionEvent', 'POE-2026-002', {
    id: 'POE-2026-002', eventId: 'POE-2026-002', sourceSystem: '舆情监控',
    websiteName: '某境内网站', websiteUrl: 'https://example-domestic.test/post/2',
    websiteRegion: '境内', country: 'CN', accountName: 'user_2', accountId: 'acc-2',
    publishedAt: '2026-11-24', title: '一般工作动态', contentText: '一般工作动态，不涉密。',
    language: 'zh', keywords: '动态', classificationLevel: '秘密', severity: '低',
    attachments: [], discoveredAt: '2026-11-24',
  });

  // 演示用：直接建一个进行中的应急响应（后续由 A0 automation 自动创建）
  await write(repo, 'EmergencyResponse', 'ER-2026-001', {
    id: 'ER-2026-001', title: '疑似涉密文件境外发布', sourceEventId: 'POE-2026-001',
    sourceEventRid: 'PublicOpinionEvent:POE-2026-001', sourceSystem: '舆情监控',
    level: '机密', status: 'in_progress', discoveredAt: '2026-11-24T09:00:00Z',
    startedAt: '2026-11-24T09:00:00Z', summary: '境外网站发布疑似机要文件，已启动应急响应。',
  });
  await ensureLink(repo, 'EmergencyResponseSourceEvent', 'EmergencyResponse:ER-2026-001', 'PublicOpinionEvent:POE-2026-001');

  const refs: Array<[string, string, string]> = [
    ['CER-001', 'Document:DOC-2026-001', 'Document'],
    ['CER-002', orgA.objectRid, 'Organization'],
    ['CER-003', orgB.objectRid, 'Organization'],
    ['CER-004', orgC.objectRid, 'Organization'],
    ['CER-005', empA.objectRid, 'Employee'],
    ['CER-006', empB.objectRid, 'Employee'],
  ];
  for (const [id, entityRid, entityType] of refs) {
    await write(repo, 'CaseEntityRef', id, {
      id, caseRid: 'EmergencyResponse:ER-2026-001', entityRid, entityType,
      status: 'included', addedBy: 'system', sourceType: 'manual',
      reason: '演示数据初始化', addedAt: '2026-11-24T09:00:00Z',
    });
  }

  await write(repo, 'DocumentCandidate', 'DC-001', {
    id: 'DC-001', caseRid: 'EmergencyResponse:ER-2026-001', documentRid: 'Document:DOC-2026-002',
    matchScore: 0.82, source: 'search', status: 'pending', reason: '标题/正文命中',
  });

  await write(repo, 'VerificationTask', 'VT-2026-001', {
    id: 'VT-2026-001', caseRid: 'EmergencyResponse:ER-2026-001', orgRid: orgB.objectRid,
    documentRids: ['Document:DOC-2026-001'], status: 'pending', reason: '文档接收单位核查',
    source: 'rule', createdAt: '2026-11-24T09:05:00Z',
  });
  await ensureLink(repo, 'VerificationTaskCase', 'VerificationTask:VT-2026-001', 'EmergencyResponse:ER-2026-001');
  await ensureLink(repo, 'VerificationTaskOrg', 'VerificationTask:VT-2026-001', orgB.objectRid);
  await ensureLink(repo, 'VerificationTaskDocument', 'VerificationTask:VT-2026-001', 'Document:DOC-2026-001');

  await write(repo, 'InspectionTask', 'IT-2026-001', {
    id: 'IT-2026-001', caseRid: 'EmergencyResponse:ER-2026-001', orgRid: orgC.objectRid,
    documentRids: ['Document:DOC-2026-002'], status: 'pending', reason: '专家发起检查',
    source: 'expert', createdAt: '2026-11-24T09:10:00Z',
  });
  await ensureLink(repo, 'InspectionTaskCase', 'InspectionTask:IT-2026-001', 'EmergencyResponse:ER-2026-001');
  await ensureLink(repo, 'InspectionTaskOrg', 'InspectionTask:IT-2026-001', orgC.objectRid);
  await ensureLink(repo, 'InspectionTaskDocument', 'InspectionTask:IT-2026-001', 'Document:DOC-2026-002');

  // 文档端点关系
  for (const [id, doc, sender, receiver] of [
    ['DR-2026-001', 'Document:DOC-2026-001', orgA.objectRid, orgB.objectRid],
    ['DR-2026-002', 'Document:DOC-2026-001', orgB.objectRid, orgC.objectRid],
    ['DR-2026-003', 'Document:DOC-2026-002', orgA.objectRid, orgC.objectRid],
  ]) {
    await ensureLink(repo, 'DispatchRecordDocument', `DispatchRecord:${id}`, doc);
    await ensureLink(repo, 'DispatchRecordSender', `DispatchRecord:${id}`, sender);
    await ensureLink(repo, 'DispatchRecordReceiver', `DispatchRecord:${id}`, receiver);
  }
  await ensureLink(repo, 'BorrowRecordDocument', 'BorrowRecord:BR-2026-001', 'Document:DOC-2026-001');
  await ensureLink(repo, 'BorrowRecordOrg', 'BorrowRecord:BR-2026-001', orgB.objectRid);
  await ensureLink(repo, 'BorrowRecordBorrower', 'BorrowRecord:BR-2026-001', empA.objectRid);
  await ensureLink(repo, 'BorrowRecordDocument', 'BorrowRecord:BR-2026-002', 'Document:DOC-2026-002');
  await ensureLink(repo, 'BorrowRecordOrg', 'BorrowRecord:BR-2026-002', orgC.objectRid);
  await ensureLink(repo, 'BorrowRecordBorrower', 'BorrowRecord:BR-2026-002', empB.objectRid);

  console.log('[emergency] 演示数据已写入');
}

export { objectTypes, linkTypes };
