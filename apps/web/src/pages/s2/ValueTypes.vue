<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox, ElButton, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElTag } from 'element-plus';
import { valtype } from '@/api';
import type { ValueTypeDTO } from '@/api';

const list = ref<ValueTypeDTO[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editing = ref<string | null>(null);
const allowedText = ref('');
const form = ref<any>({ apiName: '', displayName: '', baseType: 'string', description: '', constraintKind: '', min: '', max: '', pattern: '', failureMessage: '', example: '' });

async function load() {
  loading.value = true;
  try { list.value = await valtype.list(); } catch { list.value = []; }
  loading.value = false;
}

function openCreate() {
  editing.value = null;
  form.value = { apiName: '', displayName: '', baseType: 'string', description: '', constraintKind: '', min: '', max: '', pattern: '', failureMessage: '', example: '' };
  allowedText.value = '';
  dialogVisible.value = true;
}

function openEdit(v: any) {
  editing.value = v.apiName;
  form.value = {
    apiName: v.apiName, displayName: v.displayName, baseType: v.baseType,
    description: v.description ?? '',
    constraintKind: v.constraint?.kind ?? '',
    min: v.constraint?.min ?? '', max: v.constraint?.max ?? '', pattern: v.constraint?.pattern ?? '',
    failureMessage: v.failureMessage ?? '', example: v.example ?? '',
  };
  allowedText.value = (v.allowedValues ?? []).map((x: any) => [x.value, x.label ?? '', x.description ?? ''].join('|')).join('\n');
  dialogVisible.value = true;
}

async function save() {
  if (!form.value.apiName || !form.value.displayName) { ElMessage.warning('apiName / displayName 必填'); return; }
  const allowedValues = allowedText.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [value, label, description] = l.split('|').map((x) => x.trim());
    return { value, ...(label ? { label } : {}), ...(description ? { description } : {}) };
  });
  let constraint: any = undefined;
  if (form.value.constraintKind === 'range') constraint = { kind: 'range', ...(form.value.min !== '' ? { min: Number(form.value.min) } : {}), ...(form.value.max !== '' ? { max: Number(form.value.max) } : {}) };
  if (form.value.constraintKind === 'regex') constraint = { kind: 'regex', pattern: form.value.pattern };
  const body: any = {
    apiName: form.value.apiName, displayName: form.value.displayName, baseType: form.value.baseType,
    description: form.value.description || undefined,
    allowedValues: allowedValues.length ? allowedValues : undefined,
    constraint, failureMessage: form.value.failureMessage || undefined, example: form.value.example || undefined,
  };
  try {
    if (editing.value) await valtype.update(editing.value, body);
    else await valtype.create(body);
    ElMessage.success('已保存');
    dialogVisible.value = false;
    await load();
  } catch (e: any) { ElMessage.error(e?.response?.data?.error || e?.message || '保存失败'); }
}

async function remove(v: any) {
  try {
    await ElMessageBox.confirm(`确定删除值类型「${v.displayName}」吗？引用它的属性将失去约束。`, '删除确认', { type: 'warning' });
  } catch { return; }
  await valtype.remove(v.apiName);
  ElMessage.success('已删除');
  await load();
}

function constraintText(v: any): string {
  if (v.allowedValues?.length) return `枚举 ${v.allowedValues.length} 项`;
  if (v.constraint?.kind === 'range') return `范围 ${v.constraint.min ?? '-∞'} ~ ${v.constraint.max ?? '+∞'}`;
  if (v.constraint?.kind === 'regex') return `正则 /${v.constraint.pattern}/`;
  return '—';
}

onMounted(load);
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h2 class="section-title">Value Types</h2>
        <p class="section-sub">{{ list.length }} 个值类型 · 语义类型与约束（枚举/范围/正则）</p>
      </div>
      <ElButton type="primary" @click="openCreate">新建值类型</ElButton>
    </header>

    <ElTable :data="list" v-loading="loading" size="small" border>
      <ElTableColumn prop="apiName" label="API 名称" width="180" />
      <ElTableColumn prop="displayName" label="显示名" width="160" />
      <ElTableColumn prop="baseType" label="基础类型" width="120" />
      <ElTableColumn label="约束" width="200">
        <template #default="{ row }">{{ constraintText(row) }}</template>
      </ElTableColumn>
      <ElTableColumn prop="description" label="说明" show-overflow-tooltip />
      <ElTableColumn label="操作" width="140">
        <template #default="{ row }">
          <ElButton size="small" text @click="openEdit(row)">编辑</ElButton>
          <ElButton size="small" text type="danger" @click="remove(row)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog v-model="dialogVisible" :title="editing ? '编辑值类型' : '新建值类型'" width="560px">
      <ElForm label-position="top">
        <ElFormItem label="API 名称"><ElInput v-model="form.apiName" :disabled="!!editing" placeholder="如 AlertLevel" /></ElFormItem>
        <ElFormItem label="显示名"><ElInput v-model="form.displayName" placeholder="如 告警级别" /></ElFormItem>
        <ElFormItem label="基础类型">
          <ElSelect v-model="form.baseType" style="width: 100%">
            <ElOption v-for="t in ['string','integer','float','boolean','date','timestamp']" :key="t" :label="t" :value="t" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="说明"><ElInput v-model="form.description" type="textarea" :rows="2" /></ElFormItem>
        <ElFormItem label="枚举取值（每行 value|label|说明；留空则不用枚举）">
          <ElInput v-model="allowedText" type="textarea" :rows="4" placeholder="high|高风险|需要立即处理&#10;low|低风险|仅观察" />
        </ElFormItem>
        <ElFormItem label="其他约束">
          <ElSelect v-model="form.constraintKind" clearable style="width: 160px">
            <ElOption label="范围" value="range" />
            <ElOption label="正则" value="regex" />
          </ElSelect>
        </ElFormItem>
        <div v-if="form.constraintKind === 'range'" class="row">
          <ElInput v-model="form.min" placeholder="最小值" />
          <ElInput v-model="form.max" placeholder="最大值" />
        </div>
        <ElFormItem v-if="form.constraintKind === 'regex'" label="正则"><ElInput v-model="form.pattern" placeholder="如 ^[a-z]+$" /></ElFormItem>
        <ElFormItem label="校验失败提示"><ElInput v-model="form.failureMessage" /></ElFormItem>
        <ElFormItem label="示例值"><ElInput v-model="form.example" /></ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="save">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: var(--space-4); }
.page__head { display: flex; align-items: flex-end; justify-content: space-between; }
.section-title { font-size: 18px; margin: 0; }
.section-sub { font-size: 12px; color: var(--text-muted); margin: 4px 0 0; }
.row { display: flex; gap: 8px; margin-bottom: 12px; }
</style>
