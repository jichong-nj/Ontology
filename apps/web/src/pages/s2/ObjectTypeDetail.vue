<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDescriptions, ElDescriptionsItem,
  ElIcon, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption,
} from 'element-plus';
import { Link, Coin, Edit, Connection, Cpu } from '@element-plus/icons-vue';
import { s2, s1, s2link, s2functions } from '@/api';
import type { ObjectType, OntologyProperty, SourceConnection, ProbeTable, LinkType, DerivedSpec, OntologyFunction } from '@/api';
import { parseDerivedSpec } from '@/api';
import { tryRequest } from '@/utils/error';

const props = defineProps<{ apiName?: string }>();
const emit = defineEmits<{ (e: 'updated'): void }>();

const route = useRoute();
const router = useRouter();
const obj = ref<ObjectType | null>(null);
const connections = ref<SourceConnection[]>([]);
const tables = ref<ProbeTable[]>([]);
const linkTypes = ref<LinkType[]>([]);
const tablesLoading = ref(false);
const loading = ref(false);

const targetApiName = () => props.apiName ?? (route.params.apiName as string);

// 派生属性实时计算
const derivedCalc = reactive<Record<string, { rid: string; value: unknown; loading: boolean; error?: string }>>({});
function ensureCalc(propApi: string) {
  if (!derivedCalc[propApi]) derivedCalc[propApi] = { rid: '', value: '', loading: false };
  return derivedCalc[propApi];
}
async function calcDerived(p: OntologyProperty) {
  const c = ensureCalc(p.apiName);
  if (!c.rid) { c.error = '请输入对象实例标识（rid）'; return; }
  c.loading = true; c.error = undefined;
  await tryRequest(async () => {
    const r = await s2.computeDerived(targetApiName(), p.apiName, c.rid);
    c.value = r.value;
  });
  c.loading = false;
}

const dataTypes = ['string', 'integer', 'double', 'boolean', 'date', 'datetime', 'long', 'short', 'byte', 'decimal', 'float'];

function connName(id?: string) {
  if (!id) return '—';
  return connections.value.find((c) => c.id === id)?.displayName || id;
}

// 派生属性 reducer 解析 / 配置辅助
const AGG_OPS = ['avgLinks', 'sumLinks', 'minLinks', 'maxLinks', 'collectLinks'];
function derivedOp(p: OntologyProperty): string {
  return parseDerivedSpec(p.reducer)?.op ?? 'countLinks';
}
function derivedLinkType(p: OntologyProperty): string {
  return parseDerivedSpec(p.reducer)?.linkType ?? '';
}
function derivedSide(p: OntologyProperty): 'source' | 'target' {
  return parseDerivedSpec(p.reducer)?.side ?? 'target';
}
function derivedProp(p: OntologyProperty): string {
  return parseDerivedSpec(p.reducer)?.prop ?? '';
}
function derivedDistinct(p: OntologyProperty): boolean {
  return parseDerivedSpec(p.reducer)?.distinct ?? false;
}
function derivedAsSet(p: OntologyProperty): boolean {
  return parseDerivedSpec(p.reducer)?.asSet ?? false;
}
function derivedSingle(p: OntologyProperty): boolean {
  return parseDerivedSpec(p.reducer)?.single ?? false;
}
function derivedLimit(p: OntologyProperty): number | undefined {
  return parseDerivedSpec(p.reducer)?.limit;
}
// 切换算子时清理与新算子无关的字段，避免脏配置
function onDerivedOpChange(p: OntologyProperty, op: string) {
  const base: Partial<DerivedSpec> = { op: op as DerivedSpec['op'] };
  if (op === 'countLinks') base.side = derivedSide(p);
  if (op === 'expression') base.expr = parseDerivedSpec(p.reducer)?.expr ?? '';
  if (AGG_OPS.includes(op)) {
    base.linkType = derivedLinkType(p);
    base.side = derivedSide(p);
    base.prop = derivedProp(p);
  }
  if (op === 'collectLinks') {
    base.limit = derivedLimit(p);
    base.asSet = derivedAsSet(p);
    base.single = derivedSingle(p);
  }
  setDerivedSpec(p, base);
}
function setDerivedSpec(p: OntologyProperty, patch: Partial<DerivedSpec>) {
  const spec: DerivedSpec = { op: 'countLinks', ...(parseDerivedSpec(p.reducer) ?? {}), ...patch };
  p.reducer = JSON.stringify(spec);
}
function onToggleDerived(p: OntologyProperty, val: boolean) {
  p.derived = val;
  if (val && !p.reducer) {
    p.reducer = JSON.stringify({ op: 'countLinks', linkType: '', side: 'target' } as DerivedSpec);
  }
}
function derivedReducerFn(p: OntologyProperty): string {
  return p.reducerFn ?? '';
}
// 引用函数：选中则写入 reducerFn 并清空结构化 reducer；清空则回到结构化模式
function onReducerFnChange(p: OntologyProperty, fnApi: string) {
  if (fnApi) {
    p.reducerFn = fnApi;
    p.reducer = '';
  } else {
    delete p.reducerFn;
    if (!p.reducer) p.reducer = JSON.stringify({ op: 'countLinks', linkType: '', side: 'target' } as DerivedSpec);
  }
}

