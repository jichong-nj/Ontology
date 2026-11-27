<script setup lang="ts">
import { onMounted, ref, reactive, computed, nextTick } from 'vue';
import { ElCard, ElButton, ElIcon, ElTag, ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSwitch, ElSelect, ElOption, ElMessageBox, ElTable, ElTableColumn, ElCollapse, ElCollapseItem } from 'element-plus';
import { Refresh, Bell, Plus, Edit, Delete, Switch as SwitchIcon } from '@element-plus/icons-vue';
import { s2, s2functions, s2actions } from '@/api';
import RuleExpressionBuilder from '@/components/RuleExpressionBuilder.vue';
import { tryRequest } from '@/utils/error';

interface RuleItem {
  apiName: string;
  displayName: string;
  enabled: boolean;
  trigger: { kind: 'schedule' | 'event'; intervalSeconds?: number; cron?: string; on?: string; objectType?: string; conditionProperty?: string; debounceMs?: number; batchMode?: 'per_rid' | 'per_type'; changeTypes?: string[]; changeFields?: string[]; scope?: 'object' | 'type'; evaluationMode?: 'live' | 'scheduled' };
  conditionFunction?: string;
  condition?: any;
  actionApiName?: string;
  effects?: any[];
  execution?: any;
  description?: string;
  params: Record<string, unknown>;
  targetObjectType: string;
  version: number;
}
interface FnInput { name: string; type: string; required: boolean }

// 规则中心：通用自动化规则（满足条件→执行动作），当前动作产物之一为告警对象
const rules = ref<RuleItem[]>([]);
const functions = ref<{ apiName: string; displayName: string; inputs?: FnInput[]; description?: string }[]>([]);
const actions = ref<{ apiName: string; displayName: string; preconditions?: { kind: string; property: string; message: string }[] }[]>([]);
const objectTypes = ref<{ apiName: string; displayName: string; properties?: { apiName: string; displayName: string; type: string }[] }[]>([]);
const loading = ref(false);
const running = ref(false);

// 条件函数参数「可视化表单」：根据所选函数的 inputs 元数据自动生成控件，降低 FDE 门槛
const selectedFnInputs = computed<FnInput[]>(() => {
  const fn = functions.value.find((f) => f.apiName === form.conditionFunction);
  return fn?.inputs ?? [];
});

// 所选 Action 的内嵌校验规则（Action 自带 rules，透明展示给 FDE）
const selectedActionPreconditions = computed<any[]>(() => {
  const a = actions.value.find((x) => x.apiName === form.actionApiName);
  return a?.preconditions ?? [];
});
function preconditionText(pc: any): string {
  const map: Record<string, string> = {
    requiredProperty: `必须含属性 ${pc.property}`,
    notEmpty: `${pc.property} 不可为空`,
    minValue: `${pc.property} ≥ ${pc.value}`,
    maxValue: `${pc.property} ≤ ${pc.value}`,
  };
  return `${map[pc.kind] ?? pc.kind}（${pc.message}）`;
}

// 新建/编辑抽屉
const dialogVisible = ref(false);
const editing = ref<string | null>(null); // null=新建
const saving = ref(false);
const form = reactive({
  apiName: '',
  displayName: '',
  enabled: true,
  triggerKind: 'schedule' as 'schedule' | 'event',
  triggerMode: 'interval' as 'interval' | 'cron',
  intervalSeconds: 60,
  cron: '',
  eventObjectType: '',
  debounceMs: 1000,
  batchMode: 'per_rid' as 'per_rid' | 'per_type',
  changeTypes: ['created', 'updated'] as string[],
  changeFields: '',
  scope: 'object' as 'object' | 'type',
  evaluationMode: 'live' as 'live' | 'scheduled',
  conditionFunction: '',
  actionApiName: '',
  effects: [] as any[],
  execMode: 'sequential' as 'sequential' | 'parallel',
  maxRetries: 1,
  timeoutMs: 15000,
  cooldownSeconds: 0,
  chainDepthLimit: 5,
  description: '',
  targetObjectType: 'Alert',
  // 参数有两种编辑视图：结构化表单(paramsForm) 与 高级 JSON(paramsText)，双向同步
  paramsText: '{\n  "threshold": 0.8,\n  "leaveDeduct": 10,\n  "workDeduct": 10,\n  "leaveBase": 1\n}',
});

// 条件：函数 / 表达式（表达式支持属性/聚合比较与 AND/OR 嵌套）
const condKind = ref<'function' | 'expression'>('function');
const expr = ref<any>(null);

function effectSummary(r: RuleItem): string[] {
  const list = r.effects?.length ? r.effects : (r.actionApiName ? [{ kind: 'action', actionApiName: r.actionApiName }] : []);
  return list.map((e: any) => {
    if (e.kind === 'action') return `action:${e.actionApiName}`;
    if (e.kind === 'function') return `fn:${e.function}`;
    if (e.kind === 'webhook') return `webhook:${e.url}`;
    if (e.kind === 'notify') return `notify:${e.channel}`;
    return e.kind;
  });
}
function addEffect(kind = 'action') {
  if (kind === 'action') form.effects.push({ kind, actionApiName: actions.value[0]?.apiName ?? '', retryMaxAttempts: 1, fallbackKind: '' });
  else if (kind === 'function') form.effects.push({ kind, function: functions.value[0]?.apiName ?? '', retryMaxAttempts: 1, fallbackKind: '' });
  else if (kind === 'notify') form.effects.push({ kind, channel: 'inapp', title: '', body: '', level: 'info', retryMaxAttempts: 1, fallbackKind: '' });
  else form.effects.push({ kind, url: '', method: 'POST', retryMaxAttempts: 1, fallbackKind: '' });
}
function removeEffect(i: number) { form.effects.splice(i, 1); }

