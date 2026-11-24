<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption, ElDrawer, ElDescriptions, ElDescriptionsItem, ElMessageBox,
  ElTable, ElTableColumn, ElPagination,
} from 'element-plus';
import { s1 } from '@/api';
import type { SourceConnection, SourceKind, ConnStatus, ProbeTable, DbType, ConnectionMeta, TablePreview } from '@/api';
import { tryRequest } from '@/utils/error';

const conns = ref<SourceConnection[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);          // 新建 / 编辑 模式
const editingId = ref<string>('');  // 编辑时的连接 id

// 详情抽屉
const drawerVisible = ref(false);
const detail = ref<SourceConnection | null>(null);
const probeTables = ref<ProbeTable[]>([]);
const probing = ref(false);
const schemas = ref<string[]>([]);
const activeSchema = ref('public');

// 表数据预览（打开表 → 查看真实数据）
const previewVisible = ref(false);
const previewTable = ref('');
const previewData = ref<TablePreview | null>(null);
const previewLoading = ref(false);
const previewPage = ref(1);
const previewLimit = ref(50);

// 对话框内：测试连接 + 选库
const testing = ref(false);
const testResult = ref<{ ok: boolean; msg: string } | null>(null);
const dbList = ref<string[]>([]);     // 测试通过后从后端拉取的库列表
const loadingDbs = ref(false);

const kindLabels: Record<SourceKind, string> = {
  database: '数据库',
  warehouse: '数据仓库',
  api: 'API',
  file: '文件',
};

const dbTypeLabels: Record<DbType, string> = {
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
};

const statusType: Record<ConnStatus, 'success' | 'danger' | 'warning'> = {
  connected: 'success',
  error: 'danger',
  pending: 'warning',
};

// 新建 / 编辑 共用表单
const form = reactive<{
  displayName: string;
  kind: SourceKind;
  dbType: DbType;
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  secretRef: string;
  icon: string;
}>({
  displayName: '', kind: 'database', dbType: 'postgres',
  host: '', port: '5432', database: '', user: '', password: '', secretRef: '', icon: '🗄️',
});

// 预设图标（emoji），供数据源卡片展示
const iconOptions = ['🗄️', '🗃️', '📊', '🔗', '🛢️', '📦', '☁️', '🔌', '🏢', '👥', '💡', '🚀'];

const formValid = () =>
  !!form.displayName && (form.kind !== 'database' || !!form.host);

// 展示用：连接参数中完全不展示 password（即便隐藏也不出现该字段）
const HIDDEN_KEYS = new Set(['password']);
function redactMeta(meta: ConnectionMeta | undefined): { key: string; value: string; secret: boolean }[] {
  if (!meta) return [];
  return Object.entries(meta)
    .filter(([k]) => !HIDDEN_KEYS.has(k))
    .map(([k, v]) => ({
      key: k,
      value: String(v),
      secret: false,
    }));
}

// 当前表单的连接参数（供测试 / 列库使用）
function currentMeta(): ConnectionMeta {
  const meta: ConnectionMeta = { dbType: form.dbType };
  if (form.host) meta.host = form.host;
  if (form.port) meta.port = form.port;
  if (form.database) meta.database = form.database;
  if (form.user) meta.user = form.user;
  if (form.password) meta.password = form.password;
  return meta;
}

async function load() {
  loading.value = true;
  await tryRequest(async () => {
    conns.value = await s1.listConnections();
  });
  loading.value = false;
}

function resetTestState() {
  testing.value = false;
  testResult.value = null;
  dbList.value = [];
  loadingDbs.value = false;
}

function openCreate() {
  isEdit.value = false;
  editingId.value = '';
  Object.assign(form, {
    displayName: '', kind: 'database', dbType: 'postgres',
    host: '', port: '5432', database: '', user: '', password: '', secretRef: '', icon: '🗄️',
  });
  resetTestState();
  dialogVisible.value = true;
}