const functions = ref<OntologyFunction[]>([]);
async function loadFunctions() {
  await tryRequest(async () => { functions.value = await s2functions.list(); });
}

async function load() {
  const apiName = targetApiName();
  if (!apiName) return;
  loading.value = true;
  await tryRequest(async () => {
    const [o, cs, lts] = await Promise.all([
      s2.getObjectType(apiName),
      s1.listConnections(),
      s2link.listLinkTypes(),
    ]);
    obj.value = o;
    connections.value = cs;
    linkTypes.value = lts;
  });
  await loadFunctions();
  loading.value = false;
}

async function onDelete() {
  if (!obj.value) return;
  await tryRequest(async () => {
    await s2.deleteObjectType(obj.value!.apiName);
    ElMessage.success('已删除');
    emit('updated');
    router.push('/s2/object-types');
  });
}

/* ===== 编辑 ===== */
const editVisible = ref(false);
const saving = ref(false);
const editForm = reactive<{
  displayName: string; description: string; sourceConnectionId: string; sourceTable: string; titleProperty: string;
  properties: OntologyProperty[];
}>({ displayName: '', description: '', sourceConnectionId: '', sourceTable: '', titleProperty: '', properties: [] });

async function onEditConnectionChange(connId: string) {
  editForm.sourceTable = '';
  tables.value = [];
  if (!connId) return;
  tablesLoading.value = true;
  await tryRequest(async () => {
    tables.value = await s1.probe(connId);
  });
  tablesLoading.value = false;
}

function openEdit() {
  if (!obj.value) return;
  editForm.displayName = obj.value.displayName;
  editForm.description = obj.value.description ?? '';
  editForm.sourceConnectionId = obj.value.sourceConnectionId ?? '';
  editForm.sourceTable = obj.value.sourceTable ?? '';
  editForm.titleProperty = obj.value.titleProperty ?? '';
  editForm.properties = obj.value.properties.map((p) => ({ ...p }));
  editVisible.value = true;
  tables.value = [];
  if (editForm.sourceConnectionId) {
    tablesLoading.value = true;
    tryRequest(async () => {
      tables.value = await s1.probe(editForm.sourceConnectionId);
    }).finally(() => { tablesLoading.value = false; });
  }
}
function addProp() {
  editForm.properties.push({ apiName: '', displayName: '', type: 'string', required: false, derived: false });
}
function removeProp(i: number) {
  editForm.properties.splice(i, 1);
}

async function saveEdit() {
  if (!obj.value) return;
  saving.value = true;
  await tryRequest(async () => {
    const payload: ObjectType = {
      apiName: obj.value!.apiName,
      displayName: editForm.displayName,
      description: editForm.description,
      sourceConnectionId: editForm.sourceConnectionId || undefined,
      sourceTable: editForm.sourceTable || undefined,
      titleProperty: editForm.titleProperty || undefined,
      properties: editForm.properties.map((p) => ({
        apiName: p.apiName, displayName: p.displayName, type: p.type,
        required: !!p.required,
        ...(p.derived ? { derived: true, reducer: p.reducer } : {}),
      })),
    };
    await s2.updateObjectType(obj.value!.apiName, payload);
    ElMessage.success('已保存');
    editVisible.value = false;
    await load();
    emit('updated');
  });
  saving.value = false;
}

onMounted(load);
watch(() => route.params.apiName, load);
</script>