function effectToForm(e: any): any {
  return {
    ...e,
    retryMaxAttempts: e?.retry?.maxAttempts ?? 1,
    fallbackKind: e?.fallback?.kind ?? '',
    fallbackTitle: e?.fallback?.title ?? '',
    fallbackUrl: e?.fallback?.url ?? e?.fallback?.webhookUrl ?? '',
  };
}

function effectsForForm(effects: any[] | undefined): any[] {
  return (effects ?? []).map(effectToForm);
}

function effectsPayload(): any[] {
  return form.effects.map((e: any) => {
    const { retryMaxAttempts, fallbackKind, fallbackTitle, fallbackUrl, ...rest } = e;
    const out: any = { ...rest };
    if (Number(retryMaxAttempts) > 0) out.retry = { maxAttempts: Number(retryMaxAttempts) };
    else delete out.retry;
    if (fallbackKind === 'notify') out.fallback = { kind: 'notify', channel: 'inapp', title: fallbackTitle || `${form.displayName || form.apiName} 失败回退` };
    else if (fallbackKind === 'webhook') out.fallback = { kind: 'webhook', url: fallbackUrl };
    else delete out.fallback;
    return out;
  });
}

function propsOf(apiName: string) {
  return objectTypes.value.find((o) => o.apiName === apiName)?.properties ?? [];
}
function parseCondValue(v: string): unknown {
  const t = (v ?? '').trim();
  if (t === '') return '';
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (t === 'true' || t === 'false') return t === 'true';
  return t;
}
function fillCondition(cond?: any) {
  if (cond && ['property', 'aggregate', 'all', 'any'].includes(cond.kind)) {
    condKind.value = 'expression';
    expr.value = cond;
  } else {
    condKind.value = 'function';
    expr.value = null;
  }
}
function normalizeNode(n: any): any {
  if (!n) return n;
  if (n.kind === 'all' || n.kind === 'any') {
    return { kind: n.kind, conditions: (n.conditions ?? []).map(normalizeNode) };
  }
  if (n.kind === 'aggregate') {
    const aggregation = n.aggregation ?? 'count';
    return {
      kind: 'aggregate', objectType: n.objectType, aggregation,
      ...(aggregation !== 'count' && n.property ? { property: n.property } : {}),
      operator: n.operator ?? 'gt', value: Number(n.value),
    };
  }
  return { kind: 'property', objectType: n.objectType, property: n.property, operator: n.operator ?? 'gt', value: parseCondValue(String(n.value ?? '')) };
}
function conditionPayload(): any {
  return condKind.value === 'expression' ? normalizeNode(expr.value) : null;
}
function exprPropNode(): { objectType: string; property: string } | null {
  const walk = (n: any): any => {
    if (!n) return null;
    if (n.kind === 'property' && n.property) return n;
    if (n.kind === 'all' || n.kind === 'any') {
      for (const c of n.conditions ?? []) {
        const r = walk(c);
        if (r) return r;
      }
    }
    return null;
  };
  return walk(expr.value);
}
function exprPropLabel(): string {
  const n = exprPropNode();
  if (!n) return '';
  return propsOf(n.objectType).find((p) => p.apiName === n.property)?.displayName ?? n.property;
}

const paramsForm = reactive<Record<string, string>>({}); // 表单视图：键=input.name, 值=字符串
const showJson = ref(false); // 是否展开高级 JSON 编辑
const paramsError = ref('');
const previewResult = ref<{ count: number; items: any[] } | null>(null);
// 预览表格按命中项实际字段决定列，避免出现整列空值
function previewHasField(fields: string[]): boolean {
  const items = previewResult.value?.items ?? [];
  return items.some((it) => fields.some((f) => it?.[f] !== undefined && it?.[f] !== null && it?.[f] !== ''));
}

const previewing = ref(false);
// 运行历史
const runsVisible = ref(false);
const runsTitle = ref('');
const runs = ref<any[]>([]);
const runsLoading = ref(false);

async function openRuns(r: RuleItem) {
  runsTitle.value = `运行历史 · ${r.apiName}`;
  runsVisible.value = true;
  runsLoading.value = true;
  try {
    runs.value = await s2.listAutomationRuns(r.apiName, 100);
  } catch (e: any) {
    ElMessage.error(e.message || '加载运行历史失败');
    runs.value = [];
  } finally {
    runsLoading.value = false;
  }
}
function fmtRunTime(v?: string): string {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
}
function runStatusType(s: string): 'success' | 'warning' | 'danger' | 'info' {
  return s === 'succeeded' ? 'success' : s === 'partial' ? 'warning' : s === 'failed' ? 'danger' : 'info';
}

// 规则参数查看
const paramsViewVisible = ref(false);
const paramsViewTitle = ref('');
const paramsViewText = ref('');