function openEdit(c: SourceConnection) {
  isEdit.value = true;
  editingId.value = c.id;
  const m = c.connectionMeta || {};
  Object.assign(form, {
    displayName: c.displayName,
    kind: c.kind,
    dbType: (m.dbType as DbType) || 'postgres',
    host: String(m.host ?? ''),
    port: String(m.port ?? (m.dbType === 'mysql' ? '3306' : '5432')),
    database: String(m.database ?? ''),
    user: String(m.user ?? ''),
    password: String(m.password ?? ''),
    secretRef: c.secretRef,
    icon: c.icon || '🗄️',
  });
  resetTestState();
  // 编辑时预填已保存的 database，使下拉框在未重新探测时也能显示已存值
  if (form.kind === 'database' && form.database) {
    dbList.value = [form.database];
  }
  dialogVisible.value = true;
}
function onDbTypeChange(t: DbType) {
  if (!form.port || form.port === '5432' || form.port === '3306') {
    form.port = t === 'mysql' ? '3306' : '5432';
  }
  // 切换类型后之前测过的库列表失效
  resetTestState();
}

// 表单内测试连接：用当前填写的参数，未保存也能测
async function runTestInDialog() {
  if (!formValid()) {
    ElMessage.warning('请先填写名称与主机地址');
    return;
  }
  testing.value = true;
  testResult.value = null;
  dbList.value = [];
  await tryRequest(async () => {
    const r = await s1.testByParams(currentMeta());
    testResult.value = r.reachable
      ? { ok: true, msg: '连接成功' }
      : { ok: false, msg: r.error || '连接失败' };
    if (r.reachable) {
      ElMessage.success('连接测试通过，可选取数据库');
      await loadDatabases();
    } else {
      ElMessage.error(`连接失败：${r.error}`);
    }
  });
  testing.value = false;
}

// 测试通过后拉取源库列表（用于选择 库 / schema）
async function loadDatabases() {
  loadingDbs.value = true;
  await tryRequest(async () => {
    const r = await s1.listDatabases(currentMeta());
    dbList.value = r.databases || [];
    if (!dbList.value.includes(form.database) && form.database) {
      // 已填写的库不在列表中（可能尚未测试），保留用户输入
    }
  });
  loadingDbs.value = false;
}

async function submit() {
  if (!formValid()) {
    ElMessage.warning('请填写连接名称与主机地址');
    return;
  }
  const meta: ConnectionMeta = { dbType: form.dbType };
  if (form.host) meta.host = form.host;
  if (form.port) meta.port = form.port;
  if (form.database) meta.database = form.database;
  if (form.user) meta.user = form.user;
  if (form.password) meta.password = form.password;
  const payload: SourceConnection = {
    id: isEdit.value ? editingId.value : genConnId(form.displayName),
    displayName: form.displayName,
    kind: form.kind,
    readOnly: true,                 // S1 强制只读
    connectionMeta: meta,
    secretRef: form.secretRef || `secret://${form.displayName}`,
    // 状态：刚测过且成功 → connected；否则保持（编辑时沿用旧值）/ pending
    status: testResult.value?.ok
      ? 'connected'
      : (isEdit.value ? (conns.value.find((c) => c.id === editingId.value)?.status ?? 'pending') : 'pending'),
    icon: form.icon,
  };
  await tryRequest(async () => {
    if (isEdit.value) {
      await s1.updateConnection(editingId.value, payload);
      ElMessage.success('连接已更新');
    } else {
      await s1.createConnection(payload);
      ElMessage.success('连接已创建（只读接入）');
    }
    dialogVisible.value = false;
    await load();
  });
}

// 前端生成连接 id（后端 source_connection.id 为必填主键）
function genConnId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'conn';
  return `conn-${slug}-${Date.now().toString(36)}`;
}

async function openDetail(c: SourceConnection) {
  detail.value = c;
  drawerVisible.value = true;
  probeTables.value = [];
  schemas.value = [];
  previewVisible.value = false;
  previewData.value = null;
  await loadSchemas(c.id);
  await runProbe(c.id, activeSchema.value);
}

// 浏览：加载连接库内的 schema 列表
async function loadSchemas(id: string) {
  await tryRequest(async () => {
    const r = await s1.listSchemas(id);
    schemas.value = r.schemas || [];
    if (schemas.value.length && !schemas.value.includes(activeSchema.value)) {
      activeSchema.value = schemas.value.includes('public') ? 'public' : schemas.value[0];
    }
  });
}

