<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption, ElSteps, ElStep, ElCheckbox, ElRadio, ElDescriptions, ElDescriptionsItem, ElMessageBox,
  ElIcon, ElTooltip,
} from 'element-plus';
import { ArrowLeft, ArrowRight, Check, Plus, Delete, Compass, Loading, Search } from '@element-plus/icons-vue';
import { s2, s2link, s1 } from '@/api';
import type { ObjectType, SourceConnection, ProbeTable, ProbeColumn, OntologyProperty } from '@/api';
import { tryRequest } from '@/utils/error';

interface PropRow {
  apiName: string;
  displayName: string;
  type: string;
  sourceColumn: string;
  isPrimaryKey: boolean;
  selected: boolean;
  // 派生(计算)属性配置
  derived: boolean;
  derivedOp: 'countLinks' | 'avgLinks' | 'countObject' | 'sumObject' | 'expression';
  derivedLinkType: string;
  derivedSide: 'source' | 'target';
  derivedProp: string;
}

const router = useRouter();
const route = useRoute();
const types = ref<ObjectType[]>([]);
const loading = ref(false);

/* ============ 分页懒加载（列表可滚动翻页） ============ */
const PAGE_SIZE = 30; // 每页渲染的卡片数
const allTypes = ref<ObjectType[]>([]); // 全量数据（来自后端）
const loadedCount = ref(0); // 已展开渲染的卡片数
const loadingMore = ref(false); // 是否正在加载下一页
const listBodyRef = ref<HTMLElement | null>(null);

// 搜索关键词：按 displayName / apiName 匹配过滤
const keyword = ref('');

// 过滤后的对象类型（全量），搜索时动态变化
const filteredTypes = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return allTypes.value;
  return allTypes.value.filter(
    (o) =>
      o.displayName.toLowerCase().includes(kw) ||
      o.apiName.toLowerCase().includes(kw),
  );
});

const hasMore = () => loadedCount.value < filteredTypes.value.length;
// 搜索词变化时重置分页并从顶部渲染
watch(keyword, () => {
  loadedCount.value = 0;
  loadingMore.value = false;
  const el = listBodyRef.value;
  if (el) el.scrollTop = 0;
  loadMore();
});
function loadMore() {
  if (loadingMore.value || !hasMore()) return;
  loadingMore.value = true;
  // 模拟分页请求的微任务节奏，避免长列表一次性渲染卡顿
  setTimeout(() => {
    const next = Math.min(loadedCount.value + PAGE_SIZE, filteredTypes.value.length);
    types.value = filteredTypes.value.slice(0, next);
    loadedCount.value = next;
    loadingMore.value = false;
  }, 0);
}
function onListScroll() {
  const el = listBodyRef.value;
  if (!el) return;
  // 距底部 40px 内即触发下一页加载
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) loadMore();
}

/* ============ 向导式新建 ============ */
const wizardVisible = ref(false);
const connections = ref<SourceConnection[]>([]);
const linkTypes = ref<{ apiName: string; displayName: string }[]>([]);
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
  titleProperty: string;
  properties: PropRow[];
}>({
  displayName: '', apiName: '', description: '', connectionId: '', sourceTable: '', primaryKey: '', titleProperty: '', properties: [],
});

const steps = ['选择数据源', '定义属性', '对象类型信息', '确认'];

function makeProp(partial: Partial<PropRow>): PropRow {
  return {
    apiName: '', displayName: '', type: 'string', sourceColumn: '',
    isPrimaryKey: false, selected: true, derived: false,
    derivedOp: 'countLinks', derivedLinkType: '', derivedSide: 'target', derivedProp: '',
    ...partial,
  };
}