function paramValueText(v: any): string {
  if (v === null || v === undefined) return '—';
  if (Array.isArray(v)) return `[${v.length} 项]`;
  if (typeof v === 'object') return `{${Object.keys(v).length} 项}`;
  const s = String(v);
  return s.length > 20 ? `${s.slice(0, 20)}…` : s;
}
function paramTags(params: any): Array<{ key: string; value: string }> {
  return Object.entries(params ?? {}).slice(0, 2).map(([key, value]) => ({ key, value: paramValueText(value) }));
}
function paramCount(params: any): number {
  return Object.keys(params ?? {}).length;
}
function openParams(r: RuleItem) {
  paramsViewTitle.value = `规则参数 · ${r.apiName}`;
  paramsViewText.value = JSON.stringify(r.params ?? {}, null, 2);
  paramsViewVisible.value = true;
}
async function copyParams() {
  try {
    await navigator.clipboard.writeText(paramsViewText.value);
    ElMessage.success('已复制');
  } catch {
    ElMessage.warning('复制失败，请手动选择');
  }
}


// 将结构化表单值写入 paramsText（数字类型按类型转换，其余保持字符串/原样）
function syncParamsFromForm() {
  const obj: Record<string, unknown> = {};
  for (const inp of selectedFnInputs.value) {
    const raw = paramsForm[inp.name];
    if (raw === undefined || raw === '') continue;
    obj[inp.name] = inp.type === 'integer' || inp.type === 'float' ? Number(raw) : raw;
  }
  form.paramsText = JSON.stringify(obj, null, 2);
}
// 将 paramsText 解析回填结构化表单（打开编辑或切换函数时调用）
function syncFormFromParams() {
  for (const k of Object.keys(paramsForm)) delete paramsForm[k];
  let parsed: Record<string, unknown> = {};
  try { parsed = JSON.parse(form.paramsText || '{}'); } catch { parsed = {}; }
  for (const inp of selectedFnInputs.value) {
    paramsForm[inp.name] = parsed[inp.name] !== undefined ? String(parsed[inp.name]) : '';
  }
}

async function load() {
  await tryRequest(async () => {
    const [r, f, ac, ot] = await Promise.all([
      s2.listAutomations(),
      s2functions.list(),
      s2actions.list(),
      s2.listObjectTypes(),
    ]);
    rules.value = r;
    functions.value = f.map((x: any) => ({
      apiName: x.apiName,
      displayName: x.displayName ?? x.apiName,
      inputs: Array.isArray(x.inputs) ? x.inputs : [],
      description: x.description ?? '',
    }));
    actions.value = ac.map((x: any) => ({ apiName: x.apiName, displayName: x.displayName ?? x.apiName, preconditions: x.preconditions ?? [] }));
    objectTypes.value = ot.map((x: any) => ({ apiName: x.apiName, displayName: x.displayName ?? x.apiName, properties: x.properties ?? [] }));
  });
}

function triggerLabel(r: RuleItem): string {
  if (r.trigger.kind === 'schedule') return r.trigger.cron ? `cron ${r.trigger.cron}` : `周期 ${r.trigger.intervalSeconds ?? '-'}s`;
  if (r.trigger.kind === 'event') return `事件: 写入 ${r.trigger.objectType ?? '?'}`;
  return r.trigger.kind;
}

async function runRules() {
  running.value = true;
  await tryRequest(async () => {
    const res = await s2.runRules();
    const results = (res.results ?? []) as any[];
    const total = results.reduce((s: number, x: any) => s + (x.actionsInvoked ?? 0), 0);
    const skipped = results.reduce((s: number, x: any) => s + (x.skippedByPrecondition ?? 0), 0);
    let msg = `规则执行完成，触发 ${total} 个动作`;
    if (skipped > 0) msg += `，${skipped} 条因未通过动作内嵌校验被跳过`;
    ElMessage.success(msg);
    await load();
  });
  running.value = false;
}

function openCreate() {
  editing.value = null;
  Object.assign(form, {
    apiName: '',
    displayName: '',
    enabled: true,
    triggerKind: 'schedule',
    intervalSeconds: 60,
    eventObjectType: objectTypes.value[0]?.apiName ?? '',
    debounceMs: 1000,
    batchMode: 'per_rid',
    changeTypes: ['created', 'updated'],
    changeFields: '',
    scope: 'object',
    evaluationMode: 'live',
    conditionFunction: functions.value[0]?.apiName ?? '',
    actionApiName: actions.value[0]?.apiName ?? '',
    effects: actions.value[0] ? [effectToForm({ kind: 'action', actionApiName: actions.value[0].apiName })] : [],
    triggerMode: 'interval',
    cron: '',
    execMode: 'sequential',
    maxRetries: 1,
    timeoutMs: 15000,
    cooldownSeconds: 0,
    chainDepthLimit: 5,
    description: '',
    targetObjectType: 'Alert',
    paramsText: '{\n  "threshold": 0.8\n}',
  });
  fillCondition(undefined);
  paramsError.value = '';
  dialogVisible.value = true;
  syncFormFromParams(); // 用所选函数(inputs)与默认 params 初始化结构化表单
}