// 浏览：某 schema 下的表（含字段列）
async function runProbe(id: string, schema = 'public') {
  probeTables.value = [];
  probing.value = true;
  await tryRequest(async () => {
    const r = await s1.listTables(id, schema);
    probeTables.value = r.tables || [];
    if (!r.reachable && r.error) {
      ElMessage.warning(`探测失败：${r.error}`);
    }
  });
  probing.value = false;
}

function onSchemaChange(schema: string) {
  if (!detail.value) return;
  previewVisible.value = false;
  runProbe(detail.value.id, schema);
}

// 打开表 → 拉取真实数据（只读分页）
async function openPreview(t: ProbeTable) {
  previewTable.value = t.table;
  previewPage.value = 1;
  previewVisible.value = true;
  await loadRows();
}

async function loadRows() {
  if (!detail.value) return;
  previewLoading.value = true;
  await tryRequest(async () => {
    previewData.value = await s1.tableRows(detail.value!.id, previewTable.value, {
      schema: activeSchema.value,
      limit: previewLimit.value,
      offset: (previewPage.value - 1) * previewLimit.value,
    });
  });
  previewLoading.value = false;
}

function onPreviewPage(p: number) {
  previewPage.value = p;
  loadRows();
}

function onPreviewSize(s: number) {
  previewLimit.value = s;
  previewPage.value = 1;
  loadRows();
}

