import type { ObjectType, PropertyDef, PropertyType, LinkType } from '@ontology/ontology-core';

const V = 1;

function p(
  apiName: string,
  displayName: string,
  type: PropertyType = 'string',
  required = false,
  extra: Partial<PropertyDef> = {},
): PropertyDef {
  return { apiName, displayName, type, required, ...extra };
}

function enumProp(apiName: string, displayName: string, values: string[], required = false): PropertyDef {
  return p(apiName, displayName, 'string', required, {
    allowedValues: values.map((value) => ({ value, label: value })),
  });
}

function ot(
  apiName: string,
  displayName: string,
  description: string,
  properties: PropertyDef[],
  titleProperty = 'title',
): ObjectType {
  return {
    apiName, displayName, description, properties,
    implementsInterfaces: [], titleProperty, version: V, createdAt: '', updatedAt: '',
  };
}

function lt(
  apiName: string,
  displayName: string,
  sourceType: string,
  targetType: string,
  sourceCardinality: 'one' | 'many' = 'one',
  targetCardinality: 'one' | 'many' = 'many',
): LinkType {
  return {
    apiName, displayName, sourceType, targetType,
    sourceCardinality, targetCardinality,
    instanceSource: 'managed', version: V,
  };
}

export const objectTypes: ObjectType[] = [
  ot('PublicOpinionEvent', '舆情监控事件', '业务系统上报的舆情事件', [
    p('id', 'ID', 'string', true),
    p('eventId', '来源事件ID', 'string', true),
    p('sourceSystem', '来源系统', 'string', true),
    p('websiteName', '网站名称'),
    p('websiteUrl', '网站链接'),
    enumProp('websiteRegion', '网站属地', ['境外', '境内'], true),
    p('country', '国家/地区'),
    p('accountName', '发布账号'),
    p('accountId', '账号ID'),
    p('publishedAt', '发布时间', 'date'),
    p('title', '标题'),
    p('contentText', '正文', 'string'),
    p('language', '语言'),
    p('keywords', '关键词'),
    enumProp('classificationLevel', '涉密程度', ['公开', '内部', '秘密', '机密', '绝密'], true),
    enumProp('severity', '舆情等级', ['高', '中', '低']),
    p('attachments', '附件', 'array'),
    p('attachmentText', '附件文本'),
    p('discoveredAt', '发现时间', 'date'),
    p('rawPayload', '原始报文'),
  ]),

  ot('EmergencyResponse', '应急响应', '应急响应根对象', [
    p('id', 'ID', 'string', true),
    p('title', '标题', 'string', true),
    p('sourceEventId', '来源事件ID'),
    p('sourceEventRid', '来源事件'),
    p('sourceSystem', '来源系统'),
    p('level', '密级'),
    enumProp('status', '状态', ['in_progress', 'closed'], true),
    p('discoveredAt', '发现时间', 'timestamp'),
    p('startedAt', '开始时间', 'timestamp'),
    p('closedAt', '结束时间', 'timestamp'),
    enumProp('closureType', '结案类型', ['normal', 'midway', 'abnormal']),
    p('summary', '摘要'),
  ]),

  ot('Document', '文档', '文档库中的文档', [
    p('id', 'ID', 'string', true),
    p('docNo', '文号'),
    p('title', '标题', 'string', true),
    p('classificationLevel', '密级'),
    p('summary', '摘要'),
    p('contentText', '正文'),
    p('attachments', '附件', 'array'),
    p('issuedAt', '成文时间', 'date'),
    enumProp('sourceType', '来源', ['sync', 'manual']),
    p('externalId', '外部ID'),
    p('createdBy', '创建人'),
    p('originCaseId', '来源案件'),
  ]),

  ot('DispatchRecord', '收发文记录', '一次发送/接收记录', [
    p('id', 'ID', 'string', true),
    p('documentRid', '文档'),
    p('senderOrgRid', '发送单位'),
    p('receiverOrgRid', '接收单位'),
    p('sentAt', '发送时间', 'date'),
    p('receivedAt', '接收时间', 'date'),
    p('channel', '方式'),
    p('operator', '经办人'),
    p('remark', '备注'),
  ], 'id'),

  ot('BorrowRecord', '借阅记录', '单位内人员借阅文档', [
    p('id', 'ID', 'string', true),
    p('documentRid', '文档'),
    p('orgRid', '单位'),
    p('borrowerRid', '借阅人'),
    p('borrowedAt', '借出时间', 'date'),
    p('dueAt', '应归还时间', 'date'),
    p('returnedAt', '归还时间', 'date'),
    p('purpose', '借阅目的'),
    enumProp('status', '状态', ['borrowed', 'returned', 'overdue']),
    p('approver', '审批人'),
    p('remark', '备注'),
  ], 'id'),

  ot('TransferRecord', '转交记录', '私下转交行为', [
    p('id', 'ID', 'string', true),
    p('documentRid', '文档'),
    p('fromEmployeeRid', '转出人'),
    p('toEmployeeRid', '接收人'),
    p('transferredAt', '时间', 'date'),
    p('method', '方式'),
    p('note', '说明'),
  ], 'id'),

  ot('PublishRecord', '发布记录', '发布到网站的行为', [
    p('id', 'ID', 'string', true),
    p('documentRid', '文档'),
    p('publisherRid', '发布人'),
    p('websiteName', '网站'),
    p('url', '链接'),
    p('publishedAt', '发布时间', 'date'),
    p('content', '内容'),
  ], 'id'),

  ot('DocumentCandidate', '文档候选', '待专家确认的匹配文档', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('documentRid', '候选文档'),
    p('matchScore', '匹配度', 'float'),
    p('source', '来源'),
    enumProp('status', '状态', ['pending', 'accepted', 'rejected'], true),
    p('reason', '说明'),
  ], 'id'),

  ot('CaseEntityRef', '案件数据池成员', '案件引用的实体及纳入状态', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('entityRid', '实体'),
    p('entityType', '实体类型'),
    enumProp('status', '状态', ['included', 'watch', 'cleared', 'excluded'], true),
    p('addedBy', '加入人'),
    p('sourceType', '来源类型'),
    p('sourceRid', '来源记录'),
    p('reason', '原因'),
    p('confidence', '置信度', 'float'),
    p('layer', '层级', 'integer'),
    p('addedAt', '加入时间'),
    p('decidedBy', '处理人'),
    p('decidedAt', '处理时间'),
  ], 'id'),

  ot('VerificationTask', '核查任务', '单位自查任务', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('orgRid', '单位'),
    p('documentRids', '涉及文档', 'array'),
    enumProp('status', '状态', ['pending', 'in_progress', 'submitted'], true),
    p('reason', '原因'),
    p('source', '来源'),
    p('createdAt', '创建时间', 'timestamp'),
    p('receivedAt', '接收时间', 'timestamp'),
    p('submittedAt', '提交时间', 'timestamp'),
  ], 'id'),

  ot('VerificationResponse', '单位回复', '单位核查回复', [
    p('id', 'ID', 'string', true),
    p('taskRid', '任务'),
    p('orgRid', '单位'),
    p('contentText', '回复内容'),
    p('attachments', '附件', 'array'),
    p('submittedAt', '提交时间', 'timestamp'),
  ], 'id'),

  ot('InspectionTask', '检查任务', '检查部门执行的任务', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('orgRid', '单位'),
    p('documentRids', '涉及文档', 'array'),
    enumProp('status', '状态', ['pending', 'in_progress', 'submitted'], true),
    p('reason', '原因'),
    p('source', '来源'),
    p('createdAt', '创建时间', 'timestamp'),
    p('receivedAt', '接收时间', 'timestamp'),
    p('submittedAt', '提交时间', 'timestamp'),
  ], 'id'),

  ot('InspectionReport', '检查报告', '检查结果报告', [
    p('id', 'ID', 'string', true),
    p('taskRid', '任务'),
    p('orgRid', '单位'),
    p('contentText', '原文'),
    p('attachments', '附件', 'array'),
    p('summary', '摘要'),
    p('submittedAt', '提交时间', 'timestamp'),
  ], 'id'),

  ot('ExtractedEntity', '抽取候选实体', 'AI 从回复/报告中抽取的实体', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('sourceRid', '来源'),
    p('sourceType', '来源类型'),
    p('entityType', '实体类型'),
    p('rawText', '原文片段'),
    p('value', '抽取值'),
    p('matchedEntityRid', '匹配实体'),
    p('confidence', '置信度', 'float'),
    enumProp('status', '状态', ['pending', 'accepted', 'rejected'], true),
    p('createdByAction', '抽取Action'),
  ], 'id'),

  ot('ClosureReport', '结案报告', 'AI 草稿与专家最终稿', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('aiDraft', 'AI草稿'),
    p('finalText', '最终稿'),
    p('note', '备注'),
    p('attachments', '附件', 'array'),
    enumProp('closureType', '结案类型', ['normal', 'midway', 'abnormal']),
    p('createdAt', '创建时间', 'timestamp'),
    p('submittedAt', '提交时间', 'timestamp'),
  ], 'id'),

  ot('AnalysisRun', 'AI分析批次', '一次案件分析', [
    p('id', 'ID', 'string', true),
    p('caseRid', '案件'),
    p('scopeSnapshot', '范围快照', 'object'),
    p('summary', '摘要'),
    p('model', '模型'),
    p('createdAt', '时间', 'timestamp'),
  ], 'id'),

  ot('RiskFinding', '风险目标建议', 'AI/专家风险判断', [
    p('id', 'ID', 'string', true),
    p('analysisId', '分析批次'),
    p('targetRid', '目标'),
    p('targetType', '目标类型'),
    p('score', '分数', 'float'),
    p('level', '等级'),
    p('reasons', '理由'),
    p('evidenceRids', '证据', 'array'),
    enumProp('status', '状态', ['suggested', 'confirmed', 'dismissed']),
    p('createdAt', '时间', 'timestamp'),
  ], 'id'),
];