async function openEdit(rule: RuleItem) {
  editing.value = rule.apiName;
  Object.assign(form, {
    apiName: rule.apiName,
    displayName: rule.displayName,
    enabled: rule.enabled,
    triggerKind: rule.trigger.kind,
    intervalSeconds: rule.trigger.intervalSeconds ?? 60,
    eventObjectType: rule.trigger.objectType ?? objectTypes.value[0]?.apiName ?? '',
    debounceMs: rule.trigger.debounceMs ?? 1000,
    batchMode: rule.trigger.batchMode ?? 'per_rid',
    changeTypes: rule.trigger.changeTypes ?? ['created', 'updated'],
    changeFields: (rule.trigger.changeFields ?? []).join(','),
    scope: rule.trigger.scope ?? 'object',
    evaluationMode: rule.trigger.evaluationMode ?? 'live',
    conditionFunction: rule.conditionFunction,
    actionApiName: rule.actionApiName ?? '',
    effects: rule.effects?.length ? effectsForForm(JSON.parse(JSON.stringify(rule.effects))) : (rule.actionApiName ? [effectToForm({ kind: 'action', actionApiName: rule.actionApiName })] : []),
    triggerMode: rule.trigger?.cron ? 'cron' : 'interval',
    cron: rule.trigger?.cron ?? '',
    execMode: rule.execution?.mode ?? 'sequential',
    maxRetries: rule.execution?.maxRetries ?? 1,
    timeoutMs: rule.execution?.timeoutMs ?? 15000,
    cooldownSeconds: rule.execution?.cooldownSeconds ?? 0,
    chainDepthLimit: rule.execution?.chainDepthLimit ?? 5,
    description: rule.description ?? '',
    targetObjectType: rule.targetObjectType,
    paramsText: JSON.stringify(rule.params ?? {}, null, 2),
  });
  fillCondition(rule.condition);
  paramsError.value = '';
  dialogVisible.value = true;
  syncFormFromParams(); // 用规则已存 params 回填结构化表单
}

async function save() {
  // 校验 params 必须是合法 JSON 对象（结构化表单视图下，先同步回 paramsText）
  if (!showJson.value) syncParamsFromForm();
  let params: Record<string, unknown> = {};
  paramsError.value = '';
  try {
    const parsed = JSON.parse(form.paramsText);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) params = parsed;
    else paramsError.value = 'params 必须是 JSON 对象';
  } catch (e: any) {
    paramsError.value = 'params 不是合法 JSON：' + e.message;
  }
  if (paramsError.value) return;
  if (!form.apiName.trim()) { paramsError.value = '规则名(apiName)必填'; return; }
  if (condKind.value === 'function' && !form.conditionFunction) { paramsError.value = '请选择条件函数'; return; }
  if (condKind.value === 'expression' && !expr.value) { paramsError.value = '请配置表达式条件'; return; }
  if (!form.effects.length) { paramsError.value = '请至少配置一个效果'; return; }
  for (const e of form.effects) {
    if (e.kind === 'action' && !e.actionApiName) { paramsError.value = 'action 效果需要选择动作'; return; }
    if (e.kind === 'function' && !e.function) { paramsError.value = 'function 效果需要选择函数'; return; }
    if (e.kind === 'webhook' && !e.url) { paramsError.value = 'webhook 效果需要填写 URL'; return; }
  }

  const trigger =
    form.triggerKind === 'schedule'
      ? { kind: 'schedule' as const, intervalSeconds: Number(form.intervalSeconds) }
      : {
          kind: 'event' as const, on: 'object_write' as const, objectType: form.eventObjectType,
          debounceMs: Number(form.debounceMs), batchMode: form.batchMode,
          changeTypes: form.changeTypes,
          changeFields: form.changeFields.split(',').map((x) => x.trim()).filter(Boolean),
          scope: form.scope,
          evaluationMode: form.evaluationMode,
        };

  saving.value = true;
  await tryRequest(async () => {
    if (editing.value) {
      await s2.updateAutomation(editing.value, {
        displayName: form.displayName,
        enabled: form.enabled,
        trigger,
        condition: conditionPayload(),
        ...(condKind.value === 'function' ? { conditionFunction: form.conditionFunction } : { conditionFunction: null }),
        effects: effectsPayload(),
        execution: { mode: form.execMode, maxRetries: Number(form.maxRetries), timeoutMs: Number(form.timeoutMs), cooldownSeconds: Number(form.cooldownSeconds), chainDepthLimit: Number(form.chainDepthLimit) },
        description: form.description,
        actionApiName: form.effects.find((e: any) => e.kind === 'action')?.actionApiName ?? null,
        targetObjectType: form.targetObjectType,
        params,
      } as any);
      ElMessage.success('规则已更新');
    } else {
      await s2.createAutomation({
        apiName: form.apiName.trim(),
        displayName: form.displayName || form.apiName.trim(),
        enabled: form.enabled,
        trigger,
        ...(condKind.value === 'function'
          ? { conditionFunction: form.conditionFunction }
          : { condition: conditionPayload() }),
        effects: effectsPayload(),
        execution: { mode: form.execMode, maxRetries: Number(form.maxRetries), timeoutMs: Number(form.timeoutMs), cooldownSeconds: Number(form.cooldownSeconds), chainDepthLimit: Number(form.chainDepthLimit) },
        description: form.description,
        actionApiName: form.effects.find((e: any) => e.kind === 'action')?.actionApiName ?? null,
        targetObjectType: form.targetObjectType,
        params,
        version: 1,
      } as any);
      ElMessage.success('规则已创建');
    }
    dialogVisible.value = false;
    await load();
  });
  saving.value = false;
}

