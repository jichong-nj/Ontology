<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElButton, ElInput, ElTable, ElTableColumn, ElTag, ElCard, ElEmpty, ElBreadcrumb, ElBreadcrumbItem, ElTooltip, ElIcon, ElDescriptions, ElDescriptionsItem, ElDivider, ElSelect, ElOption, ElLoadingDirective as vLoading } from 'element-plus';
import { ArrowLeft, Search, Link, InfoFilled } from '@element-plus/icons-vue';
import { s2, s2link, s2explore, type ObjectLink } from '@/api';
import type { ObjectType, LinkType, PropertyDef } from '@/api';
import { tryRequest } from '@/utils/error';
import PropertyChartCard from './PropertyChartCard.vue';

const route = useRoute();
const router = useRouter();
const objectTypeApiName = computed(() => route.params.objectType as string);

// ========== 全局状态 ==========
const objectTypes = ref<ObjectType[]>([]);
const linkTypes = ref<LinkType[]>([]);
const currentObjectType = ref<ObjectType | null>(null);
const loading = ref(false);

// ========== 属性图表画布（探索仪表盘，每个 objectType 一套独立配置）==========
export interface ChartItem {
  apiName: string;
  kind: 'bar' | 'pie' | 'line';
}
// charts: 当前对象类型已添加的图表属性（有序，含图形样式，持久化到后端 explore_config）
const charts = ref<ChartItem[]>([]);
const propToAdd = ref(''); // 搜索框当前选中的待添加属性
const savingConfig = ref(false);

// 拖动排序状态
const dragIndex = ref<number | null>(null);

// 兼容旧数据（纯字符串数组）与混合格式，统一为 ChartItem
function normalizeCharts(raw: any[]): ChartItem[] {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((c) =>
    typeof c === 'string'
      ? { apiName: c, kind: 'bar' as const }
      : { apiName: String(c.apiName), kind: (c.kind || 'bar') as ChartItem['kind'] },
  );
}

async function loadExploreConfig() {
  if (!objectTypeApiName.value) {
    charts.value = [];
    return;
  }
  const cfg = await s2.getExploreConfig(objectTypeApiName.value);
  charts.value = normalizeCharts(cfg.charts || []);
}

async function saveConfig() {
  if (!objectTypeApiName.value) return;
  savingConfig.value = true;
  await tryRequest(async () => {
    await s2.saveExploreConfig(objectTypeApiName.value, charts.value);
  });
  savingConfig.value = false;
}

function addProp(apiName: string) {
  if (!apiName) return;
  if (!charts.value.some((c) => c.apiName === apiName)) {
    charts.value.push({ apiName, kind: 'bar' });
    saveConfig();
  }
}

function updateChartKind(apiName: string, kind: ChartItem['kind']) {
  const item = charts.value.find((c) => c.apiName === apiName);
  if (item) {
    item.kind = kind;
    saveConfig();
  }
}

function getPropDef(apiName: string): PropertyDef | undefined {
  return currentObjectType.value?.properties.find((p) => p.apiName === apiName);
}

async function confirmRemove(apiName: string) {
  const def = getPropDef(apiName);
  try {
    await ElMessageBox.confirm(
      `确认从「${currentObjectType.value?.displayName || objectTypeApiName.value}」的探索看板移除图表「${def?.displayName || apiName}」？`,
      '移除图表',
      { confirmButtonText: '移除', cancelButtonText: '取消', type: 'warning' },
    );
    charts.value = charts.value.filter((p) => p.apiName !== apiName);
    saveConfig();
  } catch {
    // 用户取消，不操作
  }
}

// 拖动排序
function onDragStart(idx: number) {
  dragIndex.value = idx;
}
function onDragOver(idx: number, e: DragEvent) {
  e.preventDefault();
}
function onDrop(idx: number) {
  if (dragIndex.value === null || dragIndex.value === idx) return;
  const arr = [...charts.value];
  const [moved] = arr.splice(dragIndex.value, 1);
  arr.splice(idx, 0, moved);
  charts.value = arr;
  dragIndex.value = null;
  saveConfig();
}

