<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import {
  ElButton, ElMessage, ElTag, ElDialog,
  ElInput, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElMessageBox,
  ElIcon, ElDivider, ElCheckbox, ElTable, ElTableColumn,
} from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import type { ObjectType, LinkType } from '@/api';
import { s2, s2link } from '@/api';
import { tryRequest } from '@/utils/error';

const links = ref<LinkType[]>([]);
const objects = ref<ObjectType[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);

// 搜索关键词：按 apiName / displayName / 源·目标对象名过滤
const keyword = ref('');
const filteredLinks = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return links.value;
  return links.value.filter((lt) => {
    const src = objName(lt.sourceType).toLowerCase();
    const tgt = objName(lt.targetType).toLowerCase();
    return (
      lt.apiName.toLowerCase().includes(kw) ||
      (lt.displayName || '').toLowerCase().includes(kw) ||
      src.includes(kw) ||
      tgt.includes(kw)
    );
  });
});

// 列表选择状态
const selectedLinks = ref<Set<string>>(new Set());
function toggleSelect(apiName: string, val: boolean) {
  if (val) selectedLinks.value.add(apiName);
  else selectedLinks.value.delete(apiName);
}
function toggleSelectAll(val: boolean) {
  if (val) selectedLinks.value = new Set(filteredLinks.value.map((l) => l.apiName));
  else selectedLinks.value.clear();
}

// 对象类型图标/颜色
const OBJ_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];
function objIcon(apiName: string): string {
  const o = objects.value.find((x) => x.apiName === apiName);
  return o?.icon || '📦';
}
function objColor(apiName: string): string {
  const idx = objects.value.findIndex((x) => x.apiName === apiName);
  return OBJ_COLORS[idx % OBJ_COLORS.length];
}

// Status 标签
function statusLabel(lt: LinkType): string {
  if (lt.visibility === 'Internal') return '实验性';
  if (lt.visibility === 'Active') return '已启用';
  if (!lt.sourceType || !lt.targetType) return '草稿';
  return lt.visibility === 'Internal' ? '实验性' : '已启用';
}
function statusTagType(lt: LinkType): 'success' | 'warning' | 'danger' | 'info' {
  const s = statusLabel(lt);
  if (s === '实验性') return 'warning';
  if (s === '已启用') return 'success';
  return 'info';
}

// 表单：参照 Palantir 截图，左右两栏（Source / Target）
const form = ref({
  apiName: '', displayName: '',
  sourceType: '', targetType: '',
  sourceCardinality: 'one' as 'one' | 'many',
  targetCardinality: 'many' as 'one' | 'many',
  primaryKey: '', foreignKey: '',
  pluralName: '', visibility: 'Normal',
  instanceSource: 'source' as 'source' | 'managed',
});

// 源对象类型的属性列表（用于 Primary key 下拉）
const sourceProps = computed(() => {
  const ot = objects.value.find((o) => o.apiName === form.value.sourceType);
  if (!ot?.properties) return [];
  return (Array.isArray(ot.properties) ? ot.properties : []).map((p: any) => ({
    label: `${p.displayName || p.apiName} (${p.apiName})`,
    value: p.apiName,
  }));
});
// 目标对象类型的属性列表（用于 Foreign key 下拉）
const targetProps = computed(() => {
  const ot = objects.value.find((o) => o.apiName === form.value.targetType);
  if (!ot?.properties) return [];
  return (Array.isArray(ot.properties) ? ot.properties : []).map((p: any) => ({
    label: `${p.displayName || p.apiName} (${p.apiName})`,
    value: p.apiName,
  }));
});

async function load() {
  loading.value = true;
  await tryRequest(async () => {
    const [l, o] = await Promise.all([s2link.listLinkTypes(), s2.listObjectTypes()]);
    links.value = l;
    objects.value = o;
  });
  loading.value = false;
}

function resetForm() {
  form.value = {
    apiName: '', displayName: '',
    sourceType: '', targetType: '',
    sourceCardinality: 'one', targetCardinality: 'many',
    primaryKey: '', foreignKey: '',
    pluralName: '', visibility: 'Normal',
    instanceSource: 'source',
  };
  isEdit.value = false;
}

function openCreate() {
  resetForm();
  dialogVisible.value = true;
}