// 预览条件函数命中：调用 function invoke 并展示将命中的对象（对标 Palantir 的 preview rule results）
async function previewRule() {
  if (!showJson.value) syncParamsFromForm();
  let params: Record<string, unknown> = {};
  try { params = JSON.parse(form.paramsText || '{}'); } catch { ElMessage.warning('params 不是合法 JSON'); return; }
  previewing.value = true;
  previewResult.value = null;
  await tryRequest(async () => {
    if (condKind.value === 'function') {
      if (!form.conditionFunction) { ElMessage.warning('请先选择条件函数'); return; }
      const res = await s2functions.invoke(form.conditionFunction, params);
      const result = (res as any).result ?? res;
      const flagged = Array.isArray(result?.flagged) ? result.flagged : [];
      previewResult.value = { count: flagged.length, items: flagged.slice(0, 20) };
    } else {
      const res = await s2.previewRuleCondition(conditionPayload(), params);
      previewResult.value = { count: res.count, items: res.items ?? [] };
    }
    await nextTick();
    document.querySelector('.preview')?.scrollIntoView({ block: 'nearest' });
  });
  previewing.value = false;
}

async function toggleEnabled(rule: RuleItem) {
  await tryRequest(async () => {
    await s2.updateAutomation(rule.apiName, { enabled: !rule.enabled });
    ElMessage.success(rule.enabled ? '已禁用' : '已启用');
    await load();
  });
}