async function openWizard() {
  wizardVisible.value = true;
  activeStep.value = 0;
  form.displayName = ''; form.apiName = ''; form.description = '';
  form.connectionId = ''; form.sourceTable = ''; form.primaryKey = ''; form.titleProperty = ''; form.properties = [];
  tables.value = [];
  await tryRequest(async () => {
    connections.value = await s1.listConnections();
    linkTypes.value = await s2link.listLinkTypes();
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
    const r = await s1.probe(connId);
    tables.value = r.tables || [];
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
  form.properties = t.columns.map((c: ProbeColumn) =>
    makeProp({
      apiName: c.name,
      displayName: c.name,
      type: mapSqlType(c.dataType),
      sourceColumn: c.name,
      isPrimaryKey: c.isPrimaryKey,
      selected: true,
    }),
  );
  const pk = t.columns.find((c) => c.isPrimaryKey);
  if (pk) form.primaryKey = pk.name;
  ElMessage.info(`已从「${tableName}」导入 ${t.columns.length} 个字段`);
}

// 监听源表变化：确保 @change 未触发时也能导入字段（防御性兜底）
watch(() => form.sourceTable, (val) => {
  if (val && form.properties.length === 0) {
    onTableChange(val);
  }
});

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

// 切换到派生属性时，提示用户该属性不再来自源表，而是由计算产生
function onDerivedToggle(p: PropRow) {
  if (p.derived && !p.apiName) {
    p.apiName = `derived_${form.properties.filter((x) => x.derived).length || ''}`.replace(/_$/, '');
    p.displayName = '计算属性';
  }
}

// ====== 原始映射属性：增删改 ======
function addSourceProp() {
  form.properties.push(makeProp({
    apiName: '', displayName: '新属性', type: 'string', sourceColumn: '',
    isPrimaryKey: false, selected: true, derived: false,
  }));
}
function removeSourceProp(index: number) {
  const p = form.properties[index];
  if (!p) return;
  // 如果删除的是当前主键，清除主键
  if (form.primaryKey === p.apiName) form.primaryKey = '';
  form.properties.splice(index, 1);
}

// ====== 派生属性：独立栏目，可添加/删除 ======
function addDerivedProp() {
  const idx = form.properties.filter((x) => x.derived).length + 1;
  form.properties.push(makeProp({
    apiName: `derived_${idx}`,
    displayName: `计算属性${idx}`,
    type: 'integer',
    sourceColumn: '',
    isPrimaryKey: false,
    selected: true,
    derived: true,
    derivedOp: 'countLinks',
    derivedLinkType: '',
    derivedSide: 'target',
    derivedProp: '',
  }));
}
function removeDerivedProp(index: number) {
  const p = form.properties[index];
  if (!p) return;
  if (form.primaryKey === p.apiName) form.primaryKey = '';
  form.properties.splice(index, 1);
}

/** 派生属性列表（从 properties 中过滤） */
const derivedProps = () => form.properties.filter((p) => p.derived);
/** 原始映射属性列表（非派生的） */
const sourceProps = () => form.properties.filter((p) => !p.derived);

function nextStep() {
  if (activeStep.value === 0) {
    // 数据源为可选：对象类型可独立创建；但若选了连接，则必须指定源表
    if (form.connectionId && !form.sourceTable) {
      ElMessage.warning('已选择连接，请继续选择源表');
      return;
    }
  }
  if (activeStep.value === 1) {
    if (selectedProps().length === 0) {
      ElMessage.warning('请至少选择一个属性');
      return;
    }
    // 派生属性必填校验
    for (const p of selectedProps()) {
      if (p.derived && !p.derivedLinkType) {
        ElMessage.warning(`派生属性「${p.displayName}」需选择关系类型`);
        return;
      }
      if (p.derived && (p.derivedOp === 'avgLinks' || p.derivedOp === 'expression') && !p.derivedProp) {
        ElMessage.warning(`派生属性「${p.displayName}」需填写对端属性/表达式`);
        return;
      }
    }
    // 主键在 Step 1 已选，这里做最终确认
    if (!form.primaryKey) {
      ElMessage.warning('请在上方选择一个主键属性');
      return;
    }
  }
  if (activeStep.value === 2) {
    if (!form.displayName || !form.apiName) {
      ElMessage.warning('请填写显示名称与 API 名称');
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
    const properties: OntologyProperty[] = props.map((p) => {
      if (p.derived) {
        // 派生(计算)属性：写入 derived + reducer（DerivedSpec 序列化）
        const spec: any = { op: p.derivedOp, linkType: p.derivedLinkType, side: p.derivedSide };
        if (p.derivedOp === 'avgLinks') spec.prop = p.derivedProp;
        if (p.derivedOp === 'expression') spec.expr = p.derivedProp;
        return {
          apiName: p.apiName, displayName: p.displayName, type: p.type, required: p.isPrimaryKey,
          derived: true, reducer: JSON.stringify(spec),
        } as OntologyProperty;
      }
      // 普通属性：来自源表字段，记录 sourceMapping
      return {
        apiName: p.apiName, displayName: p.displayName, type: p.type, required: p.isPrimaryKey,
        sourceMapping: p.sourceColumn,
      } as OntologyProperty;
    });
    const payload = {
      objectType: {
        apiName: form.apiName,
        displayName: form.displayName,
        description: form.description,
        sourceConnectionId: form.connectionId || undefined,
        sourceTable: form.sourceTable || undefined,
        titleProperty: form.titleProperty || undefined,
        properties,
      },
      sourceConnectionId: form.connectionId || undefined,
      sourceTable: form.sourceTable || undefined,
      fieldMappings: props.filter((p) => !p.derived).map((p) => ({
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
    allTypes.value = data.slice().sort((a: ObjectType, b: ObjectType) => a.displayName.localeCompare(b.displayName));
    loadedCount.value = Math.min(PAGE_SIZE, allTypes.value.length);
    types.value = allTypes.value.slice(0, loadedCount.value);
  });
  loading.value = false;
}

function openDetail(apiName: string) {
  router.push(`/s2/object-types/${apiName}`);
}
function exploreType(t: ObjectType) {
  router.push(`/s2/explore/${t.apiName}`);
}
function isActive(apiName: string) {
  return route.params.apiName === apiName;
}
async function onDelete(t: ObjectType) {
  try {
    await ElMessageBox.confirm(
      `确定删除对象类型「${t.displayName}（${t.apiName}）」吗？该操作不可恢复。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    );
  } catch {
    return; // 用户取消
  }
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
          <p class="section-sub">
            <template v-if="keyword">搜索「{{ keyword }}」共 {{ filteredTypes.length }} 个</template>
            <template v-else-if="allTypes.length">已加载 {{ loadedCount }} / 共 {{ allTypes.length }} 个类型</template>
            <template v-else>{{ types.length }} 个类型</template>
          </p>
        </div>
        <div class="types-list__tools">
          <ElInput
            v-model="keyword"
            placeholder="搜索名称或 API 名"
            clearable
            class="types-list__search"
            :prefix-icon="Search"
          />
          <ElButton type="primary" @click="openWizard">新建对象类型</ElButton>
        </div>
      </header>

      <div ref="listBodyRef" v-loading="loading" class="types-list__body" @scroll="onListScroll">
        <ElCard
          v-for="t in types"
          :key="t.apiName"
          class="type-card"
          :class="{ 'type-card--active': isActive(t.apiName) }"
          shadow="hover"
          @click="openDetail(t.apiName)"
        >
          <div class="type-card__head">
            <ElTooltip :content="t.displayName" placement="top" :show-after="400" :disabled="t.displayName.length <= 12">
              <span class="type-card__name">{{ t.displayName }}</span>
            </ElTooltip>
            <ElTag size="small" type="info">{{ t.apiName }}</ElTag>
          </div>
          <ElTooltip :content="t.description || '暂无描述'" placement="top" :show-after="400" :disabled="(t.description || '').length <= 40">
            <p class="type-card__desc">{{ t.description || '暂无描述' }}</p>
          </ElTooltip>
          <div class="type-card__meta">
            <span>{{ t.properties.length }} 个属性</span>
            <ElTooltip v-if="t.sourceTable" :content="t.sourceTable" placement="top" :show-after="300">
              <span class="type-card__table">{{ t.sourceTable }}</span>
            </ElTooltip>
          </div>
          <div class="type-card__actions" @click.stop>
            <ElButton size="small" text type="primary" :icon="Compass" title="探索该类型实例与关系" @click="exploreType(t)" />
            <ElButton size="small" text type="danger" @click="onDelete(t)">删除</ElButton>
          </div>
        </ElCard>

        <div v-if="!loading && types.length === 0 && keyword" class="empty-hint">
          未找到匹配「{{ keyword }}」的对象类型，换个关键词试试。
        </div>
        <div v-else-if="!loading && types.length === 0" class="empty-hint">
          暂无对象类型，点击右上角「新建对象类型」。
        </div>

        <!-- 滚动分页加载提示 -->
        <div v-if="loadingMore" class="list-footer">
          <ElIcon class="is-loading"><Loading /></ElIcon>
          <span>加载更多…</span>
        </div>
        <div v-else-if="filteredTypes.length && !hasMore()" class="list-footer list-footer--end">
          已加载全部 {{ filteredTypes.length }} 个类型
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
          <p class="wizard-pane__hint">配置对象类型的属性：原始映射属性来自源表字段，派生属性由计算产生。</p>

          <!-- 主键选择（表格上方独立下拉框） -->
          <div class="pk-select-row">
            <label class="pk-label">主键属性：</label>
            <ElSelect
              v-model="form.primaryKey"
              placeholder="选择主键"
              filterable
              clearable
              style="width: 280px"
            >
              <ElOption
                v-for="p in sourceProps()"
                :key="p.apiName"
                :label="`${p.displayName} (${p.apiName})`"
                :value="p.apiName"
              />
            </ElSelect>
            <span v-if="!form.primaryKey" class="pk-hint">请从下方映射属性中选择一个作为主键</span>
          </div>

          <!-- ====== 原始映射属性 ====== -->
          <div class="prop-section">
            <div class="prop-section__head">
              <h4 class="prop-section__title">原始映射属性（来自源表）</h4>
              <ElButton size="small" type="primary" plain :icon="Plus" @click="addSourceProp">添加属性</ElButton>
            </div>
            <div v-if="sourceProps().length" class="prop-table-wrap">
              <table class="prop-table">
                <thead>
                  <tr>
                    <th style="width: 44px"><ElCheckbox
                      :model-value="sourceProps().every((p) => p.selected)"
                      :indeterminate="sourceProps().some((p) => p.selected) && !sourceProps().every((p) => p.selected)"
                      @change="(v: any) => sourceProps().forEach((p) => { p.selected = !!v; })"
                    /></th>
                    <th>源字段</th>
                    <th>属性 API 名</th>
                    <th>显示名</th>
                    <th>类型</th>
                    <th style="width: 60px">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(p, i) in form.properties" :key="'s' + i">
                    <tr v-if="!p.derived" :class="{ 'prop-row--off': !p.selected }">
                      <td><ElCheckbox v-model="p.selected" /></td>
                      <td><ElInput v-model="p.sourceColumn" size="small" placeholder="源列名" class="mono-input" /></td>
                      <td><ElInput v-model="p.apiName" size="small" placeholder="API 名称" /></td>
                      <td><ElInput v-model="p.displayName" size="small" placeholder="显示名称" /></td>
                      <td>
                        <ElSelect v-model="p.type" size="small" style="width: 110px">
                          <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
                        </ElSelect>
                      </td>
                      <td>
                        <ElButton size="small" text type="danger" :icon="Delete" @click="removeSourceProp(i)" title="删除此属性" />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div v-else class="prop-empty">
              暂无映射属性。请先在「选择数据源」中指定源表导入字段，或点击「添加属性」手动创建。
            </div>
          </div>

          <!-- ====== 派生属性（独立栏目）====== -->
          <div class="prop-section prop-section--derived">
            <div class="prop-section__head">
              <h4 class="prop-section__title">派生属性（计算属性）</h4>
              <ElButton size="small" type="primary" plain :icon="Plus" @click="addDerivedProp">添加派生属性</ElButton>
            </div>
            <div v-if="derivedProps().length" class="derived-list">
              <template v-for="(p, idx) in form.properties" :key="'dv' + idx">
              <div v-if="p.derived && p.selected" class="derived-card">
                <div class="derived-card__head">
                  <ElInput v-model="p.displayName" size="small" placeholder="显示名称" style="width: 140px; margin-right: 8px;" />
                  <ElInput v-model="p.apiName" size="small" placeholder="API 名称" style="width: 140px; margin-right: 8px;" />
                  <ElSelect v-model="p.type" size="small" style="width: 100px; margin-right: auto;">
                    <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
                  </ElSelect>
                  <ElButton size="small" text type="danger" :icon="Delete" @click="removeDerivedProp(idx)" title="删除此派生属性" />
                </div>
                <div class="derived-config">
                  <span class="derived-config__label">计算方式</span>
                  <ElSelect v-model="p.derivedOp" size="small" style="width: 150px">
                    <ElOption label="关联数量(countLinks)" value="countLinks" />
                    <ElOption label="对端均值(avgLinks)" value="avgLinks" />
                    <ElOption label="关联计数(countObject)" value="countObject" />
                    <ElOption label="关联求和(sumObject)" value="sumObject" />
                    <ElOption label="表达式(expression)" value="expression" />
                  </ElSelect>
                  <span class="derived-config__label">关系类型</span>
                  <ElSelect v-model="p.derivedLinkType" size="small" filterable style="width: 160px" placeholder="选择关系">
                    <ElOption v-for="lt in linkTypes" :key="lt.apiName" :label="lt.displayName" :value="lt.apiName" />
                  </ElSelect>
                  <span class="derived-config__label">角色</span>
                  <ElSelect v-model="p.derivedSide" size="small" style="width: 100px">
                    <ElOption label="作为源(source)" value="source" />
                    <ElOption label="作为目标(target)" value="target" />
                  </ElSelect>
                  <template v-if="p.derivedOp === 'avgLinks' || p.derivedOp === 'expression'">
                    <span class="derived-config__label">{{ p.derivedOp === 'avgLinks' ? '对端属性' : '表达式' }}</span>
                    <ElInput v-model="p.derivedProp" size="small" style="width: 140px" :placeholder="p.derivedOp === 'avgLinks' ? '如：workHours' : '占位'" />
                  </template>
                </div>
              </div>
              </template>
            </div>
            <div v-else class="prop-empty">
              暂无派生属性。点击「添加派生属性」创建计算属性。
            </div>
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
              <div class="pk-info">{{ form.primaryKey ? `${sourceProps().find((p) => p.apiName === form.primaryKey)?.displayName || form.primaryKey} (${form.primaryKey})` : '未选择（请在「定义属性」步骤中选择）' }}</div>
            </ElFormItem>
            <ElFormItem label="显示名属性（用于对象实例展示，如姓名/工号）">
              <ElSelect v-model="form.titleProperty" placeholder="选择展示用的属性（可选）" filterable clearable style="width: 100%">
                <ElOption v-for="p in sourceProps()" :key="p.apiName" :label="`${p.displayName} (${p.apiName})`" :value="p.apiName" />
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
            <ElDescriptionsItem label="显示名属性">{{ form.titleProperty || '—' }}</ElDescriptionsItem>
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
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.types-list__tools {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.types-list__search {
  width: 240px;
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
  height: 120px;              /* 固定高度，不出现滚动条 */
  flex-shrink: 0;             /* 关键：在竖向滚动容器内保持固定高度，不被压缩 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;         /* 为绝对定位的删除按钮提供定位上下文 */
}
.type-card :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  flex-shrink: 0;
}
.type-card__name {
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 90px);
}
.type-card__desc {
  margin: var(--space-1) 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;       /* 最多显示两行，超出省略号 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;                     /* 占据剩余空间 */
  min-height: 36px;           /* 保证至少一行 + padding */
}
.type-card__meta {
  display: flex;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}
.type-card__table {
  font-family: var(--font-mono);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.type-card__actions {
  position: absolute;
  bottom: 8px;
  right: 12px;
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

.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-3);
  color: var(--text-muted);
  font-size: 12px;
  flex-shrink: 0;
}
.list-footer--end {
  opacity: 0.7;
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

/* ====== 主键选择（表格上方）====== */
.pk-select-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  padding: var(--space-3);
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid var(--border);
}
.pk-label {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.pk-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* ====== 属性分区 ===== */
.prop-section {
  margin-top: var(--space-4);
}
.prop-section--derived {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 2px dashed var(--border);
}
.prop-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}
.prop-section__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

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
.mono-input :deep(input) { font-family: var(--font-mono); }

/* ====== 派生属性卡片列表 ===== */
.derived-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.derived-card {
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: var(--space-2) var(--space-3);
  background: var(--accent-soft);
}
.derived-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.derived-config {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) 0;
}
.derived-config__label {
  font-size: 12px;
  color: var(--text-muted);
}

.confirm-desc { margin-top: var(--space-1); }
.pk-info {
  font-size: 13px;
  color: var(--text-primary);
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 4px;
}

.wizard-footer {
  display: flex;
  align-items: center;
  width: 100%;
}
.wizard-footer__spacer { flex: 1; }
</style>
