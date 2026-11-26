<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { emergency } from '@/api';

const tab = ref<'verification' | 'inspection'>('verification');
const rows = ref<any[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try { rows.value = await emergency.inbox(tab.value); }
  catch (e: any) { ElMessage.error(e.message || '加载失败'); }
  finally { loading.value = false; }
}
async function receive(row: any) {
  await emergency.receiveTask(row.objectRid);
  ElMessage.success('已接收');
  await load();
}
async function submit(row: any) {
  const { value } = await ElMessageBox.prompt(
    tab.value === 'verification' ? '单位核查回复' : '检查报告',
    '模拟提交',
    { inputType: 'textarea', inputPlaceholder: '填写内容', confirmButtonText: '提交' },
  );
  await emergency.submitTask(row.objectRid, { contentText: value ?? '' });
  ElMessage.success('已提交');
  await load();
}
function switchTab() { load(); }
onMounted(load);
</script>

<template>
  <div class="inbox">
    <div class="head">
      <h2>模拟业务端</h2>
      <el-button :loading="loading" @click="load">刷新</el-button>
    </div>
    <el-tabs v-model="tab" @tab-change="switchTab">
      <el-tab-pane label="单位端（核查）" name="verification" />
      <el-tab-pane label="检查端（检查）" name="inspection" />
    </el-tabs>
    <el-table v-loading="loading" :data="rows" border stripe>
      <el-table-column prop="caseTitle" label="案件" min-width="220" />
      <el-table-column prop="orgName" label="单位" min-width="180" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'pending' ? 'info' : 'warning'" size="small">
            {{ row.status === 'pending' ? '待办理' : '办理中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="原因" min-width="200" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button v-if="row.status === 'pending'" size="small" @click="receive(row)">接收</el-button>
          <el-button size="small" type="primary" @click="submit(row)">提交</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.inbox { padding: 24px; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.head h2 { margin: 0; }
</style>
