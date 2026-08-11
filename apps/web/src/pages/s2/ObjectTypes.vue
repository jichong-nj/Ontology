<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption, ElSteps, ElStep, ElCheckbox, ElRadio, ElDescriptions, ElDescriptionsItem,
} from 'element-plus';
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue';
import { s2, s1 } from '@/api';
import type { ObjectType, SourceConnection, ProbeTable, ProbeColumn, OntologyProperty } from '@/api';
import { tryRequest } from '@/utils/error';

interface PropRow {
  apiName: string;
  displayName: string;
  type: string;
  sourceColumn: string;
  isPrimaryKey: boolean;
  selected: boolean;
}

const router = useRouter();
const route = useRoute();
const types = ref<ObjectType[]>([]);
const loading = ref(false);
const triggering = ref(false);

// 触发离职风险评估函数：部门平均上班时间 < 阈值（默认80%）即置 dimissionRisk=true
async function triggerDimissionRisk() {
  triggering.value = true;
  await tryRequest(async () => {
    const res = await s2.invokeFunction('evaluateDimissionRisk', { threshold: 0.8 });
    const flagged = (res as any)?.result?.flaggedEmployees ?? [];
    if (flagged.length) {
      const names = flagged.map((f: any) => `${f.name}(${f.workHours}h)`).join('、');
      ElMessage.warning(`检测到 ${flagged.length} 名员工离职风险：${names}`);
    } else {
      ElMessage.success('未检测到离职风险人员');
    }
    if (isActive('Employee') || isActive('Department')) await load();
  });
  triggering.value = false;
}

/* ============ 向导式新建 ============ */
const wizardVisible = ref(false);
const connections = ref<SourceConnection[]>([]);
const tables = ref<ProbeTable[]>([]);
const tablesLoading = ref(false);
const activeStep = ref(0);
const submitting = ref(false);

const dataTypes = ['string', 'integer', 'double', 'boolean', 'date', 'datetime', 'long', 'short', 'byte', 'decimal', 'float'];

const form = reactive<{
  displayName: string;
  apiName: string;
  description: string;
  connectionId: string;
  sourceTable: string;
  primaryKey: string;
  properties: PropRow[];
}>({
  displayName: '', apiName: '', description: '', connectionId: '', sourceTable: '', primaryKey: '', properties: [],
});

const steps = ['选择数据源', '定义属性', '对象类型信息', '确认'];

async function openWizard() {
  wizardVisible.value = true;
  activeStep.value = 0;
  form.displayName = ''; form.apiName = ''; form.description = '';
  form.connectionId = ''; form.sourceTable = ''; form.primaryKey = ''; form.properties = [];
  tables.value = [];
  await tryRequest(async () => {
    connections.value = await s1.listConnections();
  });
}

async function onConnectionChange(connId: string) {
  form.sourceTable = '';
  form.properties = [];
  form.primaryKey = '';
  tables.value = [];
  if (!connId) return;
  tablesLoading.value = true;
  await tryRequest(async () => {
    tables.value = await s1.probe(connId);
  });
  tablesLoading.value = false;
}

// 当选表后，自动把列导入为属性（Palantir 风格的「Import columns」）
async function onTableChange(tableName: string) {
  form.properties = [];
  form.primaryKey = '';
  if (!tableName) return;
  const t = tables.value.find((x) => x.table === tableName);
  if (!t) return;
  form.properties = t.columns.map((c: ProbeColumn) => ({
    apiName: c.name,
    displayName: c.name,
    type: mapSqlType(c.dataType),
    sourceColumn: c.name,
    isPrimaryKey: c.isPrimaryKey,
    selected: true,
  }));
  const pk = t.columns.find((c) => c.isPrimaryKey);
  if (pk) form.primaryKey = pk.name;
  ElMessage.info(`已从「${tableName}」导入 ${t.columns.length} 个字段`);
}