async function openEdit(lt: LinkType) {
  isEdit.value = true;
  form.value = {
    apiName: lt.apiName,
    displayName: lt.displayName || '',
    sourceType: lt.sourceType || '',
    targetType: lt.targetType || '',
    sourceCardinality: lt.sourceCardinality || 'one',
    targetCardinality: lt.targetCardinality || 'many',
    primaryKey: lt.primaryKey || '',
    foreignKey: lt.foreignKey || '',
    pluralName: lt.pluralName || '',
    visibility: lt.visibility || 'Normal',
    instanceSource: lt.instanceSource || 'source',
  };
  dialogVisible.value = true;
}

async function submit() {
  if (!form.value.displayName || !form.value.apiName) {
    ElMessage.warning('请填写显示名称与 API 名称');
    return;
  }
  if (!form.value.sourceType || !form.value.targetType) {
    ElMessage.warning('请选择源端和目标端对象类型');
    return;
  }
  await tryRequest(async () => {
    if (isEdit.value) {
      await s2link.updateLinkType(form.value.apiName, { ...form.value });
      ElMessage.success('关系类型已更新');
    } else {
      // 创建时把 sourceCardinality + targetCardinality 合成 legacy cardinality
      const payload: any = { ...form.value };
      payload.cardinality = `${form.value.sourceCardinality}-to-${form.value.targetCardinality}`;
      await s2link.createLinkType(payload);
      ElMessage.success('关系类型创建成功');
    }
    dialogVisible.value = false;
    await load();
  });
}