<template>
  <div v-loading="loading" class="detail">
    <template v-if="obj">
      <header class="detail__head">
        <div class="detail__title">
          <h1>{{ obj.displayName }}</h1>
          <ElTag size="small" type="info">{{ obj.apiName }}</ElTag>
        </div>
        <div class="detail__actions">
          <ElButton size="small" @click="openEdit"><ElIcon><Edit /></ElIcon> 编辑</ElButton>
          <ElButton size="small" type="danger" plain @click="onDelete">删除</ElButton>
        </div>
      </header>

      <div class="detail__columns">
        <ElCard class="detail-card detail-card--side" shadow="never">
          <template #header><span class="card-title"><ElIcon><Coin /></ElIcon> 概览 / 数据源映射</span></template>
          <ElDescriptions :column="1" border size="small">
            <ElDescriptionsItem label="显示名称">{{ obj.displayName }}</ElDescriptionsItem>
            <ElDescriptionsItem label="API 名称">{{ obj.apiName }}</ElDescriptionsItem>
            <ElDescriptionsItem label="显示名属性">
              <span v-if="obj.titleProperty" class="mono">{{ obj.titleProperty }}</span>
              <span v-else class="ds-empty">未设置</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="数据源">
              <ElTag v-if="obj.sourceConnectionId" type="primary" effect="light">
                {{ connName(obj.sourceConnectionId) }}
              </ElTag>
              <span v-else class="ds-empty">未关联</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="源表">
              <span class="mono">{{ obj.sourceTable || '—' }}</span>
            </ElDescriptionsItem>
          </ElDescriptions>
          <p class="detail__desc">{{ obj.description || '暂无描述' }}</p>
          <p v-if="!obj.sourceConnectionId" class="ds-hint">
            该对象类型尚未关联数据源，点击「编辑」选择连接与源表。
          </p>
        </ElCard>

        <ElCard class="detail-card detail-card--props" shadow="never">
          <template #header><span class="card-title"><ElIcon><Link /></ElIcon> 属性 ({{ obj.properties.length }})</span></template>
          <table class="prop-table">
            <thead>
              <tr><th>属性</th><th>显示名</th><th>类型</th><th>必填</th><th>派生</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in obj.properties" :key="p.apiName">
                <td class="mono">{{ p.apiName }}</td>
                <td>{{ p.displayName }}</td>
                <td><ElTag size="small">{{ p.type }}</ElTag></td>
                <td>{{ p.required ? '是' : '否' }}</td>
                <td>
                  <template v-if="p.derived">
                    <ElTag size="small" type="warning"><ElIcon><Cpu /></ElIcon> 派生</ElTag>
                    <div class="derived-calc">
                      <ElInput v-model="ensureCalc(p.apiName).rid" size="small" placeholder="对象实例 rid" style="width: 140px" />
                      <ElButton size="small" :loading="ensureCalc(p.apiName).loading" @click="calcDerived(p)">计算</ElButton>
                      <span v-if="ensureCalc(p.apiName).error" class="derived-err">{{ ensureCalc(p.apiName).error }}</span>
                      <span v-else-if="ensureCalc(p.apiName).value !== '' && ensureCalc(p.apiName).value !== undefined" class="derived-val">
                        = {{ ensureCalc(p.apiName).value }}
                      </span>
                    </div>
                  </template>
                  <span v-else>—</span>
                </td>
              </tr>
              <tr v-if="obj.properties.length === 0">
                <td colspan="5" class="empty">暂无属性</td>
              </tr>
            </tbody>
          </table>
        </ElCard>
      </div>
    </template>

    <div v-else-if="!loading" class="detail-empty">未找到该对象类型。</div>

    <!-- 编辑弹窗 -->
    <ElDialog v-model="editVisible" title="编辑对象类型" width="900px" top="5vh" destroy-on-close class="edit-obj-dialog">
      <ElForm label-position="top">
        <ElFormItem label="显示名称"><ElInput v-model="editForm.displayName" /></ElFormItem>
        <ElFormItem label="描述"><ElInput v-model="editForm.description" type="textarea" :rows="2" /></ElFormItem>
        <div class="edit-grid">
          <ElFormItem label="数据源连接">
            <ElSelect v-model="editForm.sourceConnectionId" placeholder="选择连接" clearable filterable style="width: 100%" @change="onEditConnectionChange">
              <ElOption v-for="c in connections" :key="c.id" :label="c.displayName" :value="c.id" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="源表">
            <ElSelect
              v-model="editForm.sourceTable"
              placeholder="先选择连接，再选表"
              filterable
              clearable
              :loading="tablesLoading"
              :disabled="!editForm.sourceConnectionId"
              style="width: 100%"
            >
              <ElOption v-for="t in tables" :key="t.table" :label="t.table" :value="t.table" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="显示名属性">
            <ElSelect v-model="editForm.titleProperty" placeholder="选择展示用的属性（可选）" filterable clearable style="width: 100%">
              <ElOption v-for="p in editForm.properties.filter((x:any)=>!x.derived)" :key="p.apiName" :label="`${p.displayName} (${p.apiName})`" :value="p.apiName" />
            </ElSelect>
          </ElFormItem>
        </div>

        <div class="wizard-props__head">
          <span>属性</span>
          <ElButton size="small" @click="addProp">添加属性</ElButton>
        </div>
        <div v-for="(p, i) in editForm.properties" :key="i" class="wizard-prop-row">
          <ElInput v-model="p.apiName" placeholder="字段名" />
          <ElInput v-model="p.displayName" placeholder="显示名" />
          <ElSelect v-model="p.type" style="width: 120px">
            <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
          </ElSelect>
          <ElButton text type="danger" @click="removeProp(i)">
            <ElIcon><Link /></ElIcon>
          </ElButton>
        </div>
        <!-- 派生属性配置 -->
        <template v-for="(p, i) in editForm.properties" :key="'der-' + i">
          <div v-if="p.derived" class="derived-cfg">
            <ElTag size="small" type="warning">派生 #{{ i + 1 }}</ElTag>
            <span class="derived-cfg__label">算子</span>
            <ElSelect :model-value="derivedOp(p)" style="width: 170px" @change="(v:string)=>onDerivedOpChange(p,v)">
              <ElOption label="关联计数(countLinks)" value="countLinks" />
              <ElOption label="对端均值(avgLinks)" value="avgLinks" />
              <ElOption label="对端求和(sumLinks)" value="sumLinks" />
              <ElOption label="对端最小(minLinks)" value="minLinks" />
              <ElOption label="对端最大(maxLinks)" value="maxLinks" />
              <ElOption label="收集列表(collectLinks)" value="collectLinks" />
              <ElOption label="表达式(expression)" value="expression" />
            </ElSelect>
            <span class="derived-cfg__label">或引用函数</span>
            <ElSelect :model-value="derivedReducerFn(p)" placeholder="选择已注册函数（与上面算子二选一）" style="width: 240px" clearable @change="(v:string)=>onReducerFnChange(p,v)">
              <ElOption v-for="fn in functions" :key="fn.apiName" :label="`${fn.displayName} (${fn.apiName})`" :value="fn.apiName" />
            </ElSelect>
            <template v-if="derivedOp(p) !== 'expression' && !derivedReducerFn(p)">
              <span class="derived-cfg__label">关系类型</span>
              <ElSelect :model-value="derivedLinkType(p)" placeholder="选择关系" style="width: 230px" @change="(v:string)=>setDerivedSpec(p,{linkType:v})">
                <ElOption v-for="lt in linkTypes" :key="lt.apiName" :label="`${lt.displayName} (${lt.sourceType}→${lt.targetType})`" :value="lt.apiName" />
              </ElSelect>
              <span class="derived-cfg__label">本对象角色</span>
              <ElSelect :model-value="derivedSide(p)" style="width: 130px" @change="(v:'source'|'target')=>setDerivedSpec(p,{side:v})">
                <ElOption label="source（起点）" value="source" />
                <ElOption label="target（终点）" value="target" />
              </ElSelect>
            </template>
            <template v-if="derivedOp(p) === 'countLinks'">
              <ElCheckbox :model-value="derivedDistinct(p)" @change="(v:any)=>setDerivedSpec(p,{distinct:!!v})">按对端去重</ElCheckbox>
            </template>
            <template v-if="AGG_OPS.includes(derivedOp(p))">
              <span class="derived-cfg__label">{{ derivedOp(p) === 'collectLinks' ? '收集属性' : '对端属性' }}</span>
              <ElInput :model-value="derivedProp(p)" size="small" style="width: 150px" :placeholder="derivedOp(p)==='collectLinks' ? '如：name' : '如：workHours'" @update:model-value="(v:string)=>setDerivedSpec(p,{prop:v})" />
            </template>
            <template v-if="derivedOp(p) === 'collectLinks'">
              <ElCheckbox :model-value="derivedAsSet(p)" @change="(v:any)=>setDerivedSpec(p,{asSet:!!v})">去重集合</ElCheckbox>
              <ElCheckbox :model-value="derivedSingle(p)" @change="(v:any)=>setDerivedSpec(p,{single:!!v})" title="关系唯一端只取一个对端属性（如 Project 的 Lead engineer name）">单链接取标量</ElCheckbox>
              <span class="derived-cfg__label">上限</span>
              <ElInput :model-value="derivedLimit(p)" size="small" style="width: 88px" placeholder="全部" @update:model-value="(v:string)=>setDerivedSpec(p,{limit:v?Number(v):undefined})" />
            </template>
            <template v-if="derivedOp(p) === 'expression'">
              <span class="derived-cfg__label">表达式</span>
              <ElInput :model-value="derivedProp(p)" size="small" style="width: 200px" placeholder="占位（第一期不执行）" @update:model-value="(v:string)=>setDerivedSpec(p,{expr:v})" />
            </template>
          </div>
          <ElCheckbox v-model="p.derived" class="derived-chk" @change="(v:any)=>onToggleDerived(p, !!v)">
            属性「{{ p.apiName || '未命名' }}」设为派生（计算值）
          </ElCheckbox>
        </template>
      </ElForm>
      <template #footer>
        <ElButton @click="editVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="saving" @click="saveEdit">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}
.detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.detail__title h1 {
  font-size: 20px;
  margin: 0;
}
.detail__columns {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-4);
  align-items: start;
}
@media (max-width: 880px) {
  .detail__columns { grid-template-columns: 1fr; }
}
.card-title {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: 600;
  font-size: 13px;
}
.detail__desc {
  margin-top: var(--space-2);
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* 数据源映射块 */
.ds-block { display: flex; flex-direction: column; gap: var(--space-2); }
.ds-row { display: flex; align-items: center; gap: var(--space-2); }
.ds-label { width: 64px; color: var(--text-muted); font-size: 13px; }
.ds-value { font-size: 14px; }
.ds-empty { color: var(--text-muted); }
.ds-hint { margin: var(--space-1) 0 0; font-size: 12px; color: var(--text-muted); }
.mono { font-family: var(--font-mono); font-size: 13px; }

.prop-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.prop-table th, .prop-table td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}
.prop-table th {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 12px;
}
.prop-table .mono { font-size: 12px; }
.empty { text-align: center; color: var(--text-muted); padding: 16px; }
.detail-empty { color: var(--text-muted); padding: var(--space-6); }

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.wizard-props__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--space-2) 0 var(--space-1);
  font-size: 13px;
  font-weight: 600;
}
.wizard-prop-row {
  display: grid;
  grid-template-columns: 1fr 1fr 120px auto;
  gap: var(--space-1);
  margin-bottom: var(--space-1);
}
.derived-cfg {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-2);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-1);
  background: var(--accent-soft);
  border-radius: var(--radius);
}
.derived-cfg__label { font-size: 12px; color: var(--text-secondary); }
.derived-cfg__hint { font-size: 12px; color: var(--text-muted); }
.derived-chk { margin: 2px 0 var(--space-2); font-size: 13px; }
.derived-calc {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: 4px;
}
.derived-val { font-weight: 600; color: var(--accent); font-size: 13px; }
.derived-err { color: var(--el-color-danger, #f56c6c); font-size: 12px; }

/* 编辑对象类型弹窗：固定大小 + body 内部滚动 */
.edit-obj-dialog :deep(.el-overlay) {
  overflow: hidden !important;
}
.edit-obj-dialog :deep(.el-dialog) {
  margin-top: 5vh !important;
  height: 82vh !important;
  max-height: 86vh !important;
  display: flex !important;
  flex-direction: column !important;
}
.edit-obj-dialog :deep(.el-dialog__header) {
  flex-shrink: 0 !important;
}
.edit-obj-dialog :deep(.el-dialog__body) {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-right: var(--space-3) !important;
}
.edit-obj-dialog :deep(.el-dialog__footer) {
  flex-shrink: 0 !important;
}
</style>
