<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDescriptions, ElDescriptionsItem,
  ElIcon, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption,
  ElCheckbox, ElCollapse, ElCollapseItem, ElMessageBox,
} from 'element-plus';
import { Link, Coin, Edit, Connection, Cpu, ArrowDown, Share, Delete } from '@element-plus/icons-vue';
import { s2, s1, s2link, s2functions, s2shared, valtype } from '@/api';
import type { ObjectType, OntologyProperty, SourceConnection, ProbeTable, ProbeColumn, LinkType, DerivedSpec, OntologyFunction, SharedProperty, ChildTableMapping, ChildAggregation } from '@/api';
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
const objectTypes = ref<ObjectType[]>([]);
const sharedProps = ref<SharedProperty[]>([]);
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

// 普通属性 / 派生属性 分组
const normalProps = () => (obj.value?.properties ?? []).filter((p) => !p.derived);
const derivedProps = () => (obj.value?.properties ?? []).filter((p) => p.derived);

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
// 派生类型摘要标签文本
const OP_LABELS: Record<string, string> = {
  countLinks: '关联计数', avgLinks: '对端均值', sumLinks: '对端求和',
  minLinks: '对端最小', maxLinks: '对端最大', collectLinks: '收集列表',
  expression: '表达式',
};
function derivedOpLabel(p: OntologyProperty): string {
  const fn = derivedReducerFn(p);
  if (fn) return `函数:${fn}`;
  return OP_LABELS[derivedOp(p)] ?? derivedOp(p);
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
// 对端聚合属性可选列表：根据关系类型 + 本对象角色，取另一端对象类型的属性
function aggPropOptions(p: OntologyProperty): { apiName: string; displayName: string }[] {
  const ltApi = derivedLinkType(p);
  const lt = linkTypes.value.find((l) => l.apiName === ltApi);
  if (!lt) return [];
  const side = derivedSide(p);
  // side=target 表示本对象是 target，聚合的是 source 端对象；反之亦然
  const otherType = side === 'target' ? lt.sourceType : lt.targetType;
  const ot = objectTypes.value.find((o) => o.apiName === otherType);
  if (!ot) return [];
  return ot.properties.filter((x) => !x.derived).map((x) => ({ apiName: x.apiName, displayName: x.displayName }));
}
// 派生模式：'op' = 结构化算子，'fn' = 引用已注册函数，'' = 尚未选择
function derivedMode(p: OntologyProperty): 'op' | 'fn' | '' {
  if (p.reducerFn !== undefined) return 'fn';
  if (p.reducer) return 'op';
  return '';
}
// 切换派生模式（二选一，互斥）。注意：选 'fn' 时保留 reducerFn（即便为空字符串占位）让 derivedMode 识别为 fn 模式；选 'op' 清空 reducerFn 并初始化 reducer
function onDerivedModeChange(p: OntologyProperty, mode: 'op' | 'fn' | '') {
  if (mode === 'fn') {
    p.reducer = '';            // 清空结构化配置，但保留/初始化 reducerFn 占位以维持 fn 模式
    if (p.reducerFn === undefined) p.reducerFn = '';
  } else if (mode === 'op') {
    delete p.reducerFn;
    p.reducer = JSON.stringify({ op: 'countLinks', linkType: '', side: 'target' } as DerivedSpec);
  } else {
    delete p.reducerFn;
    p.reducer = '';
  }
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

// 派生属性展开/收起状态（按属性索引）
const derivedExpanded = reactive<Record<number, boolean>>({});
function toggleDerivedExpand(i: number) {
  derivedExpanded[i] = !derivedExpanded[i];
}

async function load() {
  const apiName = targetApiName();
  if (!apiName) return;
  loading.value = true;
  await tryRequest(async () => {
    const [o, cs, lts, ots] = await Promise.all([
      s2.getObjectType(apiName),
      s1.listConnections(),
      s2link.listLinkTypes(),
      s2.listObjectTypes(),
    ]);
    obj.value = o;
    connections.value = cs;
    linkTypes.value = lts;
    objectTypes.value = ots;
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
  childTableMappings: ChildTableMapping[];
}>({ displayName: '', description: '', sourceConnectionId: '', sourceTable: '', titleProperty: '', properties: [], childTableMappings: [] });

// ---- 父子明细映射（主表 + 明细表纵向关联）----
function addChildMapping() {
  editForm.childTableMappings.push({ table: '', parentKey: '', displayName: '', aggregations: [] });
}
function removeChildMapping(i: number) {
  editForm.childTableMappings.splice(i, 1);
}
function addChildAgg(m: ChildTableMapping) {
  m.aggregations.push({ property: '', agg: 'count' });
}
function removeChildAgg(m: ChildTableMapping, i: number) {
  m.aggregations.splice(i, 1);
}
// 供聚合属性选择的可选属性：普通（非派生）属性
function childAggPropOptions(): { apiName: string; displayName: string }[] {
  return editForm.properties
    .filter((p) => !p.derived && p.type !== 'array')
    .map((p) => ({ apiName: p.apiName, displayName: p.displayName }));
}
// 明细表列（供选择父键列 / 收集列）
function childTableColumns(table: string): ProbeColumn[] {
  if (!table) return [];
  return tables.value.find((t) => t.table === table)?.columns ?? [];
}

async function onEditConnectionChange(connId: string) {
  editForm.sourceTable = '';
  tables.value = [];
  if (!connId) return;
  tablesLoading.value = true;
  await tryRequest(async () => {
    const r = await s1.probe(connId);
    tables.value = r.tables || [];
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
  editForm.childTableMappings = (obj.value.childTableMappings ?? []).map((m) => ({
    ...m,
    aggregations: m.aggregations.map((a) => ({ ...a })),
  }));
  editVisible.value = true;
  tables.value = [];
  tryRequest(async () => { sharedProps.value = await s2shared.list(); });
  if (editForm.sourceConnectionId) {
    tablesLoading.value = true;
    tryRequest(async () => {
      const r = await s1.probe(editForm.sourceConnectionId);
      tables.value = r.tables || [];
    }).finally(() => { tablesLoading.value = false; });
  }
}
function addProp() {
  editForm.properties.push({ apiName: '', displayName: '', type: 'string', required: false, derived: false });
}
function addDerivedProp() {
  editForm.properties.push({
    apiName: '', displayName: '', type: 'integer', required: false,
    derived: true, reducer: JSON.stringify({ op: 'countLinks', linkType: '', side: 'target' }),
  });
}
// 从共享属性添加：引用某个 SharedProperty（元数据复用，可选本地覆盖）
const sharedPick = ref('');
function addSharedProp() {
  const sp = sharedProps.value.find((s) => s.apiName === sharedPick.value);
  if (!sp) return;
  if (editForm.properties.some((p) => p.apiName === sp.apiName)) {
    ElMessage.warning(`已包含属性：${sp.apiName}`);
    return;
  }
  editForm.properties.push({
    apiName: sp.apiName, displayName: sp.displayName, type: sp.type,
    required: false, sharedRef: sp.apiName, overridden: false,
  });
  sharedPick.value = '';
}
async function removeProp(i: number) {
  if (i < 0) return;
  const prop = editForm.properties[i];
  const label = prop?.displayName || prop?.apiName || '该属性';
  try {
    await ElMessageBox.confirm(
      `确定要移除属性「${label}」吗？此操作会在保存后从对象类型中删除该字段。`,
      '移除属性确认',
      { type: 'warning', confirmButtonText: '移除', cancelButtonText: '取消', confirmButtonClass: 'el-button--danger' },
    );
    editForm.properties.splice(i, 1);
    ElMessage.success(`已移除属性「${label}」`);
  } catch {
    // 用户取消，不做任何操作
  }
}

// 属性语义（说明 + 枚举取值）编辑
const semanticVisible = ref(false);
const semanticTarget = ref<any>(null);
const semanticDesc = ref('');
const semanticEnum = ref('');
const semanticValueType = ref('');
const semanticUnit = ref('');
const semanticFormat = ref('');
const semanticDefault = ref('');
const valueTypeList = ref<any[]>([]);

async function openSemantic(p: any) {
  semanticTarget.value = p;
  semanticValueType.value = p.valueType || '';
  semanticUnit.value = p.unit || '';
  semanticFormat.value = p.format || '';
  semanticDefault.value = p.defaultValue === undefined || p.defaultValue === null ? '' : String(p.defaultValue);
  try { valueTypeList.value = await valtype.list(); } catch { valueTypeList.value = []; }
  semanticDesc.value = p.description || '';
  semanticEnum.value = (p.allowedValues ?? [])
    .map((v: any) => [v.value, v.label ?? '', v.description ?? ''].join('|'))
    .join('\n');
  semanticVisible.value = true;
}

function saveSemantic() {
  const p = semanticTarget.value;
  if (!p) return;
  p.description = semanticDesc.value.trim() || undefined;
  const list = semanticEnum.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, label, description] = line.split('|').map((x) => x.trim());
      return { value, ...(label ? { label } : {}), ...(description ? { description } : {}) };
    });
  p.allowedValues = list.length ? list : undefined;
  p.valueType = semanticValueType.value || undefined;
  p.unit = semanticUnit.value.trim() || undefined;
  p.format = semanticFormat.value.trim() || undefined;
  if (semanticDefault.value === '') {
    p.defaultValue = undefined;
  } else {
    const raw = semanticDefault.value;
    try { p.defaultValue = JSON.parse(raw); } catch { p.defaultValue = raw; }
  }
  semanticVisible.value = false;
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
        ...(p.sharedRef ? { sharedRef: p.sharedRef, overridden: !!p.overridden } : {}),
      })),
      childTableMappings: editForm.childTableMappings.length
        ? editForm.childTableMappings.map((m) => ({
            table: m.table, parentKey: m.parentKey,
            ...(m.displayName ? { displayName: m.displayName } : {}),
            aggregations: m.aggregations.map((a) => ({
              property: a.property, agg: a.agg,
              ...(a.agg === 'collect' ? { childColumn: a.childColumn } : {}),
              ...(a.asSet ? { asSet: true } : {}),
              ...(a.limit != null ? { limit: Number(a.limit) } : {}),
            })),
          }))
        : undefined,
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
            <ElDescriptionsItem v-if="obj.childTableMappings?.length" label="父子明细映射">
              <div class="ds-col">
                <ElTag v-for="m in obj.childTableMappings" :key="m.table" type="info" effect="plain" class="child-map-tag">
                  {{ m.table }} ← {{ m.parentKey }}
                  <span class="child-map-tag__agg">{{ m.aggregations.map((a) => a.agg + '→' + a.property).join(', ') }}</span>
                </ElTag>
              </div>
            </ElDescriptionsItem>
          </ElDescriptions>
          <p class="detail__desc">{{ obj.description || '暂无描述' }}</p>
          <p v-if="!obj.sourceConnectionId" class="ds-hint">
            该对象类型尚未关联数据源，点击「编辑」选择连接与源表。
          </p>
        </ElCard>

        <ElCard class="detail-card detail-card--props" shadow="never">
          <template #header><span class="card-title"><ElIcon><Link /></ElIcon> 属性 ({{ obj.properties.length }})</span></template>

          <!-- 普通属性 -->
          <h4 class="prop-group__title">普通属性 <span class="prop-group__count">{{ normalProps().length }}</span></h4>
          <table class="prop-table">
            <thead>
              <tr><th>属性</th><th>显示名</th><th>类型</th><th>必填</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in normalProps()" :key="p.apiName">
                <td class="mono">
                  {{ p.apiName }}
                  <ElTag v-if="p.sharedRef" size="small" type="success" effect="plain" class="prop-shared-tag">
                    <ElIcon><Share /></ElIcon> 共享
                  </ElTag>
                </td>
                <td>{{ p.displayName }}</td>
                <td><ElTag size="small">{{ p.type }}</ElTag></td>
                <td>{{ p.required ? '是' : '否' }}</td>
              </tr>
              <tr v-if="normalProps().length === 0">
                <td colspan="4" class="empty">暂无普通属性</td>
              </tr>
            </tbody>
          </table>

          <!-- 派生属性 -->
          <h4 class="prop-group__title">派生属性 <span class="prop-group__count">{{ derivedProps().length }}</span></h4>
          <table class="prop-table">
            <thead>
              <tr><th>属性</th><th>显示名</th><th>类型</th><th>必填</th><th>派生</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in derivedProps()" :key="p.apiName">
                <td class="mono">{{ p.apiName }}</td>
                <td>{{ p.displayName }}</td>
                <td><ElTag size="small">{{ p.type }}</ElTag></td>
                <td>{{ p.required ? '是' : '否' }}</td>
                <td>
                  <ElTag size="small" type="warning"><ElIcon><Cpu /></ElIcon> {{ derivedReducerFn(p) ? `函数:${derivedReducerFn(p)}` : derivedOp(p) }}</ElTag>
                </td>
              </tr>
              <tr v-if="derivedProps().length === 0">
                <td colspan="5" class="empty">暂无派生属性</td>
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

        <!-- 普通属性 -->
        <div class="wizard-props__head">
          <span>普通属性</span>
          <div class="wizard-props__actions">
            <ElSelect v-model="sharedPick" placeholder="从共享属性添加" size="small" filterable clearable style="width: 200px">
              <ElOption v-for="sp in sharedProps.filter((s)=>!editForm.properties.some((p)=>p.apiName===s.apiName))" :key="sp.apiName" :label="`${sp.displayName} (${sp.apiName})`" :value="sp.apiName" />
            </ElSelect>
            <ElButton size="small" type="success" plain @click="addSharedProp">引用共享属性</ElButton>
            <ElButton size="small" @click="addProp">添加属性</ElButton>
          </div>
        </div>
        <div class="wizard-prop-head">
          <span class="col-shared" title="共享属性"></span>
          <span class="col-api">字段名 (API)</span>
          <span class="col-display">显示名</span>
          <span class="col-type">类型</span>
          <span class="col-required">必填</span>
          <span class="col-ops">操作</span>
        </div>
        <div v-for="(p, i) in editForm.properties.filter((x: any) => !x.derived)" :key="'n-' + i" class="wizard-prop-row wizard-prop-row--normal">
          <ElIcon v-if="p.sharedRef" class="col-shared prop-shared-icon" title="共享属性（来自共享属性库，字段名/类型不可改）"><Share /></ElIcon>
          <span v-else class="col-shared" />
          <ElInput v-model="p.apiName" placeholder="字段名 (API)" :disabled="!!p.sharedRef" />
          <ElInput v-model="p.displayName" placeholder="显示名" />
          <ElSelect v-model="p.type" style="width: 120px" :disabled="!!p.sharedRef">
            <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
          </ElSelect>
          <div class="col-required-cell">
            <ElSwitch v-model="p.required" style="--el-switch-on-color: #67c23a" :disabled="!!p.sharedRef && !p.overridden" title="是否必填" />
          </div>
          <div class="wizard-prop-row__ops">
            <ElButton text @click="openSemantic(p)" title="编辑说明与枚举取值">语义</ElButton>
            <ElButton text type="danger" @click="removeProp(editForm.properties.indexOf(p))" title="移除该属性">
              <ElIcon><Delete /></ElIcon>
            </ElButton>
          </div>
        </div>

        <!-- 派生属性 -->
        <div class="wizard-props__head wizard-props__head--derived">
          <span>派生属性</span>
          <ElButton size="small" type="warning" plain @click="addDerivedProp">添加派生属性</ElButton>
        </div>
        <!-- 派生属性配置：每个派生属性独立卡片，收起显示摘要，展开编辑 -->
        <template v-for="(p, i) in editForm.properties" :key="'der-' + i">
          <div v-if="p.derived" class="derived-card">
            <!-- 收起态：摘要行 -->
            <div class="derived-card__summary" @click="toggleDerivedExpand(i)">
              <ElTag size="small" type="warning"><ElIcon><Cpu /></ElIcon> 派生</ElTag>
              <span class="derived-card__field mono">{{ p.apiName || '未命名' }}</span>
              <span class="derived-card__display">{{ p.displayName || '—' }}</span>
              <ElTag size="small">{{ p.type || 'string' }}</ElTag>
              <ElTag size="small" type="info">{{ derivedReducerFn(p) ? `函数:${derivedReducerFn(p)}` : derivedOpLabel(p) }}</ElTag>
              <ElIcon class="derived-card__arrow"><ArrowDown /></ElIcon>
            </div>

            <!-- 展开态：编辑表单 -->
            <div v-show="derivedExpanded[i]" class="derived-card__body">
              <!-- 第一步：选择派生模式（算子 / 引用函数），二选一 -->
              <div class="derived-row">
                <span class="derived-label">派生模式</span>
                <ElRadioGroup :model-value="derivedMode(p)" @change="(v:any)=>onDerivedModeChange(p, v)">
                  <ElRadioButton label="结构化算子" value="op" />
                  <ElRadioButton label="引用函数" value="fn" />
                </ElRadioGroup>
              </div>

              <!-- 模式一：结构化算子 -->
              <template v-if="derivedMode(p) === 'op'">
                <div class="derived-row">
                  <span class="derived-label">算子</span>
                  <ElSelect :model-value="derivedOp(p)" style="width: 240px" @change="(v:string)=>onDerivedOpChange(p,v)">
                    <ElOption label="关联计数 (countLinks)" value="countLinks" />
                    <ElOption label="对端均值 (avgLinks)" value="avgLinks" />
                    <ElOption label="对端求和 (sumLinks)" value="sumLinks" />
                    <ElOption label="对端最小 (minLinks)" value="minLinks" />
                    <ElOption label="对端最大 (maxLinks)" value="maxLinks" />
                    <ElOption label="收集列表 (collectLinks)" value="collectLinks" />
                    <ElOption label="表达式 (expression)" value="expression" />
                  </ElSelect>
                </div>

                <template v-if="derivedOp(p) !== 'expression'">
                  <div class="derived-row">
                    <span class="derived-label">关系类型</span>
                    <ElSelect :model-value="derivedLinkType(p)" placeholder="选择关系类型" style="flex:1" @change="(v:string)=>setDerivedSpec(p,{linkType:v})">
                      <ElOption v-for="lt in linkTypes" :key="lt.apiName" :label="`${lt.displayName} (${lt.sourceType}→${lt.targetType})`" :value="lt.apiName" />
                    </ElSelect>
                  </div>
                  <div class="derived-row">
                    <span class="derived-label">本对象角色</span>
                    <ElSelect :model-value="derivedSide(p)" style="width: 180px" @change="(v:'source'|'target')=>setDerivedSpec(p,{side:v})">
                      <ElOption label="source（起点）" value="source" />
                      <ElOption label="target（终点）" value="target" />
                    </ElSelect>
                  </div>
                </template>

                <template v-if="derivedOp(p) === 'countLinks'">
                  <div class="derived-row">
                    <ElCheckbox :model-value="derivedDistinct(p)" @change="(v:any)=>setDerivedSpec(p,{distinct:!!v})">按对端去重</ElCheckbox>
                  </div>
                </template>

                <template v-if="AGG_OPS.includes(derivedOp(p))">
                  <div class="derived-row">
                    <span class="derived-label">{{ derivedOp(p) === 'collectLinks' ? '收集属性' : '对端聚合属性' }}</span>
                    <ElSelect :model-value="derivedProp(p)" style="flex:1" filterable clearable
                      :placeholder="aggPropOptions(p).length ? '选择对端属性' : '请先选择关系类型与角色'"
                      :disabled="!aggPropOptions(p).length"
                      @change="(v:string)=>setDerivedSpec(p,{prop:v})">
                      <ElOption v-for="ap in aggPropOptions(p)" :key="ap.apiName" :label="`${ap.displayName} (${ap.apiName})`" :value="ap.apiName" />
                    </ElSelect>
                  </div>
                </template>

                <template v-if="derivedOp(p) === 'collectLinks'">
                  <div class="derived-row derived-row--wrap">
                    <ElCheckbox :model-value="derivedAsSet(p)" @change="(v:any)=>setDerivedSpec(p,{asSet:!!v})">去重集合</ElCheckbox>
                    <ElCheckbox :model-value="derivedSingle(p)" @change="(v:any)=>setDerivedSpec(p,{single:!!v})" title="关系唯一端只取一个对端属性（如 Project 的 Lead engineer name）">单链接取标量</ElCheckbox>
                    <span class="derived-label" style="width:auto">上限</span>
                    <ElInput :model-value="derivedLimit(p)" size="small" style="width: 100px" placeholder="全部" @update:model-value="(v:string)=>setDerivedSpec(p,{limit:v?Number(v):undefined})" />
                  </div>
                </template>

                <template v-if="derivedOp(p) === 'expression'">
                  <div class="derived-row">
                    <span class="derived-label">表达式</span>
                    <ElInput :model-value="parseDerivedSpec(p.reducer)?.expr ?? ''" size="default" style="flex:1" placeholder="占位（第一期不执行）" @update:model-value="(v:string)=>setDerivedSpec(p,{expr:v})" />
                  </div>
                </template>
              </template>

              <!-- 模式二：引用函数 -->
              <template v-else-if="derivedMode(p) === 'fn'">
                <div class="derived-row">
                  <span class="derived-label">引用函数</span>
                  <ElSelect :model-value="derivedReducerFn(p)" placeholder="选择已注册函数" style="flex:1" clearable @change="(v:string)=>onReducerFnChange(p,v)">
                    <ElOption v-for="fn in functions" :key="fn.apiName" :label="`${fn.displayName} (${fn.apiName})`" :value="fn.apiName" />
                  </ElSelect>
                </div>
                <div class="derived-row" v-if="derivedReducerFn(p)">
                  <span class="derived-label">函数说明</span>
                  <span class="derived-fn-desc">{{ functions.find(f=>f.apiName===derivedReducerFn(p))?.description || '（该函数暂无说明）' }}</span>
                </div>
              </template>

              <div class="derived-card__footer">
                <ElCheckbox v-model="p.derived" @change="(v:any)=>onToggleDerived(p, !!v)">保持为派生属性</ElCheckbox>
                <div class="derived-card__footer-ops">
                  <ElButton size="small" type="danger" text @click="removeProp(i)">删除属性</ElButton>
                  <ElButton size="small" type="danger" text @click="toggleDerivedExpand(i)">收起</ElButton>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 父子明细映射（主表 + 明细表纵向关联） -->
        <div class="wizard-props__head wizard-props__head--derived">
          <span>父子明细映射（多表关联）</span>
          <div class="wizard-props__actions">
            <ElButton size="small" type="primary" plain @click="addChildMapping">添加明细映射</ElButton>
          </div>
        </div>
        <p v-if="!editForm.sourceConnectionId || !editForm.sourceTable" class="ds-hint">
          需先选择数据源连接与源表，明细表将复用同一连接（parentKey 指向主表主键）。
        </p>
        <div v-for="(m, mi) in editForm.childTableMappings" :key="'child-' + mi" class="child-map-card">
          <div class="child-map-card__head">
            <span class="child-map-card__title">明细映射 #{{ mi + 1 }}</span>
            <ElButton text type="danger" size="small" @click="removeChildMapping(mi)">移除</ElButton>
          </div>
          <div class="child-map-grid">
            <ElFormItem label="明细表（同连接）">
              <ElSelect v-model="m.table" placeholder="选择明细表" filterable clearable style="width: 100%">
                <ElOption v-for="t in tables" :key="t.table" :label="t.table" :value="t.table" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="父键列（外键 → 主表主键）">
              <ElSelect v-model="m.parentKey" placeholder="明细表中外键列" filterable clearable style="width: 100%">
                <ElOption v-for="col in childTableColumns(m.table)" :key="col.name" :label="col.name" :value="col.name" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="显示名">
              <ElInput v-model="m.displayName" placeholder="明细表显示名（可选）" />
            </ElFormItem>
          </div>

          <div class="child-agg__head">
            <span class="ds-label">聚合定义</span>
            <ElButton size="small" text type="primary" @click="addChildAgg(m)">+ 聚合</ElButton>
          </div>
          <div v-for="(a, ai) in m.aggregations" :key="'agg-' + ai" class="child-agg-row">
            <ElSelect v-model="a.agg" style="width: 120px">
              <ElOption label="计数 count" value="count" />
              <ElOption label="收集数组 collect" value="collect" />
            </ElSelect>
            <ElSelect v-model="a.property" placeholder="目标属性" filterable clearable style="flex: 1">
              <ElOption v-for="op in childAggPropOptions()" :key="op.apiName" :label="`${op.displayName} (${op.apiName})`" :value="op.apiName" />
            </ElSelect>
            <ElInput v-if="a.agg === 'collect'" v-model="a.childColumn" placeholder="明细表收集列" style="width: 150px" />
            <ElCheckbox v-if="a.agg === 'collect'" v-model="a.asSet">去重</ElCheckbox>
            <ElInput v-if="a.agg === 'collect'" v-model="a.limit" placeholder="上限" style="width: 80px" />
            <ElButton text type="danger" @click="removeChildAgg(m, ai)">移除</ElButton>
          </div>
        </div>
      </ElForm>
      <template #footer>
        <ElButton @click="editVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="saving" @click="saveEdit">保存</ElButton>
      </template>
    </ElDialog>
  </div>

    <!-- 属性语义（说明 + 枚举取值）编辑 -->
    <ElDialog v-model="semanticVisible" title="属性语义" width="520px">
      <p class="semantic-hint">属性：<span class="mono">{{ semanticTarget?.apiName }}</span>（保存对象类型后生效）</p>
      <ElForm label-position="top">
        <ElFormItem label="值类型（可选，引用后由值类型统一约束）">
          <ElSelect v-model="semanticValueType" clearable filterable placeholder="选择值类型" style="width: 100%">
            <ElOption v-for="vt in valueTypeList" :key="vt.apiName" :label="`${vt.displayName} (${vt.apiName})`" :value="vt.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="说明">
          <ElInput v-model="semanticDesc" type="textarea" :rows="2" placeholder="该属性的业务含义，例如：告警级别" />
        </ElFormItem>
        <div class="semantic-row">
          <ElFormItem label="单位" class="grow"><ElInput v-model="semanticUnit" placeholder="如 小时、元" /></ElFormItem>
          <ElFormItem label="展示格式" class="grow"><ElInput v-model="semanticFormat" placeholder="如 date、percent、currency" /></ElFormItem>
        </div>
        <ElFormItem label="默认值（同步时缺失填充；数字/布尔按 JSON 解析）">
          <ElInput v-model="semanticDefault" placeholder="如 0 / active / true" />
        </ElFormItem>
        <ElFormItem label="枚举取值（每行：value|label|说明）">
          <ElInput v-model="semanticEnum" type="textarea" :rows="4"
            placeholder="high|高风险|需要立即处理&#10;low|低风险|仅观察" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="semanticVisible = false">取消</ElButton>
        <ElButton type="primary" @click="saveSemantic">确定</ElButton>
      </template>
    </ElDialog>
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
.prop-group__title {
  margin: 4px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.prop-group__title:not(:first-child) { margin-top: var(--space-4); }
.prop-group__count {
  font-weight: 500;
  font-size: 12px;
  color: var(--text-muted);
  background: var(--accent-soft, #f5f7fa);
  border-radius: 10px;
  padding: 0 8px;
  line-height: 18px;
}
.detail-empty { color: var(--text-muted); padding: var(--space-6); }

.semantic-row { display: flex; gap: 8px; }
.semantic-row .grow { flex: 1; }
.semantic-hint { font-size: 12px; color: var(--text-muted); margin: 0 0 8px; }
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
.wizard-props__head--derived { margin-top: var(--space-4); }
.wizard-props__actions { display: flex; align-items: center; gap: var(--space-1); }
.wizard-prop-head,
.wizard-prop-row--normal {
  display: grid;
  grid-template-columns: 24px 1fr 1fr 120px 70px 44px;
  gap: var(--space-1);
  align-items: center;
}
.wizard-prop-head {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  padding: 0 var(--space-1) var(--space-1);
  border-bottom: 1px solid var(--border, #e4e7ed);
  margin-bottom: var(--space-1);
}
.wizard-prop-head .col-required,
.wizard-prop-head .col-ops { text-align: center; }
.col-required-cell { display: flex; align-items: center; justify-content: center; }
.wizard-prop-row--normal { margin-bottom: var(--space-1); }
.wizard-prop-row__ops { display: flex; align-items: center; justify-content: center; gap: var(--space-1); }
.col-shared { display: inline-flex; align-items: center; justify-content: center; }
.prop-shared-icon { color: #67c23a; }
.prop-shared-tag { margin-left: 4px; vertical-align: middle; }
.wizard-prop-row {
  display: grid;
  grid-template-columns: 24px 1fr 1fr 120px 70px 44px;
  gap: var(--space-1);
  margin-bottom: var(--space-1);
}
/* 派生属性卡片：独立一行，收起摘要 + 展开编辑 */
.derived-card {
  border: 1px solid var(--border, #e4e7ed);
  border-radius: var(--radius, 6px);
  margin-bottom: var(--space-2);
  background: #fff;
  overflow: hidden;
}
.derived-card__summary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.derived-card__summary:hover { background: var(--accent-soft, #f5f7fa); }
.derived-card__field { font-weight: 600; font-size: 13px; min-width: 100px; }
.derived-card__display { color: var(--text-secondary); font-size: 13px; }
.derived-card__arrow {
  margin-left: auto;
  transition: transform 0.25s;
  color: var(--text-muted);
  font-size: 14px;
}
.derived-card__body {
  padding: var(--space-3) var(--space-3) var(--space-3);
  border-top: 1px solid var(--border, #e4e7ed);
  background: #fafbfc;
}
.derived-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.derived-row--wrap { flex-wrap: wrap; }
.derived-label {
  width: 110px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}
.derived-fn-desc {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--accent-soft, #f5f7fa);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
  line-height: 1.5;
}
.derived-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px dashed var(--border, #e4e7ed);
}
.derived-card__footer-ops { display: flex; align-items: center; gap: var(--space-1); }
/* 父子明细映射卡片 */
.ds-col { display: flex; flex-direction: column; gap: 4px; }
.child-map-tag { justify-content: flex-start; font-size: 12px; }
.child-map-tag__agg { margin-left: 4px; opacity: 0.75; font-size: 11px; }
.child-map-card {
  border: 1px solid var(--border, #e4e7ed);
  border-radius: var(--radius, 6px);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-2);
  background: #fafbfc;
}
.child-map-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}
.child-map-card__title { font-weight: 600; font-size: 13px; }
.child-map-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-2);
}
@media (max-width: 640px) { .child-map-grid { grid-template-columns: 1fr; } }
.child-agg__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--space-2) 0 var(--space-1);
}
.child-agg-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

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