async function onDelete(l: LinkType) {
  try {
    await ElMessageBox.confirm(
      `确定删除关系类型「${l.displayName}（${l.apiName}）」吗？该操作不可恢复。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    );
  } catch {
    return;
  }
  await tryRequest(async () => {
    await s2link.deleteLinkType(l.apiName);
    ElMessage.success('已删除');
    await load();
  });
}

function objName(apiName: string) {
  return objects.value.find((o) => o.apiName === apiName)?.displayName || apiName;
}

// 关系基数汇总（展示用）：源→目标 的 1:N 以及自然语言解释
const cardinalitySummary = computed(() => {
  const s = form.value.sourceCardinality;
  const t = form.value.targetCardinality;
  const src = objName(form.value.sourceType) || '源对象';
  const tgt = objName(form.value.targetType) || '目标对象';
  // 实体数量比（源 : 目标）：源端“一对多”表示目标侧多，故比例是 t:s
  const label = `${t === 'many' ? 'N' : '1'}:${s === 'many' ? 'N' : '1'}`;
  let hint = '';
  if (s === 'one' && t === 'many') hint = `一个${tgt}有多个${src}`;
  else if (s === 'many' && t === 'one') hint = `一个${src}有多个${tgt}`;
  else if (s === 'one' && t === 'one') hint = '一一对应';
  else hint = '多对多';
  return { label, hint };
});

function cardinalityLabel(lt: LinkType) {
  const sc = lt.sourceCardinality || 'one';
  const tc = lt.targetCardinality || 'many';
  return `${sc.charAt(0).toUpperCase() + sc.slice(1)}-to-${tc.charAt(0).toUpperCase() + tc.slice(1)}`;
}

onMounted(load);
</script>

<template>
  <div class="page">
    <!-- ====== Palantir 风格列表头 ====== -->
    <div class="lt-list-bar">
      <div class="lt-list-bar__left">
        <ElCheckbox
          :model-value="selectedLinks.size === filteredLinks.length && filteredLinks.length > 0"
          :indeterminate="selectedLinks.size > 0 && selectedLinks.size < filteredLinks.length"
          @change="(v: any) => toggleSelectAll(v)"
        />
        <span class="lt-list-bar__title">关系类型</span>
        <span class="lt-list-bar__count">
          <template v-if="keyword">搜索到 {{ filteredLinks.length }} / {{ links.length }}</template>
          <template v-else>{{ links.length }}</template>
        </span>
      </div>
      <div class="lt-list-bar__right">
        <ElInput
          v-model="keyword"
          placeholder="搜索名称 / API / 对象类型"
          clearable
          class="lt-list-bar__search"
          :prefix-icon="Search"
        />
        <ElButton type="primary" :icon="Plus" @click="openCreate">新建关系类型</ElButton>
        <ElButton text><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2z"/></svg></ElButton>
      </div>
    </div>

    <!-- ====== 列表：表格行风格（Palantir）====== -->
    <div v-loading="loading" class="lt-table-wrap">
      <table class="lt-table">
        <thead>
          <tr>
            <th style="width: 40px"></th>
            <th>名称</th>
            <th style="width: 140px; text-align: right;">状态</th>
            <th style="width: 40px; text-align: center;">
              <ElButton text size="small"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 15.5A1.5 1.5 0 0 1 13.5 17H18a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 18 20H13.5A1.5 1.5 0 0 1 12 18.5V15.5M12 8.5A1.5 1.5 0 0 1 13.5 7H18a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 18 10H13.5A1.5 1.5 0 0 1 12 8.5V8.5M12 1.5A1.5 1.5 0 0 1 13.5 0H18a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 18 3H13.5A1.5 1.5 0 0 1 12 1.5V1.5M6 15.5A1.5 1.5 0 0 1 7.5 17H9a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 9 20H7.5A1.5 1.5 0 0 1 6 18.5V15.5M6 8.5A1.5 1.5 0 0 1 7.5 7H9a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 9 10H7.5A1.5 1.5 0 0 1 6 8.5V8.5M6 1.5A1.5 1.5 0 0 1 7.5 0H9a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 9 3H7.5A1.5 1.5 0 0 1 6 1.5V1.5Z"/></svg></ElButton>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="lt in filteredLinks"
            :key="lt.apiName"
            class="lt-row"
            :class="{ 'lt-row--selected': selectedLinks.has(lt.apiName) }"
            @click="openEdit(lt)"
          >
            <td @click.stop>
              <ElCheckbox
                :model-value="selectedLinks.has(lt.apiName)"
                @change="(v: any) => toggleSelect(lt.apiName, v)"
              />
            </td>
            <td>
              <div class="lt-row__name">
                <span class="lt-row__icon" :style="{ background: objColor(lt.sourceType) }">{{ objIcon(lt.sourceType) }}</span>
                <span class="lt-row__src-name">{{ objName(lt.sourceType) }}</span>
                <span class="lt-row__arrow">⇄</span>
                <span class="lt-row__icon" :style="{ background: objColor(lt.targetType) }">{{ objIcon(lt.targetType) }}</span>
                <span class="lt-row__tgt-name">{{ objName(lt.targetType) }}</span>
              </div>
            </td>
            <td style="text-align: right;">
              <ElTag
                size="small"
                :type="statusTagType(lt)"
                effect="plain"
              >{{ statusLabel(lt) }}</ElTag>
            </td>
            <td style="text-align: center;">
              <ElButton text size="small" title="删除关系类型" @click.stop="onDelete(lt)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </ElButton>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredLinks.length === 0 && keyword" class="empty-hint">
        未找到匹配「{{ keyword }}」的关系类型，换个关键词试试。
      </div>
      <div v-else-if="!loading && links.length === 0" class="empty-hint">
        暂无关系类型，点击右上角「新建关系类型」创建。
      </div>
    </div>

    <!-- ====== 创建/编辑弹窗（Palantir 风格：左右两栏）====== -->
    <ElDialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑关系类型' : '新建关系类型'"
      width="960px"
      align-center
      lock-scroll
      destroy-on-close
    >
      <div v-if="form.sourceType && form.targetType" class="lt-summary">
        <span class="lt-summary__rel">{{ objName(form.sourceType) }} → {{ objName(form.targetType) }}</span>
        <span class="lt-summary__card">{{ cardinalitySummary.label }}</span>
        <span class="lt-summary__hint">{{ cardinalitySummary.hint }}</span>
      </div>
      <div class="lt-config">
        <!-- ====== 左栏：源端（Source）====== -->
        <div class="lt-col">
          <div class="lt-col__header">
            <ElSelect
              v-model="form.sourceType"
              placeholder="选择源对象类型"
              filterable
              style="width: 240px; font-weight: 600;"
            >
              <ElOption v-for="o in objects" :key="o.apiName" :label="`${o.icon || ''} ${o.displayName}`" :value="o.apiName" />
            </ElSelect>
            <ElTag size="small" :type="form.visibility === 'Internal' ? 'warning' : 'info'">{{ form.visibility || 'Normal' }}</ElTag>
          </div>

          <ElDivider />

          <!-- 基数 -->
          <div class="lt-field">
            <label class="lt-field__label">基数（每个「{{ objName(form.sourceType) || '源对象' }}」对应几个「{{ objName(form.targetType) || '目标对象' }}」）</label>
            <ElRadioGroup v-model="form.sourceCardinality" size="large">
              <ElRadioButton value="one">1 个</ElRadioButton>
              <ElRadioButton value="many">多个</ElRadioButton>
            </ElRadioGroup>
          </div>

          <!-- 主键属性 -->
          <div class="lt-field">
            <label class="lt-field__label">主键属性（Primary key）</label>
            <ElSelect
              v-model="form.primaryKey"
              placeholder="选择源对象的一个属性作为主键"
              filterable
              clearable
              style="width: 100%"
            >
              <ElOption v-for="p in sourceProps" :key="p.value" :label="p.label" :value="p.value" />
            </ElSelect>
          </div>

          <!-- 显示名称 -->
          <div class="lt-field">
            <label class="lt-field__label">显示名称 <span class="req">*</span></label>
            <ElInput v-model="form.displayName" placeholder="如：部门上下级关系" clearable />
          </div>

          <!-- 关系预览 -->
          <div v-if="form.sourceType && form.targetType" class="lt-preview">
            <span>{{ form.sourceCardinality === 'one' ? '一' : '多' }}</span>
            <ElIcon><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></ElIcon>
            <span>「{{ objName(form.sourceType) }}」{{ form.sourceCardinality === 'one' ? '对应' : '对应多个' }}「{{ objName(form.targetType) }}」</span>
          </div>

          <!-- 复数名称 -->
          <div class="lt-field">
            <label class="lt-field__label">复数名称（Plural Name）</label>
            <ElInput v-model="form.pluralName" placeholder="如：部门上下级关系列表" clearable />
          </div>

          <!-- 可见性 -->
          <div class="lt-field">
            <label class="lt-field__label">可见性（Visibility）</label>
            <ElSelect v-model="form.visibility" style="width: 140px">
              <ElOption label="正常（Normal）" value="Normal" />
              <ElOption label="内部（Internal）" value="Internal" />
            </ElSelect>
          </div>

          <!-- API 名称 -->
          <div class="lt-field">
            <label class="lt-field__label">API 名称 <span class="req">*</span></label>
            <ElInput v-model="form.apiName" placeholder="如：departmentHierarchy（英文标识，创建后不可修改）" clearable />
          </div>

          <!-- API 路径提示 -->
          <div class="lt-hint">
            {{ form.apiName || 'xxx' }}.get() — 获取单个实例
          </div>

          <!-- 类型分类 -->
          <div class="lt-field">
            <label class="lt-field__label">类型分类（Type classes）</label>
            <ElInput placeholder="+ 添加新分类（可选）" readonly style="cursor: default;" />
          </div>
        </div>

        <!-- ====== 右栏：目标端（Target）====== -->
        <div class="lt-col lt-col--target">
          <div class="lt-col__header">
            <ElSelect
              v-model="form.targetType"
              placeholder="选择目标对象类型"
              filterable
              style="width: 240px; font-weight: 600;"
            >
              <ElOption v-for="o in objects" :key="o.apiName" :label="`${o.icon || ''} ${o.displayName}`" :value="o.apiName" />
            </ElSelect>
            <ElTag size="small" :type="form.visibility === 'Internal' ? 'warning' : 'info'">{{ form.visibility || 'Normal' }}</ElTag>
          </div>

          <ElDivider />

          <!-- 基数 -->
          <div class="lt-field">
            <label class="lt-field__label">基数（每个「{{ objName(form.targetType) || '目标对象' }}」对应几个「{{ objName(form.sourceType) || '源对象' }}」）</label>
            <ElRadioGroup v-model="form.targetCardinality" size="large">
              <ElRadioButton value="one">1 个</ElRadioButton>
              <ElRadioButton value="many">多个</ElRadioButton>
            </ElRadioGroup>
          </div>

          <!-- 外键属性 -->
          <div class="lt-field">
            <label class="lt-field__label">外键属性（Foreign key）</label>
            <ElSelect
              v-model="form.foreignKey"
              placeholder="选择目标对象的一个属性作为外键关联"
              filterable
              clearable
              style="width: 100%"
            >
              <ElOption v-for="p in targetProps" :key="p.value" :label="p.label" :value="p.value" />
            </ElSelect>
          </div>

          <!-- 显示名称 -->
          <div class="lt-field">
            <label class="lt-field__label">显示名称 <span class="req">*</span></label>
            <ElInput v-model="form.displayName" placeholder="如：部门上下级关系" clearable />
          </div>

          <!-- 关系预览 -->
          <div v-if="form.sourceType && form.targetType" class="lt-preview">
            <span>{{ form.targetCardinality === 'one' ? '1' : 'N' }}</span>
            <ElIcon><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></ElIcon>
            <span>「{{ objName(form.targetType) }}」对应{{ form.targetCardinality === 'one' ? '1 个' : '多个' }}「{{ objName(form.sourceType) }}」</span>
          </div>

          <!-- 复数名称 -->
          <div class="lt-field">
            <label class="lt-field__label">复数名称（Plural Name）<span class="req">*</span></label>
            <ElInput v-model="form.pluralName" placeholder="如：部门上下级关系列表" clearable />
          </div>

          <!-- 可见性 -->
          <div class="lt-field">
            <label class="lt-field__label">可见性（Visibility）</label>
            <ElSelect v-model="form.visibility" style="width: 140px">
              <ElOption label="正常（Normal）" value="Normal" />
              <ElOption label="内部（Internal）" value="Internal" />
            </ElSelect>
          </div>

          <!-- API 名称 -->
          <div class="lt-field">
            <label class="lt-field__label">API 名称 <span class="req">*</span></label>
            <ElInput v-model="form.apiName" placeholder="如：departmentHierarchy（英文标识，创建后不可修改）" clearable />
          </div>

          <!-- API 路径提示 -->
          <div class="lt-hint">
            {{ form.apiName || 'xxx' }}.all() — 获取所有实例
          </div>
        </div>
      </div>

      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submit">{{ isEdit ? '保存' : '创建' }}</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ====== 列表头（Palantir 风格）====== */
.lt-list-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: white;
}
.lt-list-bar__left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.lt-list-bar__title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}
.lt-list-bar__count {
  font-size: 13px;
  color: var(--text-muted);
}
.lt-list-bar__right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lt-list-bar__search {
  width: 240px;
}

/* ====== 表格列表 ===== */
.lt-table-wrap {
  border: 1px solid var(--border);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: white;
}
.lt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.lt-table th {
  text-align: left;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
  font-weight: 500;
  font-size: 12px;
  color: var(--text-muted);
  background: #fafbfc;
}
.lt-row {
  cursor: pointer;
  transition: background 0.15s;
}
.lt-row:hover {
  background: #f5f7fa;
}
.lt-row--selected {
  background: #eff6ff;
}
.lt-row td {
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}
.lt-row:last-child td {
  border-bottom: none;
}

/* 行内 Name 区域：图标 + 源名 + 箭头 + 图标 + 目标名 */
.lt-row__name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.lt-row__icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  flex-shrink: 0;
}
.lt-row__src-name,
.lt-row__tgt-name {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-primary);
}
.lt-row__arrow {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0 2px;
}

.empty-hint {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* ====== Palantir 风格：左右两栏配置弹窗 ===== */
.lt-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  max-height: 70vh;
  overflow-y: auto;
  padding-right: var(--space-2);
}
.lt-summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-3);
  background: var(--accent-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}
.lt-summary__rel { font-weight: 600; }
.lt-summary__card {
  color: var(--accent);
  font-weight: 600;
  font-family: var(--font-mono);
}
.lt-summary__hint { color: var(--text-secondary); }
.lt-col {
  padding: var(--space-3);
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fafbfc;
}
.lt-col--target {
  background: #fefefe;
}
.lt-col__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.lt-field {
  margin-bottom: var(--space-3);
}
.lt-field__label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.req {
  color: #e53e3e;
}
.lt-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  padding: 6px 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid var(--border);
  margin-bottom: var(--space-3);
}
.lt-hint {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
  padding: 6px 10px;
  background: #f1f5f9;
  border-radius: 4px;
  margin-bottom: var(--space-3);
}
</style>