export const linkTypes: LinkType[] = [
  lt('EmergencyResponseSourceEvent', '来源事件', 'EmergencyResponse', 'PublicOpinionEvent'),
  lt('DispatchRecordDocument', '收发文文档', 'DispatchRecord', 'Document'),
  lt('DispatchRecordSender', '发送单位', 'DispatchRecord', 'Organization'),
  lt('DispatchRecordReceiver', '接收单位', 'DispatchRecord', 'Organization'),
  lt('BorrowRecordDocument', '借阅文档', 'BorrowRecord', 'Document'),
  lt('BorrowRecordOrg', '借阅单位', 'BorrowRecord', 'Organization'),
  lt('BorrowRecordBorrower', '借阅人', 'BorrowRecord', 'Employee'),
  lt('TransferRecordDocument', '转交文档', 'TransferRecord', 'Document'),
  lt('TransferRecordFrom', '转出人', 'TransferRecord', 'Employee'),
  lt('TransferRecordTo', '接收人', 'TransferRecord', 'Employee'),
  lt('PublishRecordDocument', '发布文档', 'PublishRecord', 'Document'),
  lt('PublishRecordPublisher', '发布人', 'PublishRecord', 'Employee'),
  lt('VerificationTaskCase', '核查任务案件', 'VerificationTask', 'EmergencyResponse'),
  lt('VerificationTaskOrg', '核查任务单位', 'VerificationTask', 'Organization'),
  lt('VerificationTaskDocument', '核查任务文档', 'VerificationTask', 'Document'),
  lt('VerificationResponseTask', '回复任务', 'VerificationResponse', 'VerificationTask'),
  lt('InspectionTaskCase', '检查任务案件', 'InspectionTask', 'EmergencyResponse'),
  lt('InspectionTaskOrg', '检查任务单位', 'InspectionTask', 'Organization'),
  lt('InspectionTaskDocument', '检查任务文档', 'InspectionTask', 'Document'),
  lt('InspectionReportTask', '检查报告任务', 'InspectionReport', 'InspectionTask'),
];
