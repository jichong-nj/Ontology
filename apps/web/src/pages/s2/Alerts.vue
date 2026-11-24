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
  trigger: { kind: 'schedule' | 'event'; intervalSeconds?: number; on?: string; objectType?: string; conditionProperty?: string };
  conditionFunction?: string;
  condition?: any;
  actionApiName: string;
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
  intervalSeconds: 60,
  eventObjectType: '',
  conditionFunction: '',
  actionApiName: '',
  targetObjectType: 'Alert',
  // 参数有两种编辑视图：结构化表单(paramsForm) 与 高级 JSON(paramsText)，双向同步
  paramsText: '{\n  "threshold": 0.8,\n  "leaveDeduct": 10,\n  "workDeduct": 10,\n  "leaveBase": 1\n}',
});

// 条件：函数 / 表达式（表达式支持属性/聚合比较与 AND/OR 嵌套）
const condKind = ref<'function' | 'expression'>('function');
const expr = ref<any>(null);

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
      s2.listRules(),
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
  if (r.trigger.kind === 'schedule') return `周期 ${r.trigger.intervalSeconds ?? '-'}s`;
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
    conditionFunction: functions.value[0]?.apiName ?? '',
    actionApiName: actions.value[0]?.apiName ?? '',
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
    conditionFunction: rule.conditionFunction,
    actionApiName: rule.actionApiName,
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
  if (!form.actionApiName) { paramsError.value = '请选择落地动作'; return; }

  const trigger =
    form.triggerKind === 'schedule'
      ? { kind: 'schedule' as const, intervalSeconds: Number(form.intervalSeconds) }
      : { kind: 'event' as const, on: 'object_write' as const, objectType: form.eventObjectType };

  saving.value = true;
  await tryRequest(async () => {
    if (editing.value) {
      await s2.updateRule(editing.value, {
        displayName: form.displayName,
        enabled: form.enabled,
        trigger,
        condition: conditionPayload(),
        ...(condKind.value === 'function' ? { conditionFunction: form.conditionFunction } : { conditionFunction: null }),
        actionApiName: form.actionApiName,
        targetObjectType: form.targetObjectType,
        params,
      } as any);
      ElMessage.success('规则已更新');
    } else {
      await s2.createRule({
        apiName: form.apiName.trim(),
        displayName: form.displayName || form.apiName.trim(),
        enabled: form.enabled,
        trigger,
        ...(condKind.value === 'function'
          ? { conditionFunction: form.conditionFunction }
          : { condition: conditionPayload() }),
        actionApiName: form.actionApiName,
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
    await s2.updateRule(rule.apiName, { enabled: !rule.enabled });
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
      await s2.deleteRule(rule.apiName);
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
        <h2 class="page-title"><ElIcon><Bell /></ElIcon> 规则中心</h2>
        <p class="page-sub">通用自动化规则：满足条件（可配置 Function 评估）即执行动作（可配置 Action 落地）。当前动作产物之一为告警对象。</p>
      </div>
      <div class="page-actions">
        <ElButton :loading="loading" @click="load"><ElIcon><Refresh /></ElIcon> 刷新</ElButton>
        <ElButton type="warning" :loading="running" @click="runRules">运行全部规则</ElButton>
        <ElButton type="primary" @click="openCreate"><ElIcon><Plus /></ElIcon> 新建规则</ElButton>
      </div>
    </header>

    <ElCard class="alerts__rules" shadow="never">
      <template #header><span class="card-title">自动化规则（条件评估 → 动作落地 · 可自助配置）</span></template>
      <table class="rule-table">
        <thead><tr><th>规则</th><th>启用</th><th>触发器</th><th>条件函数</th><th>落地动作</th><th>参数</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rules" :key="r.apiName">
            <td class="mono">{{ r.apiName }}<div class="sub">{{ r.displayName }}</div></td>
            <td><ElTag :type="r.enabled ? 'success' : 'info'" size="small">{{ r.enabled ? '启用' : '禁用' }}</ElTag></td>
            <td>
              <ElTag :type="r.trigger?.kind === 'schedule' ? 'info' : 'warning'" size="small">{{ triggerLabel(r) }}</ElTag>
            </td>
            <td class="mono">{{ r.conditionFunction }}</td>
            <td class="mono">{{ r.actionApiName }}</td>
            <td class="mono params">{{ JSON.stringify(r.params) }}</td>
            <td class="ops">
              <ElButton link type="primary" :icon="SwitchIcon" @click="toggleEnabled(r)">{{ r.enabled ? '禁用' : '启用' }}</ElButton>
              <ElButton link type="primary" :icon="Edit" @click="openEdit(r)">编辑</ElButton>
              <ElButton link type="danger" :icon="Delete" @click="removeRule(r)">删除</ElButton>
            </td>
          </tr>
          <tr v-if="rules.length === 0"><td colspan="7" class="empty">暂无规则，点击右上角「新建规则」</td></tr>
        </tbody>
      </table>
    </ElCard>

    <!-- 新建 / 编辑 抽屉 -->
    <ElDialog v-model="dialogVisible" :title="editing ? '编辑自动化规则' : '新建自动化规则'" width="800px">
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
        <ElFormItem v-if="form.triggerKind === 'schedule'" label="周期(秒)">
          <ElInput v-model.number="form.intervalSeconds" type="number" :min="5" />
        </ElFormItem>
        <ElFormItem v-else label="监听对象类型">
          <ElSelect v-model="form.eventObjectType" placeholder="选择对象写入事件的类型" style="width:100%">
            <ElOption v-for="o in objectTypes" :key="o.apiName" :label="`${o.displayName} (${o.apiName})`" :value="o.apiName" />
          </ElSelect>
          <div class="hint">当该对象类型发生写入(object_write)时，触发规则条件评估。</div>
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
        <ElFormItem label="落地动作" required>
          <ElSelect v-model="form.actionApiName" placeholder="选择生成告警的动作" style="width:100%">
            <ElOption v-for="a in actions" :key="a.apiName" :label="`${a.displayName} (${a.apiName})`" :value="a.apiName" />
          </ElSelect>
          <!-- 动作内嵌校验规则透明展示（对标 Palantir Action 自带 rules）：FDE 可直观看到该动作的前置约束 -->
          <div v-if="selectedActionPreconditions.length" class="hint">
            前置校验：
            <span v-for="(pc, i) in selectedActionPreconditions" :key="i" class="pc-tag">
              {{ preconditionText(pc) }}
            </span>
          </div>
        </ElFormItem>
        <ElFormItem label="落点对象类型">
          <ElInput v-model="form.targetObjectType" placeholder="如 Alert（仅写类动作需要）" />
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
.rule-table .params { max-width: 220px; word-break: break-all; color: var(--text-muted); }
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
