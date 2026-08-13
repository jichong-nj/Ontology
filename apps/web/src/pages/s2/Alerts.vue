<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { ElCard, ElButton, ElIcon, ElTag, ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSwitch, ElSelect, ElOption, ElMessageBox } from 'element-plus';
import { Warning, Refresh, Bell, Plus, Edit, Delete, Switch as SwitchIcon } from '@element-plus/icons-vue';
import { s2, s2functions, s2actions } from '@/api';
import { tryRequest } from '@/utils/error';

interface AlertItem { objectRid: string; properties: Record<string, unknown>; }
interface RuleItem {
  apiName: string;
  displayName: string;
  enabled: boolean;
  intervalSeconds: number;
  functionApiName: string;
  actionApiName: string;
  params: Record<string, unknown>;
  alertObjectType: string;
  version: number;
}

const alerts = ref<AlertItem[]>([]);
const rules = ref<RuleItem[]>([]);
const functions = ref<{ apiName: string; displayName: string }[]>([]);
const actions = ref<{ apiName: string; displayName: string }[]>([]);
const loading = ref(false);
const running = ref(false);

// 新建/编辑抽屉
const dialogVisible = ref(false);
const editing = ref<string | null>(null); // null=新建
const saving = ref(false);
const form = reactive({
  apiName: '',
  displayName: '',
  enabled: true,
  intervalSeconds: 60,
  functionApiName: '',
  actionApiName: '',
  alertObjectType: 'Alert',
  paramsText: '{\n  "threshold": 0.8,\n  "leaveDeduct": 10,\n  "workDeduct": 10,\n  "leaveBase": 1\n}',
});
const paramsError = ref('');

async function load() {
  await tryRequest(async () => {
    const [a, r, f, ac] = await Promise.all([
      s2.listAlerts(),
      s2.listAlertRules(),
      s2functions.list(),
      s2actions.list(),
    ]);
    alerts.value = a;
    rules.value = r;
    functions.value = f.map((x: any) => ({ apiName: x.apiName, displayName: x.displayName ?? x.apiName }));
    actions.value = ac.map((x: any) => ({ apiName: x.apiName, displayName: x.displayName ?? x.apiName }));
  });
}

async function runRules() {
  running.value = true;
  await tryRequest(async () => {
    const res = await s2.runAlertRules();
    const total = (res.results ?? []).reduce((s: number, x: any) => s + (x.alertsCreated ?? 0), 0);
    ElMessage.success(`规则执行完成，生成 ${total} 条告警`);
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
    intervalSeconds: 60,
    functionApiName: functions.value[0]?.apiName ?? '',
    actionApiName: actions.value[0]?.apiName ?? '',
    alertObjectType: 'Alert',
    paramsText: '{\n  "threshold": 0.8\n}',
  });
  paramsError.value = '';
  dialogVisible.value = true;
}

async function openEdit(rule: RuleItem) {
  editing.value = rule.apiName;
  Object.assign(form, {
    apiName: rule.apiName,
    displayName: rule.displayName,
    enabled: rule.enabled,
    intervalSeconds: rule.intervalSeconds,
    functionApiName: rule.functionApiName,
    actionApiName: rule.actionApiName,
    alertObjectType: rule.alertObjectType,
    paramsText: JSON.stringify(rule.params ?? {}, null, 2),
  });
  paramsError.value = '';
  dialogVisible.value = true;
}

async function save() {
  // 校验 params 必须是合法 JSON 对象
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
  if (!form.functionApiName) { paramsError.value = '请选择条件函数'; return; }
  if (!form.actionApiName) { paramsError.value = '请选择落地动作'; return; }

  saving.value = true;
  await tryRequest(async () => {
    if (editing.value) {
      await s2.updateAlertRule(editing.value, {
        displayName: form.displayName,
        enabled: form.enabled,
        intervalSeconds: Number(form.intervalSeconds),
        functionApiName: form.functionApiName,
        actionApiName: form.actionApiName,
        alertObjectType: form.alertObjectType,
        params,
      });
      ElMessage.success('规则已更新');
    } else {
      await s2.createAlertRule({
        apiName: form.apiName.trim(),
        displayName: form.displayName || form.apiName.trim(),
        enabled: form.enabled,
        intervalSeconds: Number(form.intervalSeconds),
        functionApiName: form.functionApiName,
        actionApiName: form.actionApiName,
        alertObjectType: form.alertObjectType,
        params,
        version: 1,
      });
      ElMessage.success('规则已创建');
    }
    dialogVisible.value = false;
    await load();
  });
  saving.value = false;
}

