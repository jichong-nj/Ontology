<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption, ElDrawer, ElDescriptions, ElDescriptionsItem,
} from 'element-plus';
import { s1 } from '@/api';
import type { SourceConnection, SourceKind, ConnStatus, ProbeTable } from '@/api';
import { tryRequest } from '@/utils/error';

const conns = ref<SourceConnection[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);

// 详情抽屉
const drawerVisible = ref(false);
const detail = ref<SourceConnection | null>(null);
const probeTables = ref<ProbeTable[]>([]);
const probing = ref(false);

const kindLabels: Record<SourceKind, string> = {
  database: '数据库',
  warehouse: '数据仓库',
  api: 'API',
  file: '文件',
};

const statusType: Record<ConnStatus, 'success' | 'danger' | 'warning'> = {
  connected: 'success',
  error: 'danger',
  pending: 'warning',
};

const form = reactive<{
  displayName: string;
  kind: SourceKind;
  host: string;
  port: string;
  database: string;
  secretRef: string;
}>({
  displayName: '', kind: 'database', host: '', port: '', database: '', secretRef: '',
});

// 不同 kind 需要的连接字段
const metaFields = {
  database: [
    { key: 'host', label: '主机', placeholder: '如：db.internal' },
    { key: 'port', label: '端口', placeholder: '如：5432' },
    { key: 'database', label: '数据库名', placeholder: '如：sales' },
  ],
  warehouse: [
    { key: 'host', label: '主机', placeholder: '如：wh.internal' },
    { key: 'port', label: '端口', placeholder: '如：443' },
    { key: 'database', label: '仓库/库名', placeholder: '如：analytics' },
  ],
  api: [
    { key: 'host', label: 'Base URL', placeholder: '如：https://api.example.com' },
  ],
  file: [
    { key: 'host', label: '存储路径/URI', placeholder: '如：s3://bucket/path' },
  ],
} as const;

async function load() {
  loading.value = true;
  await tryRequest(async () => {
    conns.value = await s1.listConnections();
  });
  loading.value = false;
}

function openCreate() {
  form.displayName = '';
  form.kind = 'database';
  form.host = ''; form.port = ''; form.database = ''; form.secretRef = '';
  dialogVisible.value = true;
}

// 前端生成连接 id（后端 source_connection.id 为必填主键）
function genConnId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'conn';
  return `conn-${slug}-${Date.now().toString(36)}`;
}

async function submit() {
  if (!form.displayName) {
    ElMessage.warning('请填写连接名称');
    return;
  }
  const meta: Record<string, unknown> = {};
  for (const f of metaFields[form.kind]) {
    const v = (form as any)[f.key];
    if (v) meta[f.key] = v;
  }
  const payload: SourceConnection = {
    id: genConnId(form.displayName),
    displayName: form.displayName,
    kind: form.kind,
    readOnly: true,                 // S1 强制只读
    connectionMeta: meta,
    secretRef: form.secretRef || `secret://${form.displayName}`,
    status: 'pending',
  };
  await tryRequest(async () => {
    await s1.createConnection(payload);
    ElMessage.success('连接已创建（只读接入）');
    dialogVisible.value = false;
    await load();
  });
}

async function openDetail(c: SourceConnection) {
  detail.value = c;
  drawerVisible.value = true;
  probeTables.value = [];
  probing.value = true;
  await tryRequest(async () => {
    probeTables.value = await s1.probe(c.id);
  });
  probing.value = false;
}