// ========== Overview: 对象类型卡片网格 + 左侧分组筛选 ==========
const searchQuery = ref('');
const viewMode = ref<'list' | 'graph'>('list');
const selectedGroup = ref('all');

function getGroup(apiName: string): string {
  // 按首字母/前缀简单分组（实际可按 implementsInterfaces 或自定义 group）
  const first = (apiName[0] || '').toUpperCase();
  if (first >= 'A' && first <= 'M') return 'A-M';
  if (first >= 'N' && first <= 'Z') return 'N-Z';
  return 'Other';
}

const groups = computed(() => {
  const m: Record<string, number> = {};
  for (const t of objectTypes.value) {
    const g = getGroup(t.apiName);
    m[g] = (m[g] || 0) + 1;
  }
  return m;
});

const filteredTypes = computed(() => {
  let list = objectTypes.value;
  if (selectedGroup.value !== 'all') {
    list = list.filter((t) => getGroup(t.apiName) === selectedGroup.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (t) => t.displayName.toLowerCase().includes(q) || t.apiName.toLowerCase().includes(q),
    );
  }
  return list;
});

// ========== Objects Tab: 实例列表 ==========
const instances = ref<any[]>([]); // rid + properties
const instancesLoading = ref(false);
const instanceSearch = ref('');

async function loadInstances() {
  if (!objectTypeApiName.value) return;
  instancesLoading.value = true;
  await tryRequest(async () => {
    instances.value = await s2explore.listInstances(objectTypeApiName.value);
  });
  instancesLoading.value = false;
}

const filteredInstances = computed(() => {
  if (!instanceSearch.value) return instances.value;
  const q = instanceSearch.value.toLowerCase();
  return instances.value.filter((inst) =>
    JSON.stringify(inst.properties || {}).toLowerCase().includes(q) ||
    inst.rid?.toLowerCase().includes(q),
  );
});

/** 获取对象类型的 titleProperty，用于展示实例名称 */
function getInstanceTitle(inst: any): string {
  const tp = currentObjectType.value?.titleProperty;
  if (tp && inst.properties?.[tp]) return String(inst.properties[tp]);
  return inst.rid || '(未命名)';
}

/** 获取实例属性列表 */
function instanceColumns(): { apiName: string; displayName: string }[] {
  if (!currentObjectType.value?.properties.length) return [];
  return currentObjectType.value.properties.map((p) => ({ apiName: p.apiName, displayName: p.displayName || p.apiName }));
}

// ========== 单对象详情视图 ==========
const selectedRid = ref<string | null>(null);
const objectDetail = ref<any>(null); // 完整实例
const objectLinks = ref<ObjectLink[]>([]);
const detailLoading = ref(false);

async function openObjectDetail(rid: string) {
  selectedRid.value = rid;
  detailLoading.value = true;
  await tryRequest(async () => {
    // 从已加载的实例中找
    objectDetail.value = instances.value.find((i) => i.rid === rid) || null;
    objectLinks.value = await s2explore.getObjectLinks(objectTypeApiName.value, rid);
  });
  detailLoading.value = false;
}

function backToList() {
  selectedRid.value = null;
  objectDetail.value = null;
  objectLinks.value = [];
}

// ========== 加载 ==========
async function load() {
  loading.value = true;
  await tryRequest(async () => {
    [objectTypes.value, linkTypes.value] = await Promise.all([
      s2.listObjectTypes(),
      s2link.listLinkTypes(),
    ]);
    // 找到当前类型
    currentObjectType.value =
      objectTypes.value.find((t) => t.apiName === objectTypeApiName.value) || null;
  });
  loading.value = false;
  // 自动加载实例与探索配置
  if (objectTypeApiName.value) {
    loadInstances();
    loadExploreConfig();
  }
}

onMounted(load);

// objectType 切换时重新加载该类型独立的探索配置与类型定义
watch(objectTypeApiName, (apiName) => {
  // 同步更新当前对象类型定义（否则 getPropDef / 实例列仍用上一个类型的）
  currentObjectType.value =
    objectTypes.value.find((t) => t.apiName === apiName) || null;
  selectedRid.value = null;
  objectDetail.value = null;
  objectLinks.value = [];
  if (apiName) {
    loadExploreConfig();
    loadInstances();
  } else {
    charts.value = [];
  }
});