function mapSqlType(sql: string): string {
  const s = sql.toLowerCase();
  if (s.includes('int')) return 'integer';
  if (s.includes('double') || s.includes('numeric') || s.includes('decimal')) return 'double';
  if (s.includes('float')) return 'float';
  if (s.includes('bool')) return 'boolean';
  if (s.includes('timestamp') || s.includes('datetime')) return 'datetime';
  if (s.includes('date')) return 'date';
  return 'string';
}

function selectedProps() {
  return form.properties.filter((p) => p.selected);
}

function nextStep() {
  if (activeStep.value === 0) {
    // 数据源为可选：对象类型可独立创建；但若选了连接，则必须指定源表
    if (form.connectionId && !form.sourceTable) {
      ElMessage.warning('已选择连接，请继续选择源表');
      return;
    }
  }
  if (activeStep.value === 1 && selectedProps().length === 0) {
    ElMessage.warning('请至少选择一个属性');
    return;
  }
  if (activeStep.value === 2) {
    if (!form.displayName || !form.apiName) {
      ElMessage.warning('请填写显示名称与 API 名称');
      return;
    }
    if (!form.primaryKey) {
      ElMessage.warning('请选择一个主键属性');
      return;
    }
  }
  if (activeStep.value < steps.length - 1) activeStep.value++;
}
function prevStep() {
  if (activeStep.value > 0) activeStep.value--;
}

async function submitWizard() {
  submitting.value = true;
  await tryRequest(async () => {
    const props = selectedProps();
    const payload = {
      objectType: {
        apiName: form.apiName,
        displayName: form.displayName,
        description: form.description,
        sourceConnectionId: form.connectionId || undefined,
        sourceTable: form.sourceTable || undefined,
        properties: props.map((p) => ({
          apiName: p.apiName, displayName: p.displayName, type: p.type, required: p.isPrimaryKey,
        })) as OntologyProperty[],
      },
      sourceConnectionId: form.connectionId || undefined,
      sourceTable: form.sourceTable || undefined,
      fieldMappings: props.map((p) => ({
        property: p.apiName, sourceColumn: p.sourceColumn,
      })),
    };
    await s2.createObjectTypeWithMapping(payload);
    ElMessage.success('对象类型创建成功');
    wizardVisible.value = false;
    await load();
  });
  submitting.value = false;
}

/* ============ 列表 ============ */
async function load() {
  loading.value = true;
  await tryRequest(async () => {
    const data = await s2.listObjectTypes();
    types.value = data.sort((a: ObjectType, b: ObjectType) => a.displayName.localeCompare(b.displayName));
  });
  loading.value = false;
}

function openDetail(apiName: string) {
  router.push(`/s2/object-types/${apiName}`);
}
function isActive(apiName: string) {
  return route.params.apiName === apiName;
}
async function onDelete(t: ObjectType) {
  await tryRequest(async () => {
    await s2.deleteObjectType(t.apiName);
    ElMessage.success(`已删除 ${t.displayName}`);
    if (isActive(t.apiName)) router.push('/s2/object-types');
    await load();
  });
}

onMounted(load);
</script>