onMounted(load);
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h2 class="section-title">Data Sources</h2>
        <p class="section-sub">{{ conns.length }} 个已配置连接 · 只读接入</p>
      </div>
      <ElButton type="primary" @click="openCreate">新建连接</ElButton>
    </header>

    <div v-loading="loading" class="conn-grid">
      <ElCard
        v-for="c in conns"
        :key="c.id"
        class="conn-card"
        shadow="hover"
        @click="openDetail(c)"
      >
        <div class="conn-card__head">
          <span class="conn-card__name">{{ c.displayName }}</span>
          <ElTag size="small" type="info">{{ kindLabels[c.kind] }}</ElTag>
        </div>
        <p class="conn-card__meta">
          <ElTag size="small" :type="statusType[c.status]">{{ c.status }}</ElTag>
          <ElTag size="small" type="warning">只读</ElTag>
        </p>
        <div class="conn-card__summary">
          <span v-for="(v, k) in c.connectionMeta" :key="k" class="kv">
            <span class="kv__k">{{ k }}</span>
            <span class="kv__v mono">{{ String(v) }}</span>
          </span>
        </div>
      </ElCard>

      <div v-if="!loading && conns.length === 0" class="empty-hint">
        暂无连接，点击右上角「新建连接」。
      </div>
    </div>

    <!-- 新建连接 -->
    <ElDialog v-model="dialogVisible" title="新建数据源连接" width="540px">
      <ElForm label-position="top">
        <ElFormItem label="名称" required>
          <ElInput v-model="form.displayName" placeholder="如：销售库（只读副本）" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="form.kind" style="width: 100%">
            <ElOption v-for="(label, k) in kindLabels" :key="k" :label="label" :value="k" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem v-for="f in metaFields[form.kind]" :key="f.key" :label="f.label">
          <ElInput v-model="(form as any)[f.key]" :placeholder="f.placeholder" />
        </ElFormItem>

        <ElFormItem label="凭据引用（secretRef）">
          <ElInput v-model="form.secretRef" placeholder="如：secret://sales-ro（指向 S6 托管凭据）" />
        </ElFormItem>
      </ElForm>
      <p class="form-hint">S1 连接为只读接入，禁止写回源端。凭据以引用形式托管，不存储明文。</p>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submit">创建</ElButton>
      </template>
    </ElDialog>

    <!-- 详情抽屉：连接信息 + 探测到的表 -->
    <ElDrawer v-model="drawerVisible" :title="detail?.displayName" size="420px">
      <template v-if="detail">
        <ElDescriptions :column="1" border size="small">
          <ElDescriptionsItem label="ID"><span class="mono">{{ detail.id }}</span></ElDescriptionsItem>
          <ElDescriptionsItem label="类型">{{ kindLabels[detail.kind] }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag size="small" :type="statusType[detail.status]">{{ detail.status }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="只读">
            <ElTag size="small" type="warning">只读</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="凭据引用"><span class="mono">{{ detail.secretRef }}</span></ElDescriptionsItem>
        </ElDescriptions>

        <h4 class="drawer-sub">连接参数</h4>
        <ElDescriptions :column="1" border size="small">
          <ElDescriptionsItem v-for="(v, k) in detail.connectionMeta" :key="k" :label="k">
            <span class="mono">{{ String(v) }}</span>
          </ElDescriptionsItem>
        </ElDescriptions>

        <h4 class="drawer-sub">探测到的表（{{ probeTables.length }}）</h4>
        <div v-loading="probing">
          <ul v-if="probeTables.length" class="table-list">
            <li v-for="t in probeTables" :key="t.table" class="table-list__item">
              <span class="mono">{{ t.table }}</span>
              <span class="table-list__cols">{{ t.columns.length }} 字段</span>
            </li>
          </ul>
          <p v-else class="drawer-empty">暂无可见表（或连接尚未就绪）。</p>
        </div>
      </template>
    </ElDrawer>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.page__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.conn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
}
.conn-card { cursor: pointer; }
.conn-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.conn-card__name {
  font-weight: 600;
  font-size: 14px;
}
.conn-card__meta {
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.conn-card__summary {
  margin-top: var(--space-2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
}
.kv {
  font-size: 12px;
  display: inline-flex;
  gap: 4px;
}
.kv__k { color: var(--text-muted); }
.kv__v { color: var(--text-secondary); }
.mono { font-family: var(--font-mono); font-size: 12px; }

.empty-hint {
  grid-column: 1 / -1;
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
.form-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 var(--space-2);
  line-height: 1.5;
}

.drawer-sub {
  margin: var(--space-4) 0 var(--space-2);
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}
.table-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.table-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.table-list__item:last-child { border-bottom: none; }
.table-list__cols { color: var(--text-muted); font-size: 12px; }
.drawer-empty { font-size: 12px; color: var(--text-muted); }
</style>
