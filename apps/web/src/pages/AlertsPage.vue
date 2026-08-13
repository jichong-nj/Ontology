<template>
  <div class="page">
    <div class="header">
      <div>
        <h2 class="title">告警（Alerts）</h2>
        <span class="subtitle">由自动化规则的动作（如 createDimissionAlert）写入本体可写侧的 Alert 实例</span>
      </div>
      <el-button :loading="loading" @click="load">刷新</el-button>
    </div>

    <el-table :data="alerts" v-loading="loading" border stripe>
      <el-table-column label="级别" width="120">
        <template #default="{ row }">
          <el-tag type="danger" size="small">{{ row.properties?.level ?? '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="主体" min-width="220">
        <template #default="{ row }">
          <span>{{ row.properties?.subjectName ?? '-' }}</span>
          <span class="mono" v-if="row.properties?.subjectRid"> ({{ row.properties.subjectRid }})</span>
        </template>
      </el-table-column>
      <el-table-column prop="properties.message" label="说明" min-width="260" show-overflow-tooltip />
      <el-table-column label="生成时间" width="200">
        <template #default="{ row }">
          <span class="mono">{{ row.properties?.createdAt ?? '-' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && !alerts.length" description="暂无告警" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { s2 } from '@/api';

interface AlertItem {
  objectRid: string;
  properties: Record<string, unknown>;
}

const alerts = ref<AlertItem[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    alerts.value = await s2.listAlerts();
  } catch (e: any) {
    ElMessage.error(`加载告警失败: ${e?.message ?? e}`);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
.page { padding: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.title { margin: 0 0 4px; font-size: 20px; }
.subtitle { color: #888; font-size: 13px; }
.mono { font-family: monospace; color: #666; font-size: 12px; }
</style>