/** 获取 link type 的显示名 */
function ltDisplayName(apiName: string): string {
  return linkTypes.value.find((lt) => lt.apiName === apiName)?.displayName || apiName;
}

// ========== 本体图谱（Ontology Graph）==========
// 节点 = object type；边 = link type（连接 source_type -> target_type）
const GRAPH_W = 900;
const GRAPH_H = 560;
const graphNodes = computed(() => {
  const types = objectTypes.value;
  const n = types.length;
  const cx = GRAPH_W / 2;
  const cy = GRAPH_H / 2;
  const r = Math.min(GRAPH_W, GRAPH_H) / 2 - 90;
  return types.map((t, i) => {
    const angle = (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2;
    return {
      apiName: t.apiName,
      label: t.displayName || t.apiName,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
});
const graphNodeMap = computed(() => {
  const m: Record<string, { x: number; y: number; label: string }> = {};
  for (const nd of graphNodes.value) m[nd.apiName] = nd;
  return m;
});
const graphEdges = computed(() => {
  const m = graphNodeMap.value;
  return linkTypes.value
    .filter((lt) => m[lt.sourceType] && m[lt.targetType])
    .map((lt) => ({
      source: lt.sourceType,
      target: lt.targetType,
      label: lt.displayName || lt.apiName,
      self: lt.sourceType === lt.targetType,
      x1: m[lt.sourceType].x,
      y1: m[lt.sourceType].y,
      x2: m[lt.targetType].x,
      y2: m[lt.targetType].y,
    }));
});
</script>

<template>
  <div class="explore-layout">
    <!-- 顶部导航栏 -->
    <header class="explore-header">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem :to="{ path: '/s2/explore' }">Object Explorer</ElBreadcrumbItem>
        <ElBreadcrumbItem v-if="objectTypeApiName">
          {{ currentObjectType?.displayName || objectTypeApiName }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
      <div class="explore-header__actions">
        <ElButton
          v-if="objectTypeApiName"
          size="small"
          :icon="ArrowLeft"
          @click="router.push('/s2/explore')"
        >返回全部类型</ElButton>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="explore-body">
      <!-- ====== 浏览主页：所有 object type 网格 + 搜索/分组 ====== -->
      <template v-if="!objectTypeApiName">
        <div class="overview-layout">
          <!-- 左侧分组 -->
          <aside class="overview-sidebar">
            <h4 class="sidebar-title">对象类型分组</h4>
            <div
              class="group-item"
              :class="{ 'group-item--active': selectedGroup === 'all' }"
              @click="selectedGroup = 'all'"
            >
              <span class="group-dot" />
              全部
              <span class="group-count">{{ objectTypes.length }}</span>
            </div>
            <div
              v-for="(count, g) in groups"
              :key="g"
              class="group-item"
              :class="{ 'group-item--active': selectedGroup === g }"
              @click="selectedGroup = g"
            >
              <span class="group-dot" />
              {{ g }}
              <span class="group-count">{{ count }}</span>
            </div>
          </aside>

          <!-- 右侧卡片网格 -->
          <main class="overview-main">
            <div class="overview-toolbar">
              <ElInput
                v-model="searchQuery"
                placeholder="搜索对象类型和属性..."
                clearable
                :prefix-icon="Search"
                style="width: 360px"
              />
              <div class="view-toggle">
                <ElButton
                  size="small"
                  :type="viewMode === 'list' ? 'primary' : ''"
                  @click="viewMode = 'list'"
                >List</ElButton>
                <ElButton
                  size="small"
                  :type="viewMode === 'graph' ? 'primary' : ''"
                  @click="viewMode = 'graph'"
                >Graph</ElButton>
              </div>
            </div>

            <!-- 卡片视图 -->
            <div v-if="viewMode === 'list'" v-loading="loading" class="type-grid">
              <ElCard
                v-for="t in filteredTypes"
                :key="t.apiName"
                class="ot-card"
                shadow="hover"
                @click="router.push(`/s2/explore/${t.apiName}`)"
              >
                <div class="ot-card__head">
                  <span class="ot-card__name">{{ t.displayName }}</span>
                  <ElTag size="small" type="info">{{ t.properties.length }} 属性</ElTag>
                </div>
                <p class="ot-card__desc">{{ t.description || '暂无描述' }}</p>
                <div class="ot-card__meta">
                  <span class="mono">{{ t.apiName }}</span>
                  <span v-if="t.sourceTable" class="ot-card__table">{{ t.sourceTable }}</span>
                </div>
              </ElCard>
              <ElEmpty v-if="!loading && filteredTypes.length === 0" description="没有匹配的对象类型" />
            </div>

            <!-- 图谱视图 -->
            <div v-else class="graph-wrap">
              <svg :viewBox="`0 0 ${GRAPH_W} ${GRAPH_H}`" class="ontology-graph">
                <!-- 边 -->
                <g v-for="(e, i) in graphEdges" :key="'e' + i">
                  <line
                    :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
                    class="graph-edge"
                    :class="{ 'graph-edge--self': e.self }"
                  />
                  <text
                    :x="(e.x1 + e.x2) / 2" :y="(e.y1 + e.y2) / 2 - 4"
                    class="graph-edge__label"
                    text-anchor="middle"
                  >{{ e.label }}</text>
                </g>
                <!-- 节点 -->
                <g
                  v-for="nd in graphNodes"
                  :key="nd.apiName"
                  class="graph-node"
                  @click="router.push(`/s2/explore/${nd.apiName}`)"
                >
                  <circle :cx="nd.x" :cy="nd.y" r="34" class="graph-node__circle" />
                  <text :x="nd.x" :y="nd.y - 4" text-anchor="middle" class="graph-node__title">{{ nd.label }}</text>
                  <text :x="nd.x" :y="nd.y + 12" text-anchor="middle" class="graph-node__sub">{{ nd.apiName }}</text>
                </g>
              </svg>
              <p class="graph-hint">点击任意节点进入该对象类型的详细探索；连线表示关系类型（source → target）。</p>
            </div>
          </main>
        </div>
      </template>

      <!-- ====== 类型探索：实例列表 + 属性图表画布 ====== -->
      <template v-else-if="!selectedRid">
        <div class="objects-view">
          <!-- 属性图表画布 -->
          <section class="chart-canvas-section">
            <div class="chart-canvas-bar">
              <ElSelect
                v-model="propToAdd"
                filterable
                placeholder="搜索属性以添加图表..."
                size="small"
                style="width: 320px"
                @change="(v: string) => { addProp(v); propToAdd = ''; }"
              >
                <ElOption
                  v-for="p in currentObjectType?.properties"
                  :key="p.apiName"
                  :label="`${p.displayName || p.apiName} (${p.apiName})`"
                  :value="p.apiName"
                  :disabled="charts.includes(p.apiName)"
                />
              </ElSelect>
              <span class="chart-canvas-hint">添加属性后，下方展示该属性的分布图表（数值→直方图，其它→计数条形图）</span>
            </div>
            <div v-if="charts.length" class="chart-grid">
              <div
                v-for="(item, idx) in charts"
                :key="item.apiName"
                class="chart-grid__cell"
                draggable="true"
                :class="{ 'chart-grid__cell--drag': dragIndex === idx }"
                @dragstart="onDragStart(idx)"
                @dragover="onDragOver(idx, $event)"
                @drop="onDrop(idx)"
              >
                <PropertyChartCard
                  v-if="getPropDef(item.apiName)"
                  :object-type="objectTypeApiName"
                  :property="getPropDef(item.apiName)!"
                  :kind="item.kind"
                  @remove="confirmRemove(item.apiName)"
                  @update:kind="(k) => updateChartKind(item.apiName, k)"
                />
              </div>
            </div>
            <ElEmpty v-else description="从上方选择属性，添加探索图表" />
          </section>

          <ElDivider />

          <div class="objects-toolbar">
            <ElInput
              v-model="instanceSearch"
              placeholder="搜索实例属性..."
              clearable
              :prefix-icon="Search"
              style="width: 320px"
            />
            <span class="objects-count">{{ filteredInstances.length }} 条记录</span>
          </div>
          <div v-loading="instancesLoading" class="objects-table-wrap">
            <ElTable
              :data="filteredInstances"
              stripe
              highlight-current-row
              style="width: 100%"
              @row-click="(row: any) => openObjectDetail(row.rid)"
              class="instance-table"
            >
              <ElTableColumn prop="rid" label="RID" width="180" fixed>
                <template #default="{ row }">
                  <span class="mono">{{ row.rid }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn
                v-for="col in instanceColumns()"
                :key="col.apiName"
                :prop="'properties.' + col.apiName"
                :label="col.displayName"
                min-width="140"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  {{ row.properties?.[col.apiName] ?? '—' }}
                </template>
              </ElTableColumn>
              <ElTable-column width="80" label="操作" fixed="right">
                <template #default="{ row }">
                  <ElButton size="small" text type="primary" @click.stop="openObjectDetail(row.rid)">详情</ElButton>
                </template>
              </ElTable-column>
            </ElTable>
            <ElEmpty v-if="!instancesLoading && filteredInstances.length === 0" description="暂无实例数据" />
          </div>
        </div>
      </template>

      <!-- ====== 单对象详情视图（Properties + Links）====== -->
      <template v-else>
        <div class="detail-view">
          <div class="detail-nav">
            <ElButton size="small" :icon="ArrowLeft" @click="backToList">返回实例列表</ElButton>
            <span class="detail-nav__title">
              {{ getInstanceTitle(objectDetail) }}
              <span class="mono detail-nav__rid">{{ selectedRid }}</span>
            </span>
          </div>

          <div v-loading="detailLoading" class="detail-body">
            <!-- Properties 两栏展示 -->
            <section class="detail-section">
              <h3 class="detail-section__title">
                <InfoFilled /> 属性
              </h3>
              <ElDescriptions :column="2" border size="small" class="prop-desc">
                <ElDescriptionsItem
                  v-for="p in currentObjectType?.properties"
                  :key="p.apiName"
                  :label="p.displayName || p.apiName"
                >
                  <span v-if="p.derived" class="derived-badge">
                    <ElTag size="small" type="warning">派生</ElTag>
                    {{ objectDetail?.properties?.[p.apiName] ?? '—' }}
                  </span>
                  <span v-else>{{ objectDetail?.properties?.[p.apiName] ?? '—' }}</span>
                </ElDescriptionsItem>
              </ElDescriptions>
            </section>

            <!-- Links 关联关系面板 -->
            <ElDivider />
            <section class="detail-section">
              <h3 class="detail-section__title">
                <Link /> 关联关系
              </h3>

              <div v-if="objectLinks.length === 0" class="links-empty">
                该对象暂无关联关系。
              </div>

              <div v-for="grp in objectLinks" :key="grp.linkType" class="link-group">
                <div class="link-group__head">
                  <ElTag type="primary">{{ grp.linkDisplayName || grp.linkType }}</ElTag>
                  <span class="link-group__target">→ {{ grp.otherObjectType }}</span>
                  <ElTag size="small" type="info">{{ grp.links.length }} 条关联</ElTag>
                </div>
                <div class="link-group__items">
                  <div
                    v-for="lnk in grp.links"
                    :key="lnk.otherRid"
                    class="link-item"
                  >
                    <ElIcon><Link /></ElIcon>
                    <span class="link-item__dir">
                      {{ lnk.direction === 'target' ? '指向' : '被...指向' }}
                    </span>
                    <span class="mono link-item__rid">{{ lnk.otherRid }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.explore-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.explore-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.explore-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  min-height: 0;
}

.explore-tabs {
  height: 100%;
}
.explore-tabs :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow-y: auto;
}

/* ====== 属性图表画布 ====== */
.chart-canvas-section {
  margin-bottom: var(--space-3);
}
.chart-canvas-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}
.chart-canvas-hint { font-size: 12px; color: var(--text-muted); }
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-3);
}
.chart-grid__cell {
  position: relative;
  cursor: grab;
}
.chart-grid__cell:active { cursor: grabbing; }
.chart-grid__cell--drag { opacity: 0.4; }

/* ====== Overview 布局 ====== */
.overview-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-4);
  height: 100%;
}