<template>
  <div class="types-layout">
    <section class="types-list">
      <header class="types-list__head">
        <div>
          <h2 class="section-title">Object Types</h2>
          <p class="section-sub">{{ types.length }} 个类型</p>
        </div>
        <ElButton type="primary" @click="openWizard">新建对象类型</ElButton>
        <ElButton type="warning" :loading="triggering" @click="triggerDimissionRisk">
          触发离职预警
        </ElButton>
      </header>

      <div v-loading="loading" class="types-list__body">
        <ElCard
          v-for="t in types"
          :key="t.apiName"
          class="type-card"
          :class="{ 'type-card--active': isActive(t.apiName) }"
          shadow="hover"
          @click="openDetail(t.apiName)"
        >
          <div class="type-card__head">
            <span class="type-card__name">{{ t.displayName }}</span>
            <ElTag size="small" type="info">{{ t.apiName }}</ElTag>
          </div>
          <p class="type-card__desc">{{ t.description || '暂无描述' }}</p>
          <div class="type-card__meta">
            <span>{{ t.properties.length }} 个属性</span>
            <span v-if="t.sourceTable" class="type-card__table">{{ t.sourceTable }}</span>
          </div>
          <div class="type-card__actions" @click.stop>
            <ElButton size="small" text type="danger" @click="onDelete(t)">删除</ElButton>
          </div>
        </ElCard>

        <div v-if="!loading && types.length === 0" class="empty-hint">
          暂无对象类型，点击右上角「新建对象类型」。
        </div>
      </div>
    </section>

    <section class="types-detail">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="Component" @updated="load" />
        <div v-else class="detail-placeholder">
          <div class="detail-placeholder__icon">◎</div>
          <p>选择一个对象类型查看详情</p>
        </div>
      </router-view>
    </section>

    <!-- ====== 向导式新建弹窗 ====== -->
    <ElDialog
      v-model="wizardVisible"
      title="新建对象类型"
      width="720px"
      :close-on-click-modal="false"
      destroy-on-close
      class="wizard-dialog"
    >
      <ElSteps :active="activeStep" align-center finish-status="success" class="wizard-steps">
        <ElStep v-for="s in steps" :key="s" :title="s" />
      </ElSteps>

      <div class="wizard-body">
        <!-- Step 0: 选择数据源 -->
        <div v-show="activeStep === 0" class="wizard-pane">
          <p class="wizard-pane__hint">选择一个已连接的数据源，并指定要映射的源表。</p>
          <ElForm label-position="top">
            <ElFormItem label="数据源连接">
              <ElSelect v-model="form.connectionId" placeholder="选择连接" filterable clearable style="width: 100%" @change="onConnectionChange">
                <ElOption v-for="c in connections" :key="c.id" :label="c.displayName" :value="c.id" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="源表">
              <ElSelect
                v-model="form.sourceTable"
                placeholder="先选择连接，再选表"
                filterable clearable
                :loading="tablesLoading"
                :disabled="!form.connectionId"
                style="width: 100%"
                @change="onTableChange"
              >
                <ElOption v-for="t in tables" :key="t.table" :label="t.table" :value="t.table" />
              </ElSelect>
            </ElFormItem>
          </ElForm>
          <p v-if="form.sourceTable" class="wizard-import-hint">
            已选择 <b class="mono">{{ form.sourceTable }}</b>，下一步将基于该表的字段生成属性。
          </p>
        </div>

        <!-- Step 1: 定义属性 -->
        <div v-show="activeStep === 1" class="wizard-pane">
          <p class="wizard-pane__hint">勾选要纳入该对象类型的字段，并核对属性定义（可来自表的列）。</p>
          <div v-if="form.properties.length" class="prop-table-wrap">
            <table class="prop-table">
              <thead>
                <tr>
                  <th style="width: 44px"></th>
                  <th>源字段</th>
                  <th>属性 API 名</th>
                  <th>显示名</th>
                  <th>类型</th>
                  <th style="width: 90px">主键</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in form.properties" :key="i" :class="{ 'prop-row--off': !p.selected }">
                  <td><ElCheckbox v-model="p.selected" /></td>
                  <td class="mono">{{ p.sourceColumn }}</td>
                  <td><ElInput v-model="p.apiName" size="small" /></td>
                  <td><ElInput v-model="p.displayName" size="small" /></td>
                  <td>
                    <ElSelect v-model="p.type" size="small" style="width: 110px">
                      <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
                    </ElSelect>
                  </td>
                  <td>
                    <ElRadio :model-value="form.primaryKey === p.apiName" :label="true" @change="form.primaryKey = p.apiName">主键</ElRadio>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="prop-empty">
            请先在「选择数据源」步骤中指定源表，系统会自动导入字段。
          </div>
        </div>

        <!-- Step 2: 对象类型信息 -->
        <div v-show="activeStep === 2" class="wizard-pane">
          <p class="wizard-pane__hint">为该对象类型设置元数据。</p>
          <ElForm label-position="top">
            <ElFormItem label="显示名称" required>
              <ElInput v-model="form.displayName" placeholder="如：客户" />
            </ElFormItem>
            <ElFormItem label="API 名称" required>
              <ElInput v-model="form.apiName" placeholder="如：Customer（创建后不可修改）" />
            </ElFormItem>
            <ElFormItem label="描述">
              <ElInput v-model="form.description" type="textarea" :rows="2" />
            </ElFormItem>
            <ElFormItem label="主键属性">
              <ElSelect v-model="form.primaryKey" placeholder="选择主键" filterable style="width: 100%">
                <ElOption v-for="p in selectedProps()" :key="p.apiName" :label="`${p.displayName} (${p.apiName})`" :value="p.apiName" />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </div>

        <!-- Step 3: 确认 -->
        <div v-show="activeStep === 3" class="wizard-pane">
          <p class="wizard-pane__hint">确认配置无误后创建对象类型。</p>
          <ElDescriptions :column="1" border size="small" class="confirm-desc">
            <ElDescriptionsItem label="显示名称">{{ form.displayName || '—' }}</ElDescriptionsItem>
            <ElDescriptionsItem label="API 名称">{{ form.apiName || '—' }}</ElDescriptionsItem>
            <ElDescriptionsItem label="数据源">
              {{ connections.find((c) => c.id === form.connectionId)?.displayName || '—' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="源表"><span class="mono">{{ form.sourceTable || '—' }}</span></ElDescriptionsItem>
            <ElDescriptionsItem label="主键属性"><span class="mono">{{ form.primaryKey || '—' }}</span></ElDescriptionsItem>
            <ElDescriptionsItem label="属性数">{{ selectedProps().length }}</ElDescriptionsItem>
          </ElDescriptions>
        </div>
      </div>

      <template #footer>
        <div class="wizard-footer">
          <ElButton v-if="activeStep > 0" :icon="ArrowLeft" @click="prevStep">上一步</ElButton>
          <span class="wizard-footer__spacer" />
          <ElButton v-if="activeStep < steps.length - 1" type="primary" :icon="ArrowRight" @click="nextStep">下一步</ElButton>
          <ElButton v-else type="primary" :icon="Check" :loading="submitting" @click="submitWizard">创建</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.types-layout {
  display: grid;
  grid-template-columns: minmax(320px, 420px) 1fr;
  gap: var(--space-4);
  height: 100%;
  min-height: 0;
}

.types-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  border-right: 1px solid var(--border);
  padding-right: var(--space-4);
}
.types-list__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.types-list__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-1);
  min-height: 0;
}

