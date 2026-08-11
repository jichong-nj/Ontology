<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElCard, ElButton, ElIcon, ElTag, ElMessage } from 'element-plus';
import { Warning, Refresh, Bell } from '@element-plus/icons-vue';
import { s2 } from '@/api';
import { tryRequest } from '@/utils/error';

interface AlertItem { objectRid: string; properties: Record<string, unknown>; }
const alerts = ref<AlertItem[]>([]);
const rules = ref<any[]>([]);
const loading = ref(false);
const running = ref(false);

async function load() {
  await tryRequest(async () => {
    const [a, r] = await Promise.all([s2.listAlerts(), s2.listAlertRules()]);
    alerts.value = a;
    rules.value = r;
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
      </div>
    </header>

    <ElCard class="alerts__rules" shadow="never">
      <template #header><span class="card-title">告警规则（后台定时任务）</span></template>
      <table class="rule-table">
        <thead><tr><th>规则</th><th>启用</th><th>周期</th><th>条件函数</th><th>落地动作</th><th>参数</th></tr></thead>
        <tbody>
          <tr v-for="r in rules" :key="r.apiName">
            <td class="mono">{{ r.apiName }}</td>
            <td><ElTag :type="r.enabled ? 'success' : 'info'" size="small">{{ r.enabled ? '启用' : '禁用' }}</ElTag></td>
            <td>{{ r.intervalSeconds }}s</td>
            <td class="mono">{{ r.functionApiName }}</td>
            <td class="mono">{{ r.actionApiName }}</td>
            <td class="mono">{{ JSON.stringify(r.params) }}</td>
          </tr>
          <tr v-if="rules.length === 0"><td colspan="6" class="empty">暂无规则</td></tr>
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
.mono { font-family: var(--font-mono); }
.empty { text-align: center; color: var(--text-muted); padding: 18px; }
.card-title { display: flex; align-items: center; gap: 6px; font-weight: 600; }
</style>