async function removeRule(rule: RuleItem) {
  await ElMessageBox.confirm(
    `确定删除自动化规则「${rule.displayName}」(${rule.apiName}) 吗？此操作不可撤销。`,
    '删除确认',
    { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
  ).then(async () => {
    await tryRequest(async () => {
      await s2.deleteAutomation(rule.apiName);
      ElMessage.success('已删除');
      await load();
    });
  }).catch(() => {});
}

onMounted(load);
</script>

<template>
  <div class="alerts">
    <header class="page-head">
      <div>
        <h2 class="page-title"><ElIcon><Bell /></ElIcon> Automation</h2>
        <p class="page-sub">自动化：触发 → 条件 → 效果（动作 / 函数 / 通知 / Webhook）。</p>
      </div>
      <div class="page-actions">
        <ElButton :loading="loading" @click="load"><ElIcon><Refresh /></ElIcon> 刷新</ElButton>
        <ElButton type="warning" :loading="running" @click="runRules">运行全部规则</ElButton>
        <ElButton type="primary" @click="openCreate"><ElIcon><Plus /></ElIcon> 新建 Automation</ElButton>
      </div>
    </header>

    <ElCard class="alerts__rules" shadow="never">
      <template #header><span class="card-title">Automation（触发 → 条件 → 效果 · 可自助配置）</span></template>
      <table class="rule-table">
        <thead><tr><th>规则</th><th>启用</th><th>触发器</th><th>条件函数</th><th>效果</th><th>参数</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rules" :key="r.apiName">
            <td class="mono">{{ r.apiName }}<div class="sub">{{ r.displayName }}</div></td>
            <td><ElTag :type="r.enabled ? 'success' : 'info'" size="small">{{ r.enabled ? '启用' : '禁用' }}</ElTag></td>
            <td>
              <ElTag :type="r.trigger?.kind === 'schedule' ? 'info' : 'warning'" size="small">{{ triggerLabel(r) }}</ElTag>
            </td>
            <td class="mono">{{ r.conditionFunction }}</td>
            <td>
              <div class="effect-cell">
                <ElTag v-for="(e, ei) in effectSummary(r)" :key="ei" size="small" type="info" class="effect-tag">{{ e }}</ElTag>
                <span v-if="!effectSummary(r).length" class="muted">—</span>
              </div>
            </td>
            <td class="params">
              <div v-if="paramCount(r.params)" class="param-cell">
                <ElTag v-for="p in paramTags(r.params)" :key="p.key" size="small" class="param-tag">{{ p.key }}={{ p.value }}</ElTag>
                <ElTag v-if="paramCount(r.params) > 2" size="small" type="info" class="param-more">+{{ paramCount(r.params) - 2 }}</ElTag>
                <ElButton link type="primary" size="small" @click="openParams(r)">查看</ElButton>
              </div>
              <span v-else class="muted">—</span>
            </td>
            <td class="ops">
              <ElButton link type="primary" :icon="SwitchIcon" @click="toggleEnabled(r)">{{ r.enabled ? '禁用' : '启用' }}</ElButton>
              <ElButton link type="primary" @click="openRuns(r)">历史</ElButton>
              <ElButton link type="primary" :icon="Edit" @click="openEdit(r)">编辑</ElButton>
              <ElButton link type="danger" :icon="Delete" @click="removeRule(r)">删除</ElButton>
            </td>
          </tr>
          <tr v-if="rules.length === 0"><td colspan="7" class="empty">暂无规则，点击右上角「新建规则」</td></tr>
        </tbody>
      </table>
    </ElCard>

    <!-- 新建 / 编辑 Automation -->
    <ElDialog v-model="dialogVisible" :title="editing ? '编辑 Automation' : '新建 Automation'" width="800px">
      <ElForm label-width="110px">
        <ElFormItem label="规则名" required>
          <ElInput v-model="form.apiName" :disabled="!!editing" placeholder="如 dimissionRiskRule" />
        </ElFormItem>
        <ElFormItem label="显示名称">
          <ElInput v-model="form.displayName" placeholder="如 离职风险定时巡检" />
        </ElFormItem>
        <ElFormItem label="启用">
          <ElSwitch v-model="form.enabled" />
        </ElFormItem>
        <ElFormItem label="触发器类型">
          <ElRadioGroup v-model="form.triggerKind">
            <ElRadioButton value="schedule">周期(schedule)</ElRadioButton>
            <ElRadioButton value="event">事件(event)</ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'schedule'" label="调度方式">
          <ElRadioGroup v-model="form.triggerMode">
            <ElRadioButton value="interval">固定间隔</ElRadioButton>
            <ElRadioButton value="cron">Cron</ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'schedule' && form.triggerMode === 'interval'" label="周期(秒)">
          <ElInput v-model.number="form.intervalSeconds" type="number" :min="5" />
        </ElFormItem>
        <ElFormItem v-else-if="form.triggerKind === 'schedule'" label="Cron 表达式">
          <ElInput v-model="form.cron" placeholder="*/5 * * * *（分 时 日 月 周）" />
        </ElFormItem>
        <ElFormItem v-else label="监听对象类型">
          <ElSelect v-model="form.eventObjectType" placeholder="选择对象写入事件的类型" style="width:100%">
            <ElOption v-for="o in objectTypes" :key="o.apiName" :label="`${o.displayName} (${o.apiName})`" :value="o.apiName" />
          </ElSelect>
          <div class="hint">当该对象类型发生写入(object_write)时，触发规则条件评估。</div>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="事件去抖(ms)">
          <ElInput v-model.number="form.debounceMs" type="number" :min="0" style="width: 160px" />
          <div class="hint">同一对象在该时间窗口内多次写入，只触发一次；0 表示不等待。</div>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="批量方式">
          <ElSelect v-model="form.batchMode" style="width: 220px">
            <ElOption label="每个对象实例单独排队（per_rid）" value="per_rid" />
            <ElOption label="同对象类型合并（per_type）" value="per_type" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="变更类型">
          <ElSelect v-model="form.changeTypes" multiple style="width: 320px">
            <ElOption label="新增 created" value="created" />
            <ElOption label="修改 updated" value="updated" />
            <ElOption label="删除 deleted" value="deleted" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="字段级触发">
          <ElInput v-model="form.changeFields" placeholder="可选：status,level（逗号分隔；仅 updated 生效）" />
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="评估范围">
          <ElSelect v-model="form.scope" style="width: 220px">
            <ElOption label="仅当前写入对象（object）" value="object" />
            <ElOption label="整个对象类型（type）" value="type" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="form.triggerKind === 'event'" label="评估模式">
          <ElSelect v-model="form.evaluationMode" style="width: 220px">
            <ElOption label="实时 live（按 debounce 立即评估）" value="live" />
            <ElOption label="定时 scheduled（缓冲到下一次 tick）" value="scheduled" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="条件类型">
          <ElRadioGroup v-model="condKind">
            <ElRadioButton value="function">函数</ElRadioButton>
            <ElRadioButton value="expression">表达式</ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem v-if="condKind === 'function'" label="条件函数" required>
          <ElSelect v-model="form.conditionFunction" placeholder="选择评估函数" style="width:100%" @change="syncFormFromParams">
            <ElOption v-for="f in functions" :key="f.apiName" :label="`${f.displayName} (${f.apiName})`" :value="f.apiName" />
          </ElSelect>
          <div class="hint" v-if="functions.find(f=>f.apiName===form.conditionFunction)?.description">
            {{ functions.find(f=>f.apiName===form.conditionFunction)?.description }}
          </div>
        </ElFormItem>
        <ElFormItem v-else label="表达式">
          <RuleExpressionBuilder v-model="expr" :object-types="objectTypes" />
        </ElFormItem>
        <ElFormItem label="效果" required>
          <div style="width: 100%">
            <div v-for="(e, i) in form.effects" :key="i" class="effect-row">
              <ElSelect v-model="e.kind" style="width: 100px">
                <ElOption label="动作" value="action" />
                <ElOption label="函数" value="function" />
                <ElOption label="通知" value="notify" />
                <ElOption label="Webhook" value="webhook" />
              </ElSelect>
              <template v-if="e.kind === 'action'">
                <ElSelect v-model="e.actionApiName" placeholder="选择动作" style="width: 240px">
                  <ElOption v-for="a in actions" :key="a.apiName" :label="`${a.displayName} (${a.apiName})`" :value="a.apiName" />
                </ElSelect>
              </template>
              <template v-else-if="e.kind === 'function'">
                <ElSelect v-model="e.function" placeholder="选择函数" style="width: 240px">
                  <ElOption v-for="f in functions" :key="f.apiName" :label="`${f.displayName} (${f.apiName})`" :value="f.apiName" />
                </ElSelect>
              </template>
              <template v-else-if="e.kind === 'notify'">
                <ElSelect v-model="e.channel" style="width: 100px">
                  <ElOption label="站内" value="inapp" />
                  <ElOption label="Webhook" value="webhook" />
                </ElSelect>
                <ElInput v-model="e.title" placeholder="通知标题" style="width: 160px" />
                <ElInput v-if="e.channel === 'webhook'" v-model="e.webhookUrl" placeholder="Webhook URL" style="width: 220px" />
              </template>
              <template v-else>
                <ElInput v-model="e.url" placeholder="https://..." style="width: 260px" />
              </template>
              <span class="hint" style="margin-left: 4px">重试</span>
              <ElInput v-model.number="e.retryMaxAttempts" type="number" :min="1" style="width: 64px" />
              <ElSelect v-model="e.fallbackKind" style="width: 110px">
                <ElOption label="无回退" value="" />
                <ElOption label="回退通知" value="notify" />
                <ElOption label="回退Webhook" value="webhook" />
              </ElSelect>
              <ElInput v-if="e.fallbackKind === 'notify'" v-model="e.fallbackTitle" placeholder="回退通知标题" style="width: 150px" />
              <ElInput v-if="e.fallbackKind === 'webhook'" v-model="e.fallbackUrl" placeholder="回退 Webhook URL" style="width: 190px" />
              <ElButton text type="danger" @click="removeEffect(i)">删除</ElButton>
            </div>
            <div class="effect-add">
              <ElButton size="small" @click="addEffect('action')">+ 动作</ElButton>
              <ElButton size="small" @click="addEffect('function')">+ 函数</ElButton>
              <ElButton size="small" @click="addEffect('notify')">+ 通知</ElButton>
              <ElButton size="small" @click="addEffect('webhook')">+ Webhook</ElButton>
            </div>
          </div>
        </ElFormItem>
        <ElFormItem label="落点对象类型">
          <ElInput v-model="form.targetObjectType" placeholder="如 Alert（仅写类动作需要）" />
        </ElFormItem>
        <ElFormItem label="执行策略">
          <ElSelect v-model="form.execMode" style="width: 120px">
            <ElOption label="串行" value="sequential" />
            <ElOption label="并行" value="parallel" />
          </ElSelect>
          <span class="hint" style="margin: 0 6px">重试</span>
          <ElInput v-model.number="form.maxRetries" type="number" style="width: 80px" />
          <span class="hint" style="margin: 0 6px">超时(ms)</span>
          <ElInput v-model.number="form.timeoutMs" type="number" style="width: 110px" />
          <span class="hint" style="margin: 0 6px">冷却(s)</span>
          <ElInput v-model.number="form.cooldownSeconds" type="number" style="width: 80px" />
          <span class="hint" style="margin: 0 6px">链深</span>
          <ElInput v-model.number="form.chainDepthLimit" type="number" style="width: 70px" />
        </ElFormItem>

        <!-- 条件参数：可视化结构化表单（仅函数条件需要） -->
        <ElFormItem v-if="condKind === 'function'" label="条件参数">
          <div class="params-wrap">
            <div v-if="selectedFnInputs.length === 0" class="hint">该函数无需参数。</div>
            <div v-else class="param-grid">
              <div v-for="inp in selectedFnInputs" :key="inp.name" class="param-row">
                <label class="param-label">{{ inp.name }}<span v-if="inp.required" class="req">*</span></label>
                <ElInput
                  v-model="paramsForm[inp.name]"
                  :type="inp.type === 'integer' || inp.type === 'float' ? 'number' : 'text'"
                  :placeholder="inp.type"
                  size="small"
                  @input="syncParamsFromForm"
                />
              </div>
            </div>
          </div>
        </ElFormItem>
        <ElFormItem label="预览">
          <div style="width: 100%">
            <div class="param-actions">
              <ElButton size="small" :loading="previewing" @click="previewRule">预览命中对象</ElButton>
              <ElButton v-if="condKind === 'function'" size="small" link type="primary" @click="showJson = !showJson">
                {{ showJson ? '收起高级' : '高级(JSON)' }}
              </ElButton>
            </div>
            <div v-if="showJson && condKind === 'function'">
              <ElInput v-model="form.paramsText" type="textarea" :rows="6" placeholder='JSON 对象，如 {"threshold":0.8}' @input="syncFormFromParams" />
              <div class="hint">高级：直接编辑参数 JSON。与上方表单双向同步。</div>
            </div>
          </div>
        </ElFormItem>
        <div v-if="previewResult" class="preview preview--full">
          <div class="preview__head">
            <span>预计命中 <b>{{ previewResult.count }}</b> 个对象</span>
            <span v-if="previewResult.count > previewResult.items.length" class="hint">
              仅展示前 {{ previewResult.items.length }} 条
            </span>
          </div>
          <ElTable v-if="previewResult.items.length" :data="previewResult.items" size="small" border max-height="260" class="preview__table">
            <ElTableColumn label="员工" min-width="120">
              <template #default="{ row }">{{ row.subjectName ?? row.name ?? row.subjectRid ?? row.rid ?? row.objectRid ?? '—' }}</template>
            </ElTableColumn>
            <ElTableColumn label="级别" width="90">
              <template #default="{ row }">{{ row.level ?? '—' }}</template>
            </ElTableColumn>
            <ElTableColumn v-if="exprPropNode()" :label="exprPropLabel()" width="120">
              <template #default="{ row }">{{ row[exprPropNode()!.property] ?? '—' }}</template>
            </ElTableColumn>
            <ElTableColumn v-if="previewHasField(['leaveDays', 'annualLeaveDays'])" label="请假天数" width="100">
              <template #default="{ row }">{{ row.leaveDays ?? row.annualLeaveDays ?? '—' }}</template>
            </ElTableColumn>
            <ElTableColumn v-if="previewHasField(['managerName', 'to'])" label="收件人" min-width="140">
              <template #default="{ row }">{{ row.managerName ? `${row.managerName}（${row.to ?? '—'}）` : (row.to ?? '—') }}</template>
            </ElTableColumn>
            <ElTableColumn label="说明" min-width="260" show-overflow-tooltip>
              <template #default="{ row }">{{ row.subject ?? row.message ?? (row.body ? String(row.body).split('\n')[0] : '—') }}</template>
            </ElTableColumn>
          </ElTable>
          <div v-else class="hint">无命中对象</div>
          <ElCollapse class="preview__json">
            <ElCollapseItem title="高级（原始 JSON）" name="json">
              <pre class="preview__code">{{ JSON.stringify(previewResult.items, null, 2) }}</pre>
            </ElCollapseItem>
          </ElCollapse>
        </div>

        <div v-if="paramsError" class="params-error">{{ paramsError }}</div>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="saving" @click="save">保存</ElButton>
      </template>
    </ElDialog>
  </div>

    <!-- 运行历史 -->
    <ElDialog v-model="runsVisible" :title="runsTitle" width="960px">
      <ElTable :data="runs" v-loading="runsLoading" size="small" border max-height="420">
        <ElTableColumn label="开始时间" width="180"><template #default="{ row }">{{ fmtRunTime(row.startedAt) }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="110">
          <template #default="{ row }"><ElTag :type="runStatusType(row.status)" size="small">{{ row.status }}</ElTag></template>
        </ElTableColumn>
        <ElTableColumn label="触发" width="190">
          <template #default="{ row }">
            <span v-if="row.triggerContext?.objectType" class="mono">
              {{ row.triggerContext.objectType }}
              <template v-if="row.triggerContext.changeType"> · {{ row.triggerContext.changeType }}</template>
            </span>
            <span v-else class="mono">{{ row.triggerKind }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="matchedCount" label="命中" width="70" />
        <ElTableColumn label="效果" min-width="220">
          <template #default="{ row }">
            {{ (row.effectResults ?? []).map((e: any) => `${e.kind}:${e.ok ? 'ok' : 'fail'}`).join(', ') || '—' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="durationMs" label="耗时(ms)" width="90" />
        <ElTableColumn label="链路" width="130">
          <template #default="{ row }"><span class="mono">{{ (row.chainId || '').slice(0, 8) }} / d{{ row.depth }}</span></template>
        </ElTableColumn>
        <ElTableColumn prop="error" label="错误" min-width="160" show-overflow-tooltip />
      </ElTable>
      <template #footer>
        <ElButton @click="runsVisible = false">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 规则参数查看 -->
    <ElDialog v-model="paramsViewVisible" :title="paramsViewTitle" width="560px">
      <pre class="params-view">{{ paramsViewText }}</pre>
      <template #footer>
        <ElButton @click="paramsViewVisible = false">关闭</ElButton>
        <ElButton type="primary" @click="copyParams">复制 JSON</ElButton>
      </template>
    </ElDialog>
</template>

<style scoped>
.alerts { padding: var(--space-6); max-width: 1100px; margin: 0 auto; }
.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-5); }
.page-title { display: flex; align-items: center; gap: var(--space-2); font-size: 1.4rem; margin: 0; }
.page-sub { color: var(--text-muted); margin: 4px 0 0; font-size: 0.9rem; }
.page-actions { display: flex; gap: var(--space-2); }
.alerts__rules { margin-bottom: var(--space-4); }
.rule-table, .alert-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.rule-table th, .alert-table th, .rule-table td, .alert-table td { padding: 8px 10px; border-bottom: 1px solid var(--border); text-align: left; }
.rule-table .params { max-width: 280px; }
.effect-cell { display: flex; flex-wrap: wrap; gap: 4px; }
.effect-tag { font-family: var(--font-mono); max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
.effect-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.effect-add { display: flex; gap: 6px; margin-top: 4px; }
.param-cell { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.param-tag { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-mono); }
.param-more { font-family: var(--font-mono); }
.params-view {
  margin: 0; padding: 10px 12px;
  background: #f6f8fa; border: 1px solid #e5e7eb; border-radius: 6px;
  font-size: 12px; line-height: 1.55; color: #1f2328;
  max-height: 420px; overflow: auto;
  white-space: pre-wrap; word-break: break-word;
}
.rule-table .sub { color: var(--text-muted); font-size: 0.8rem; margin-top: 2px; }
.rule-table .ops { white-space: nowrap; }
.mono { font-family: var(--font-mono); }
.empty { text-align: center; color: var(--text-muted); padding: 18px; }
.card-title { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.hint { color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; line-height: 1.4; }
.params-error { color: var(--el-color-danger); font-size: 0.82rem; margin-bottom: 8px; }

.sub-cond { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
.param-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; width: 100%; }
.param-row { display: flex; flex-direction: column; gap: 4px; }
.preview { margin-top: 12px; border-top: 1px solid var(--border, #e4e7ed); padding-top: 12px; }
.preview--full { width: 100%; }
.preview__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
.preview__table { width: 100%; }
.preview__json { margin-top: 8px; }
.preview__code {
  margin: 0; padding: 8px; max-height: 220px; overflow: auto;
  background: var(--el-fill-color-light, #f5f7fa); border-radius: 4px;
  font-size: 12px; white-space: pre-wrap; word-break: break-all;
}
</style>
