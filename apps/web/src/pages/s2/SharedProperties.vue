<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Share, Plus, Edit as EditIcon, Delete } from '@element-plus/icons-vue';
import { s2shared, s2, valtype } from '@/api';
import type { SharedProperty, ObjectType } from '@/api';

const loading = ref(false);
const list = ref<SharedProperty[]>([]);
const objectTypes = ref<ObjectType[]>([]);
const valueTypes = ref<any[]>([]);

// 使用某个共享属性的对象类型清单（引用 sharedRef === apiName）
const usages = computed<Record<string, string[]>>(() => {
  const map: Record<string, string[]> = {};
  for (const sp of list.value) map[sp.apiName] = [];
  for (const ot of objectTypes.value) {
    for (const p of ot.properties) {
      if (p.sharedRef && map[p.sharedRef]) map[p.sharedRef].push(ot.displayName);
    }
  }
  return map;
});

async function load() {
  loading.value = true;
  try {
    const [sps, ots, vts] = await Promise.all([s2shared.list(), s2.listObjectTypes(), valtype.list()]);
    list.value = sps;
    objectTypes.value = ots;
    valueTypes.value = vts;
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败');
  } finally {
    loading.value = false;
  }
}

// ---------- 创建 / 编辑 ----------
// 注意：required（是否必填）由各对象类型在"引用"处自行配置，共享侧只定义通用元数据。
const dialogVisible = ref(false);
const editing = ref<SharedProperty | null>(null);
const emptyForm = () => ({
  apiName: '', displayName: '', type: 'string', description: '',
  valueType: '', allowedText: '', unit: '', format: '', defaultValue: '',
});
const form = ref(emptyForm());
const dataTypes = ['string', 'integer', 'float', 'boolean', 'date', 'timestamp', 'geopoint', 'array', 'object'];

function allowedToText(values?: { value: string; label?: string; description?: string }[]): string {
  return (values ?? []).map((v) => [v.value, v.label ?? '', v.description ?? ''].join('|')).join('\n');
}
function textToAllowed(text: string) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [value, label, description] = l.split('|').map((x) => x.trim());
    return { value, ...(label ? { label } : {}), ...(description ? { description } : {}) };
  });
}

function openCreate() {
  editing.value = null;
  form.value = emptyForm();
  dialogVisible.value = true;
}

function openEdit(sp: SharedProperty) {
  editing.value = sp;
  form.value = {
    apiName: sp.apiName, displayName: sp.displayName, type: sp.type,
    description: sp.description ?? '',
    valueType: sp.valueType ?? '',
    allowedText: allowedToText(sp.allowedValues),
    unit: sp.unit ?? '', format: sp.format ?? '',
    defaultValue: sp.defaultValue === undefined || sp.defaultValue === null ? '' : String(sp.defaultValue),
  };
  dialogVisible.value = true;
}

function parseDefault(raw: string): unknown {
  const t = raw.trim();
  if (!t) return undefined;
  try { return JSON.parse(t); } catch { return t; }
}

async function save() {
  if (!form.value.apiName || !form.value.displayName) {
    ElMessage.warning('apiName / 显示名 必填');
    return;
  }
  try {
    if (editing.value) {
      await s2shared.update(editing.value.apiName, {
        displayName: form.value.displayName,
        type: form.value.type,
        description: form.value.description,
        valueType: form.value.valueType || undefined,
        allowedValues: form.value.allowedText.trim() ? textToAllowed(form.value.allowedText) : undefined,
        unit: form.value.unit || undefined,
        format: form.value.format || undefined,
        defaultValue: parseDefault(form.value.defaultValue),
      });
      ElMessage.success('已更新共享属性（引用方未覆盖的显示名/类型将自动同步）');
    } else {
      await s2shared.create({
        apiName: form.value.apiName,
        displayName: form.value.displayName,
        type: form.value.type,
        description: form.value.description,
        valueType: form.value.valueType || undefined,
        allowedValues: form.value.allowedText.trim() ? textToAllowed(form.value.allowedText) : undefined,
        unit: form.value.unit || undefined,
        format: form.value.format || undefined,
        defaultValue: parseDefault(form.value.defaultValue),
        version: 1,
        createdAt: '',
        updatedAt: '',
      });
      ElMessage.success('已创建共享属性');
    }
    dialogVisible.value = false;
    await load();
  } catch (e: any) {
    ElMessage.error(e.message || '保存失败');
  }
}

