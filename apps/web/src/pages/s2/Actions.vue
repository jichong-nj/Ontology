<template>
  <div class="page">
    <div class="header">
      <div>
        <h2 class="title">动作类型（Actions）</h2>
        <span class="subtitle">本体动作定义，可被自动化规则引用执行；每个动作可内嵌前置校验规则（Action 自带 rules，对标 Palantir）</span>
      </div>
      <el-button type="primary" @click="openCreate">新建动作</el-button>
    </div>

    <el-table :data="actions" v-loading="loading" border stripe>
      <el-table-column prop="apiName" label="API 名称" width="200" />
      <el-table-column prop="displayName" label="显示名" width="160" />
      <el-table-column label="动作效果" width="160">
        <template #default="{ row }">
          <el-tag size="small" type="info">{{ row.effect?.kind }}</el-tag>
          <span v-if="row.effect?.ref" class="ref">→ {{ row.effect.ref }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" width="200">
        <template #default="{ row }">
          <span v-if="row.parameters?.length">{{ row.parameters.map((p: any) => p.name).join(', ') }}</span>
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="内嵌校验规则（preconditions）" min-width="280">
        <template #default="{ row }">
          <div v-if="row.preconditions?.length" class="precond-list">
            <el-tag
              v-for="(p, i) in row.preconditions"
              :key="i"
              size="small"
              type="warning"
              class="precond-tag"
            >{{ preconditionText(p) }}</el-tag>
          </div>
          <span v-else class="muted">（无，动作无条件执行）</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEditor(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && !actions.length" description="暂无动作类型" />

    <el-dialog v-model="editorVisible" :title="editing?.apiName ? `编辑动作：${editing.apiName}` : '新建动作'" width="720px">
      <el-form v-if="editing" label-width="120px">
        <el-form-item label="API 名称">
          <el-input v-model="editing.apiName" :disabled="!!editing.apiName && isExisting" />
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="editing.displayName" />
        </el-form-item>
        <el-form-item label="动作效果 kind">
          <el-select v-model="editing.effect.kind" style="width: 220px">
            <el-option label="函数 function" value="function" />
            <el-option label="写对象 write" value="write" />
            <el-option label="通知 notify" value="notify" />
            <el-option label="审批 approval" value="approval" />
          </el-select>
        </el-form-item>
        <el-form-item label="效果 ref" v-if="editing.effect.kind === 'function' || editing.effect.kind === 'write'">
          <el-input v-model="editing.effect.ref" :placeholder="editing.effect.kind === 'function' ? '函数 apiName' : '对象类型 apiName'" />
        </el-form-item>

        <el-divider content-position="left">参数定义（触发时按约束校验）</el-divider>
        <div v-for="(p, idx) in (editing?.parameters ?? [])" :key="'param-' + idx" class="param-editor">
          <el-input v-model="p.name" placeholder="参数名" style="width: 130px" />
          <el-select v-model="p.type" style="width: 110px">
            <el-option v-for="t in dataTypes" :key="t" :label="t" :value="t" />
          </el-select>
          <el-switch v-model="p.required" active-text="必填" />
          <el-select v-model="p.valueType" clearable placeholder="值类型（可选）" style="width: 160px">
            <el-option v-for="vt in valueTypes" :key="vt.apiName" :label="vt.displayName" :value="vt.apiName" />
          </el-select>
          <el-input v-model="p.description" placeholder="参数说明" style="width: 150px" />
          <el-button type="danger" size="small" circle @click="removeParameter(idx)">−</el-button>
        </div>
        <el-button size="small" @click="addParameter">+ 添加参数</el-button>

        <el-divider content-position="left">内嵌校验规则（动作执行前逐条校验）</el-divider>
        <div v-for="(p, idx) in (editing?.preconditions ?? [])" :key="idx" class="precond-editor">
          <el-select v-model="p.kind" style="width: 160px">
            <el-option label="属性必填 requiredProperty" value="requiredProperty" />
            <el-option label="最小值 minValue" value="minValue" />
            <el-option label="最大值 maxValue" value="maxValue" />
            <el-option label="非空 notEmpty" value="notEmpty" />
          </el-select>
          <el-input v-model="p.property" placeholder="属性 apiName" style="width: 150px" />
          <el-input-number
            v-if="p.kind === 'minValue' || p.kind === 'maxValue'"
            v-model="p.value"
            :controls="true"
            style="width: 120px"
          />
          <el-input v-model="p.message" placeholder="校验失败提示" style="width: 200px" />
          <el-button type="danger" size="small" circle @click="removePrecondition(idx)">−</el-button>
        </div>
        <el-button size="small" @click="addPrecondition">+ 添加校验规则</el-button>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { s2actions, valtype } from '@/api';
import type { ValueTypeDTO } from '@/api';
import type { ActionType, ActionPrecondition } from '@ontology/ontology-core';

const actions = ref<ActionType[]>([]);
const loading = ref(false);
const editorVisible = ref(false);
const saving = ref(false);
const editing = ref<ActionType | null>(null);
const isExisting = ref(false);
const valueTypes = ref<ValueTypeDTO[]>([]);
const dataTypes = ['string', 'integer', 'float', 'boolean', 'date', 'timestamp'];

function preconditionText(p: ActionPrecondition): string {
  switch (p.kind) {
    case 'requiredProperty':
      return `必填 ${p.property}`;
    case 'minValue':
      return `${p.property} ≥ ${p.value ?? 0}`;
    case 'maxValue':
      return `${p.property} ≤ ${p.value ?? 0}`;
    case 'notEmpty':
      return `${p.property} 非空`;
    default:
      return p.property;
  }
}

function newPrecondition(): ActionPrecondition {
  return { kind: 'requiredProperty', property: '', message: '' };
}

function addParameter() {
  if (!editing.value) return;
  if (!editing.value.parameters) editing.value.parameters = [];
  editing.value.parameters.push({ name: '', type: 'string', required: false });
}

function removeParameter(idx: number) {
  editing.value?.parameters?.splice(idx, 1);
}

function addPrecondition() {
  if (!editing.value) return;
  if (!editing.value.preconditions) editing.value.preconditions = [];
  editing.value.preconditions.push(newPrecondition());
}

function removePrecondition(idx: number) {
  if (!editing.value?.preconditions) return;
  editing.value.preconditions.splice(idx, 1);
}

function openEditor(row: ActionType) {
  // 深拷贝，避免编辑时直接改动列表
  const copy: ActionType = JSON.parse(JSON.stringify(row));
  if (!copy.preconditions) copy.preconditions = [];
  if (!copy.parameters) copy.parameters = [];
  if (!copy.effect) copy.effect = { kind: 'function' };
  editing.value = copy;
  isExisting.value = true;
  editorVisible.value = true;
}

function openCreate() {
  const created: ActionType = {
    apiName: '',
    displayName: '',
    parameters: [],
    preconditions: [],
    effect: { kind: 'function' },
    version: 1,
  };
  editing.value = created;
  isExisting.value = false;
  editorVisible.value = true;
}

async function save() {
  if (!editing.value) return;
  if (!editing.value.apiName || !editing.value.displayName) {
    ElMessage.warning('API 名称与显示名必填');
    return;
  }
  saving.value = true;
  try {
    if (isExisting.value) {
      const { apiName, ...patch } = editing.value;
      await s2actions.update(apiName!, patch);
    } else {
      await s2actions.create(editing.value);
    }
    ElMessage.success('已保存动作');
    editorVisible.value = false;
    await load();
  } catch (e: any) {
    ElMessage.error(`保存失败: ${e?.message ?? e}`);
  } finally {
    saving.value = false;
  }
}

async function remove(row: ActionType) {
  try {
    await ElMessageBox.confirm(`确认删除动作「${row.displayName}」？该操作不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    });
  } catch {
    return; // 用户取消
  }
  try {
    await s2actions.remove(row.apiName);
    ElMessage.success('已删除');
    await load();
  } catch (e: any) {
    ElMessage.error(`删除失败: ${e?.message ?? e}`);
  }
}

async function load() {
  loading.value = true;
  try {
    actions.value = await s2actions.list();
  } catch (e: any) {
    ElMessage.error(`加载失败: ${e?.message ?? e}`);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await load();
  try { valueTypes.value = await valtype.list(); } catch { valueTypes.value = []; }
});
</script>

<style scoped>
.page { padding: 16px; }
.header { margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.title { margin: 0 0 4px; font-size: 20px; }
.subtitle { color: #888; font-size: 13px; }
.ref { color: #409eff; margin-left: 4px; }
.precond-list { display: flex; flex-wrap: wrap; gap: 4px; }
.precond-tag { margin: 0; }
.muted { color: #aaa; font-size: 12px; }
.param-editor { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
.precond-editor { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
</style>