async function toggleEnabled(rule: RuleItem) {
  await tryRequest(async () => {
    await s2.updateAlertRule(rule.apiName, { enabled: !rule.enabled });
    ElMessage.success(rule.enabled ? '已禁用' : '已启用');
    await load();
  });
}

async function removeRule(rule: RuleItem) {
  await ElMessageBox.confirm(
    `确定删除告警规则「${rule.displayName}」(${rule.apiName}) 吗？此操作不可撤销。`,
    '删除确认',
    { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
  ).then(async () => {
    await tryRequest(async () => {
      await s2.deleteAlertRule(rule.apiName);
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
        <h2 class="page-title"><ElIcon><Bell /></ElIcon> 告警中心</h2>
        <p class="page-sub">后台定时巡检（可配置 Function 评估 + 可配置 Action 落地），命中后生成告警对象</p>
      </div>
      <div class="page-actions">
        <ElButton :loading="loading" @click="load"><ElIcon><Refresh /></ElIcon> 刷新</ElButton>
        <ElButton type="warning" :loading="running" @click="runRules">运行告警规则</ElButton>
        <ElButton type="primary" @click="openCreate"><ElIcon><Plus /></ElIcon> 新建规则</ElButton>
      </div>
    </header>

    <ElCard class="alerts__rules" shadow="never">
      <template #header><span class="card-title">告警规则（后台定时任务 · 可自助配置）</span></template>
      <table class="rule-table">
        <thead><tr><th>规则</th><th>启用</th><th>周期</th><th>条件函数</th><th>落地动作</th><th>参数</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rules" :key="r.apiName">
            <td class="mono">{{ r.apiName }}<div class="sub">{{ r.displayName }}</div></td>
            <td><ElTag :type="r.enabled ? 'success' : 'info'" size="small">{{ r.enabled ? '启用' : '禁用' }}</ElTag></td>
            <td>{{ r.intervalSeconds }}s</td>
            <td class="mono">{{ r.functionApiName }}</td>
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

    <ElCard class="alerts__list" shadow="never">
      <template #header>
        <span class="card-title"><ElIcon><Warning /></ElIcon> 告警对象 ({{ alerts.length }})</span>
      </template>
      <table class="alert-table">
        <thead><tr><th>级别</th><th>主体</th><th>说明</th><th>生成时间</th></tr></thead>
        <tbody>
          <tr v-for="a in alerts" :key="a.objectRid">
            <td><ElTag type="danger" size="small">{{ a.properties.level }}</ElTag></td>
            <td>{{ a.properties.subjectName }} <span class="mono">({{ a.properties.subjectRid }})</span></td>
            <td>{{ a.properties.message }}</td>
            <td class="mono">{{ a.properties.createdAt }}</td>
          </tr>
          <tr v-if="alerts.length === 0"><td colspan="4" class="empty">暂无告警</td></tr>
        </tbody>
      </table>
    </ElCard>

    <!-- 新建 / 编辑 抽屉 -->
    <ElDialog v-model="dialogVisible" :title="editing ? '编辑告警规则' : '新建告警规则'" width="560px">
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
        <ElFormItem label="触发周期(秒)">
          <ElInput v-model.number="form.intervalSeconds" type="number" :min="5" />
        </ElFormItem>
        <ElFormItem label="条件函数" required>
          <ElSelect v-model="form.functionApiName" placeholder="选择评估函数" style="width:100%">
            <ElOption v-for="f in functions" :key="f.apiName" :label="`${f.displayName} (${f.apiName})`" :value="f.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="落地动作" required>
          <ElSelect v-model="form.actionApiName" placeholder="选择生成告警的动作" style="width:100%">
            <ElOption v-for="a in actions" :key="a.apiName" :label="`${a.displayName} (${a.apiName})`" :value="a.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="告警对象类型">
          <ElInput v-model="form.alertObjectType" placeholder="如 Alert" />
        </ElFormItem>
        <ElFormItem label="参数(params)">
          <ElInput v-model="form.paramsText" type="textarea" :rows="6" placeholder='JSON 对象，如 {"threshold":0.8}' />
          <div class="hint">传给条件函数的参数（JSON 对象）。修改此处即可调整算分阈值/扣分量等，无需改函数体。</div>
        </ElFormItem>
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
</style>
