<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { emergency } from '@/api';

const router = useRouter();
const cases = ref<any[]>([]);
const loading = ref(false);
const dialog = ref(false);
const form = ref({ title: '', websiteRegion: '境外', classificationLevel: '机密', contentText: '', websiteName: '某境外网站' });
const injecting = ref(false);

async function load() {
  loading.value = true;
  try { cases.value = await emergency.listCases(); }
  catch (e: any) { ElMessage.error(e.message || '加载失败'); }
  finally { loading.value = false; }
}

async function inject() {
  if (!form.value.title.trim()) return ElMessage.warning('请填写标题');
  injecting.value = true;
  try {
    await emergency.createEvent(form.value);
    ElMessage.success('舆情事件已注入，等待自动建案…');
    dialog.value = false;
    form.value.title = '';
    form.value.contentText = '';
    setTimeout(load, 1800);
  } catch (e: any) {
    ElMessage.error(e.message || '注入失败');
  } finally {
    injecting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="em-list">
    <div class="page-head">
      <div>
        <h2>🚨 应急响应</h2>
        <p class="sub">舆情事件 → 自动建案 → 初始关联 → 核查/检查 → AI 研判 → 结案</p>
      </div>
      <div class="actions">
        <el-button :loading="loading" @click="load">刷新</el-button>
        <el-button type="primary" @click="dialog = true">模拟舆情事件</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="cases" border stripe @row-click="(row: any) => router.push(`/emergency/${encodeURIComponent(row.id)}`)">
      <el-table-column prop="title" label="案件" min-width="260">
        <template #default="{ row }">
          <div class="case-title">{{ row.title }}</div>
          <div class="case-id">{{ row.id }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="密级" width="90" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'in_progress' ? 'warning' : 'info'" size="small">
            {{ row.status === 'in_progress' ? '进行中' : '已结束' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sourceSystem" label="来源" width="120" />
      <el-table-column prop="discoveredAt" label="发现时间" width="180">
        <template #default="{ row }">{{ row.discoveredAt ? new Date(row.discoveredAt).toLocaleString('zh-CN', { hour12: false }) : '—' }}</template>
      </el-table-column>
      <el-table-column label="任务" width="110">
        <template #default="{ row }">
          <el-tag v-if="row.openTasks" type="warning" size="small">待办 {{ row.openTasks }}</el-tag>
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog" title="模拟舆情事件" width="560px">
      <el-form label-width="90px">
        <el-form-item label="标题"><el-input v-model="form.title" placeholder="如：疑似涉密文件被发布" /></el-form-item>
        <el-form-item label="网站属地">
          <el-select v-model="form.websiteRegion" style="width: 160px">
            <el-option label="境外" value="境外" /><el-option label="境内" value="境内" />
          </el-select>
        </el-form-item>
        <el-form-item label="密级">
          <el-select v-model="form.classificationLevel" style="width: 160px">
            <el-option v-for="x in ['公开','内部','秘密','机密','绝密']" :key="x" :label="x" :value="x" />
          </el-select>
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="form.contentText" type="textarea" :rows="3" placeholder="可写文号/标题，用于文档匹配" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" :loading="injecting" @click="inject">注入并建案</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.em-list { padding: 24px; }
.page-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.page-head h2 { margin: 0 0 6px; }
.sub { margin: 0; color: #909399; font-size: 13px; }
.actions { display: flex; gap: 8px; }
.case-title { font-weight: 600; }
.case-id { color: #909399; font-size: 12px; margin-top: 2px; font-family: var(--font-mono, monospace); }
.muted { color: #909399; }
</style>