.overview-sidebar {
  border-right: 1px solid var(--border);
  padding-right: var(--space-3);
}
.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.group-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.group-item:hover { background: var(--accent-soft); }
.group-item--active { background: var(--accent-soft); font-weight: 600; }
.group-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0;
}
.group-count { margin-left: auto; color: var(--text-muted); font-size: 12px; }

.overview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.view-toggle { display: flex; gap: 4px; }

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
}

.ot-card {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.ot-card:hover { transform: translateY(-2px); }
.ot-card :deep(.el-card__body) { padding: var(--space-3); }

.ot-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-1);
}
.ot-card__name { font-weight: 600; font-size: 14px; }
.ot-card__desc {
  font-size: 12px; color: var(--text-muted);
  line-height: 1.4; margin-bottom: var(--space-2);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.ot-card__meta {
  display: flex; gap: var(--space-2); font-size: 12px; color: var(--text-muted);
}
.ot-card__table {
  max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ====== 本体图谱 ====== */
.graph-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.ontology-graph {
  width: 100%;
  max-width: 960px;
  height: auto;
  background: var(--bg-subtle, #fafbfc);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.graph-edge {
  stroke: var(--border-strong, #c0c4cc);
  stroke-width: 1.5;
}
.graph-edge--self {
  stroke: var(--accent, #409eff);
  stroke-dasharray: 4 3;
}
.graph-edge__label {
  font-size: 11px;
  fill: var(--text-muted);
  pointer-events: none;
}
.graph-node { cursor: pointer; }
.graph-node__circle {
  fill: #fff;
  stroke: var(--accent, #409eff);
  stroke-width: 2;
  transition: fill 0.15s;
}
.graph-node:hover .graph-node__circle { fill: var(--accent-soft, #ecf5ff); }
.graph-node__title {
  font-size: 12px;
  font-weight: 600;
  fill: var(--text-primary);
  pointer-events: none;
}
.graph-node__sub {
  font-size: 9px;
  fill: var(--text-muted);
  pointer-events: none;
}
.graph-hint {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin: 4px 0 0;
}

/* ====== Objects 实例列表 ====== */
.objects-view { height: 100%; display: flex; flex-direction: column; }
.objects-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-3); flex-shrink: 0;
}
.objects-count { font-size: 13px; color: var(--text-muted); }
.objects-table-wrap { flex: 1; overflow: auto; }
.instance-table { cursor: pointer; }

/* ====== 详情视图 ====== */
.detail-view { height: 100%; display: flex; flex-direction: column; }
.detail-nav {
  display: flex; align-items: center; gap: var(--space-3);
  padding-bottom: var(--space-3); border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.detail-nav__title {
  font-weight: 600; font-size: 16px;
}
.detail-nav__rid {
  font-size: 12px; color: var(--text-muted); margin-left: var(--space-2);
}
.detail-body {
  flex: 1; overflow-y: auto; padding-top: var(--space-3);
}
.detail-section__title {
  display: flex; align-items: center; gap: 6px;
  font-size: 15px; font-weight: 600; margin: 0 0 var(--space-3);
  color: var(--text-primary);
}
.prop-desc { margin-top: var(--space-2); }
.derived-badge { display: flex; align-items: center; gap: 6px; }

/* ====== 关联关系面板 ====== */
.links-empty {
  color: var(--text-muted); font-size: 13px; padding: var(--space-4);
  text-align: center;
}
.link-group {
  margin-bottom: var(--space-3);
  border: 1px solid var(--border); border-radius: 8px; padding: var(--space-3);
}
.link-group__head {
  display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);
}
.link-group__target { font-size: 13px; color: var(--text-secondary); }
.link-group__items { display: flex; flex-direction: column; gap: 4px; }
.link-item {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 8px; border-radius: 4px; font-size: 13px;
  transition: background 0.12s;
}
.link-item:hover { background: var(--accent-soft); }
.link-item__dir { color: var(--text-muted); font-size: 12px; }
.link-item__rid {
  font-family: var(--font-mono); font-size: 12px;
}

.mono { font-family: var(--font-mono); }
</style>