.type-card {
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.type-card--active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.type-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.type-card__name {
  font-weight: 600;
  font-size: 14px;
}
.type-card__desc {
  margin: var(--space-1) 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.type-card__meta {
  display: flex;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-muted);
}
.type-card__table {
  font-family: var(--font-mono);
}
.type-card__actions {
  margin-top: var(--space-1);
  display: flex;
  justify-content: flex-end;
}

.types-detail {
  min-height: 0;
  overflow-y: auto;
}
.detail-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: var(--space-2);
}
.detail-placeholder__icon {
  font-size: 48px;
  opacity: 0.4;
}
.empty-hint {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* ===== 向导 ===== */
.wizard-steps {
  margin-bottom: var(--space-4);
}
.wizard-body {
  min-height: 320px;
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 var(--space-2);
}
.wizard-pane__hint {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 var(--space-3);
}
.wizard-import-hint,
.prop-empty {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--accent-soft);
  border-radius: 6px;
  padding: var(--space-3);
  margin-top: var(--space-2);
}
.mono { font-family: var(--font-mono); font-size: 12px; }

.prop-table-wrap { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.prop-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.prop-table th, .prop-table td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.prop-table th {
  background: #f8fafc;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 12px;
}
.prop-row--off { opacity: 0.45; }

.confirm-desc { margin-top: var(--space-1); }

.wizard-footer {
  display: flex;
  align-items: center;
  width: 100%;
}
.wizard-footer__spacer { flex: 1; }
</style>