// 删除需二次确认（遵循"删除功能都需要确认"规则）
async function remove(sp: SharedProperty) {
  try {
    await ElMessageBox.confirm(
      `删除共享属性「${sp.displayName}（${sp.apiName}）」将解绑所有对象类型的引用，确定继续吗？`,
      '确认删除',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    );
  } catch {
    return;
  }
  try {
    await s2shared.remove(sp.apiName);
    ElMessage.success('已删除共享属性');
    await load();
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败');
  }
}

onMounted(load);
</script>

<template>
  <div class="shared-page">
    <div class="shared-head">
      <div>
        <h2 class="shared-title"><ElIcon><Share /></ElIcon> 共享属性</h2>
        <p class="shared-sub">跨多个对象类型复用的属性元数据（一处定义、多处引用；元数据集中，实例数据各自持有）。</p>
      </div>
      <ElButton type="primary" :icon="Plus" @click="openCreate">新建共享属性</ElButton>
    </div>

    <ElCard shadow="never" class="shared-card">
      <ElTable :data="list" v-loading="loading" empty-text="暂无共享属性">
        <ElTableColumn prop="apiName" label="API 名称" min-width="160">
          <template #default="{ row }">
            <span class="mono">{{ row.apiName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="displayName" label="显示名" min-width="140" />
        <ElTableColumn prop="type" label="类型" width="110">
          <template #default="{ row }"><ElTag size="small">{{ row.type }}</ElTag></template>
        </ElTableColumn>
        <ElTableColumn label="被引用对象类型" min-width="220">
          <template #default="{ row }">
            <template v-if="(usages[row.apiName] || []).length">
              <ElTag v-for="u in usages[row.apiName]" :key="u" size="small" type="success" effect="plain" class="usage-tag">{{ u }}</ElTag>
            </template>
            <span v-else class="muted">—</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" text :icon="EditIcon" @click="openEdit(row)">编辑</ElButton>
            <ElButton size="small" text type="danger" :icon="Delete" @click="remove(row)">删除</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 新建 / 编辑弹窗 -->
    <ElDialog v-model="dialogVisible" :title="editing ? '编辑共享属性' : '新建共享属性'" width="560px">
      <ElForm label-width="100px">
        <ElFormItem label="API 名称">
          <ElInput v-model="form.apiName" :disabled="!!editing" placeholder="如 status" />
        </ElFormItem>
        <ElFormItem label="显示名">
          <ElInput v-model="form.displayName" placeholder="如 状态" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="form.type" style="width: 100%">
            <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput v-model="form.description" type="textarea" :rows="2" placeholder="可选" />
        </ElFormItem>
        <ElFormItem label="值类型">
          <ElSelect v-model="form.valueType" clearable filterable style="width: 100%" placeholder="可选，引用 Value Types">
            <ElOption v-for="vt in valueTypes" :key="vt.apiName" :label="`${vt.displayName} (${vt.apiName})`" :value="vt.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="枚举取值">
          <ElInput v-model="form.allowedText" type="textarea" :rows="3" placeholder="每行 value|label|说明；留空表示非枚举" />
        </ElFormItem>
        <ElFormItem label="单位 / 格式">
          <ElInput v-model="form.unit" placeholder="单位，如 人、小时" style="width: 46%" />
          <ElInput v-model="form.format" placeholder="格式，如 text、date、percent" style="width: 46%; margin-left: 8px" />
        </ElFormItem>
        <ElFormItem label="默认值">
          <ElInput v-model="form.defaultValue" placeholder="同步时缺失填充；数字/布尔按 JSON 解析" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="save">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.shared-page { max-width: 1100px; }
.shared-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
.shared-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.shared-sub { color: var(--text-secondary); font-size: 13px; margin-top: 6px; max-width: 720px; }
.shared-card { border-radius: var(--radius); }
.mono { font-family: var(--font-mono); font-size: 12px; }
.usage-tag { margin: 0 4px 4px 0; }
.muted { color: var(--text-muted); }
</style>