// 单元格渲染：null/undefined → —，对象 → JSON 字符串
function fmtCell(_row: Record<string, unknown>, _col: unknown, v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

// 显式测试连接连通性（卡片上的已保存连接）
async function runTest(id: string) {
  await tryRequest(async () => {
    const r = await s1.testConnection(id);
    if (r.reachable) ElMessage.success(`「${id}」连接正常`);
    else ElMessage.error(`连接失败：${r.error}`);
    // 状态已由后端回写（connected / error），刷新列表同步标签
    await load();
  });
}

// 删除连接（带二次确认）
async function onDelete(c: SourceConnection) {
  try {
    await ElMessageBox.confirm(
      `确定删除数据源连接「${c.displayName}」吗？该操作不可恢复。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    );
  } catch {
    return; // 用户取消
  }
  await tryRequest(async () => {
    await s1.deleteConnection(c.id);
    ElMessage.success('连接已删除');
    await load();
  });
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
          <span class="conn-card__icon">{{ c.icon || '🗄️' }}</span>
          <span class="conn-card__name">{{ c.displayName }}</span>
          <ElTag size="small" type="info">{{ kindLabels[c.kind] }}</ElTag>
        </div>
        <p class="conn-card__meta">
          <ElTag size="small" :type="statusType[c.status]">{{ c.status }}</ElTag>
          <ElTag size="small" type="warning">只读</ElTag>
        </p>
        <div class="conn-card__summary">
          <span class="kv">
            <span class="kv__k">类型</span>
            <span class="kv__v">{{ dbTypeLabels[(c.connectionMeta.dbType as DbType) || 'postgres'] }}</span>
          </span>
          <span class="kv" v-if="c.connectionMeta.database">
            <span class="kv__k">库</span>
            <span class="kv__v mono">{{ c.connectionMeta.database }}</span>
          </span>
        </div>
        <div class="conn-card__actions">
          <ElButton size="small" @click.stop="openEdit(c)">编辑</ElButton>
          <ElButton size="small" type="primary" @click.stop="runTest(c.id)">测试连接</ElButton>
          <ElButton size="small" type="danger" @click.stop="onDelete(c)">删除</ElButton>
        </div>
      </ElCard>

      <div v-if="!loading && conns.length === 0" class="empty-hint">
        暂无连接，点击右上角「新建连接」。
      </div>
    </div>

    <!-- 新建 / 编辑 连接 -->
    <ElDialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑数据源连接' : '新建数据源连接'"
      width="560px"
      align-center
      :lock-scroll="true"
      :append-to-body="false"
      :close-on-click-modal="false"
    >
      <ElForm label-position="top">
        <ElFormItem label="名称" required>
          <ElInput v-model="form.displayName" placeholder="如：销售库（只读副本）" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="form.kind" style="width: 100%">
            <ElOption v-for="(label, k) in kindLabels" :key="k" :label="label" :value="k" />
          </ElSelect>
        </ElFormItem>

        <template v-if="form.kind === 'database'">
          <ElFormItem label="数据库类型">
            <ElSelect v-model="form.dbType" style="width: 100%" @change="onDbTypeChange">
              <ElOption v-for="(label, k) in dbTypeLabels" :key="k" :label="label" :value="k" />
            </ElSelect>
          </ElFormItem>
          <div class="form-row">
            <ElFormItem label="主机" required class="grow">
              <ElInput v-model="form.host" placeholder="如：db.internal" />
            </ElFormItem>
            <ElFormItem label="端口" class="port">
              <ElInput v-model="form.port" placeholder="5432" />
            </ElFormItem>
          </div>
          <div class="form-row">
            <ElFormItem label="账号" class="grow">
              <ElInput v-model="form.user" :placeholder="form.dbType === 'mysql' ? 'root' : 'ontology'" />
            </ElFormItem>
            <ElFormItem label="密码" class="grow">
              <ElInput v-model="form.password" type="password" show-password placeholder="源库只读账号密码" />
            </ElFormItem>
          </div>

          <!-- 测试连接：必须先测通，才能选库/schema -->
          <div class="form-row test-row">
            <ElButton
              type="primary"
              plain
              :loading="testing"
              @click="runTestInDialog"
            >测试连接</ElButton>
            <ElAlert
              v-if="testResult"
              class="test-inline"
              :type="testResult.ok ? 'success' : 'error'"
              :title="testResult.ok ? '连接成功' : '连接失败'"
              :description="testResult.msg"
              :closable="false"
              show-icon
            />
          </div>

          <ElFormItem label="数据库（schema）" class="db-select">
            <ElSelect
              v-model="form.database"
              filterable
              allow-create
              :disabled="!testResult?.ok && !isEdit"
              :loading="loadingDbs"
              :placeholder="isEdit ? '已保存的数据库（可修改）' : '请先测试连接，再选择数据库'"
              style="width: 100%"
            >
              <ElOption v-for="d in dbList" :key="d" :label="d" :value="d" />
            </ElSelect>
            <p v-if="!testResult?.ok && !isEdit" class="form-hint">需先点击「测试连接」并成功后，才能选择数据库。</p>
            <p v-else-if="isEdit" class="form-hint">已载入保存的数据库；如需切换，请先点击「测试连接」刷新列表。</p>
          </ElFormItem>

          <p class="form-hint">凭据将以明文保存在 connectionMeta 中（演示用）；生产环境应改用 secretRef 指向 S6 托管凭据。</p>
        </template>

        <ElFormItem v-if="form.kind !== 'database'" label="连接地址">
          <ElInput v-model="form.host" :placeholder="form.kind === 'api' ? 'https://api.example.com' : 's3://bucket/path'" />
        </ElFormItem>

        <ElFormItem label="凭据引用（secretRef）">
          <ElInput v-model="form.secretRef" placeholder="如：secret://sales-ro（指向 S6 托管凭据）" />
        </ElFormItem>
        <ElFormItem label="图标">
          <div class="icon-picker">
            <span
              v-for="ic in iconOptions"
              :key="ic"
              class="icon-opt"
              :class="{ active: form.icon === ic }"
              @click="form.icon = ic"
            >{{ ic }}</span>
          </div>
        </ElFormItem>
      </ElForm>
      <p class="form-hint">S1 连接为只读接入，禁止写回源端。</p>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submit">{{ isEdit ? '保存' : '创建' }}</ElButton>
      </template>
    </ElDialog>

    <!-- 详情抽屉：连接信息 + 测试 + 探测到的表 -->
    <ElDrawer v-model="drawerVisible" :title="detail?.displayName" size="440px">
      <template v-if="detail">
        <div class="drawer-actions">
          <ElButton
            type="primary"
            size="small"
            :loading="testing"
            @click="runTest(detail.id)"
          >测试连接</ElButton>
          <ElButton size="small" :loading="probing" @click="runProbe(detail.id, activeSchema)">重新探测</ElButton>
        </div>
        <ElAlert
          v-if="testResult"
          class="test-alert"
          :type="testResult.ok ? 'success' : 'error'"
          :title="testResult.ok ? '连接成功' : '连接失败'"
          :description="testResult.msg"
          :closable="false"
          show-icon
        />

        <ElDescriptions :column="1" border size="small">
          <ElDescriptionsItem label="ID"><span class="mono">{{ detail.id }}</span></ElDescriptionsItem>
          <ElDescriptionsItem label="类型">{{ kindLabels[detail.kind] }}</ElDescriptionsItem>
          <ElDescriptionsItem v-if="detail.kind === 'database'" label="数据库类型">
            {{ dbTypeLabels[(detail.connectionMeta.dbType as DbType) || 'postgres'] }}
          </ElDescriptionsItem>
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
          <ElDescriptionsItem v-for="item in redactMeta(detail.connectionMeta)" :key="item.key" :label="item.key">
            <span class="mono">{{ item.value }}</span>
          </ElDescriptionsItem>
        </ElDescriptions>

        <h4 class="drawer-sub">浏览表（{{ probeTables.length }}）</h4>
        <div class="schema-row">
          <ElSelect v-model="activeSchema" size="small" style="flex: 1" @change="onSchemaChange">
            <ElOption v-for="s in schemas" :key="s" :label="s" :value="s" />
          </ElSelect>
          <ElButton size="small" :loading="probing" @click="runProbe(detail.id, activeSchema)">刷新</ElButton>
        </div>
        <div v-loading="probing">
          <ul v-if="probeTables.length" class="table-list">
            <li
              v-for="t in probeTables"
              :key="t.table"
              class="table-list__item table-list__item--clickable"
              @click="openPreview(t)"
            >
              <span class="mono">{{ t.table }}</span>
              <span class="table-list__cols">{{ t.columns.length }} 字段 · 查看数据</span>
            </li>
          </ul>
          <p v-else class="drawer-empty">暂无可见表（或连接尚未就绪）。</p>
        </div>
      </template>
    </ElDrawer>

    <!-- 表数据预览：打开表 → 查看真实数据（只读分页） -->
    <ElDrawer
      v-model="previewVisible"
      :title="`${activeSchema}.${previewTable}`"
      size="760px"
      append-to-body
    >
      <div v-loading="previewLoading">
        <p v-if="previewData" class="form-hint">
          共 {{ previewData.total }} 行 · 当前第 {{ previewData.offset + 1 }}–{{ previewData.offset + previewData.rows.length }} 行 · 只读预览
        </p>
        <ElTable :data="previewData?.rows || []" size="small" border height="440" empty-text="无数据">
          <ElTableColumn
            v-for="c in previewData?.columns || []"
            :key="c.name"
            :prop="c.name"
            :label="c.name"
            :formatter="fmtCell"
            show-overflow-tooltip
            min-width="120"
          />
        </ElTable>
        <div class="preview-pager">
          <ElPagination
            layout="total, sizes, prev, pager, next"
            :total="previewData?.total || 0"
            :page-size="previewLimit"
            :current-page="previewPage"
            :page-sizes="[20, 50, 100, 200]"
            @current-change="onPreviewPage"
            @size-change="onPreviewSize"
          />
        </div>
      </div>
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
  align-items: stretch;
  gap: var(--space-3);
}
.conn-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 200px;
  min-width: 240px;
}
.conn-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.conn-card__actions {
  margin-top: auto;
  padding-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.conn-card__actions .el-button { margin-left: 0; }
.form-row {
  display: flex;
  gap: var(--space-3);
}
.form-row .grow { flex: 1; }
.form-row .port { width: 120px; flex: none; }
.drawer-actions {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.test-alert { margin-bottom: var(--space-3); }
.test-row {
  align-items: flex-start;
  margin-bottom: var(--space-2);
}
.test-row .test-inline {
  flex: 1;
}
.db-select :deep(.el-form-item__content) {
  display: block;
}

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.icon-opt {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
}
.icon-opt:hover { border-color: var(--primary); }
.icon-opt.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-soft);
}
.conn-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.conn-card__icon {
  font-size: 20px;
  line-height: 1;
  flex: 0 0 auto;
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
  overflow-y: auto;
  min-height: 0;
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
.table-list__item--clickable { cursor: pointer; transition: background .15s; }
.table-list__item--clickable:hover { background: var(--primary-soft); }
.table-list__cols { color: var(--text-muted); font-size: 12px; }
.drawer-empty { font-size: 12px; color: var(--text-muted); }
.schema-row {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.preview-pager {
  margin-top: var(--space-3);
  display: flex;
  justify-content: flex-end;
}
</style>
