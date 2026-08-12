<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption,
} from 'element-plus';
import { Plus, Cpu, Delete } from '@element-plus/icons-vue';
import { s2functions } from '@/api';
import type { OntologyFunction, FunctionInput, FunctionLanguage } from '@/api';
import { tryRequest } from '@/utils/error';

const list = ref<OntologyFunction[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const saving = ref(false);
const editing = ref<string | null>(null); // apiName 或 null(新建)

const form = reactive<OntologyFunction>({
  apiName: '', displayName: '', language: 'typescript', entry: 'main',
  inputs: [], outputs: [], body: '', version: 1,
});

const BODY_TEMPLATE = `// 函数体约定：返回 (args, ctx) => { ... }
//   args: 调用方传入的参数字典
//   ctx:  运行时注入的本体访问上下文，含 ctx.repo / ctx.objects(type) / ctx.links(linkType)
// 例：统计某类型实例数量
return async (args, ctx) => {
  const items = await ctx.objects(args.objectType);
  return items.length;
};`;

async function load() {
  loading.value = true;
  await tryRequest(async () => { list.value = await s2functions.list(); });
  loading.value = false;
}

function openCreate() {
  editing.value = null;
  Object.assign(form, {
    apiName: '', displayName: '', language: 'typescript', entry: 'main',
    inputs: [], outputs: [], body: BODY_TEMPLATE, version: 1,
  });
  dialogVisible.value = true;
}

function openEdit(fn: OntologyFunction) {
  editing.value = fn.apiName;
  Object.assign(form, {
    apiName: fn.apiName, displayName: fn.displayName, language: fn.language,
    entry: fn.entry, inputs: fn.inputs ?? [], outputs: fn.outputs ?? [],
    body: fn.body ?? '', version: fn.version,
  });
  dialogVisible.value = true;
}

function addInput() { form.inputs.push({ name: '', type: 'string', required: false }); }
function removeInput(i: number) { form.inputs.splice(i, 1); }

function addOutput() { form.outputs.push(''); }
function removeOutput(i: number) { form.outputs.splice(i, 1); }

async function save() {
  if (!form.apiName || !form.displayName) { ElMessage.warning('apiName 与 displayName 必填'); return; }
  saving.value = true;
  await tryRequest(async () => {
    if (editing.value) {
      await s2functions.update(editing.value, {
        displayName: form.displayName, language: form.language, entry: form.entry,
        inputs: form.inputs, outputs: form.outputs, body: form.body,
      });
      ElMessage.success('已更新');
    } else {
      await s2functions.create({ ...form });
      ElMessage.success('已创建');
    }
    dialogVisible.value = false;
    await load();
  });
  saving.value = false;
}

async function remove(fn: OntologyFunction) {
  await tryRequest(async () => {
    await s2functions.remove(fn.apiName);
    ElMessage.success('已删除');
    await load();
  });
}

onMounted(load);
</script>

<template>
  <div class="page">
    <ElCard>
      <div class="toolbar">
        <h2><ElIcon><Cpu /></ElIcon> 函数 Functions</h2>
        <ElButton type="primary" :icon="Plus" @click="openCreate">新建函数</ElButton>
      </div>
      <ElTable :data="list" v-loading="loading" stripe>
        <ElTableColumn prop="displayName" label="显示名" />
        <ElTableColumn prop="apiName" label="API 名称" />
        <ElTableColumn prop="language" label="语言" width="120">
          <template #default="{ row }"><ElTag size="small">{{ row.language }}</ElTag></template>
        </ElTableColumn>
        <ElTableColumn prop="entry" label="入口" width="120" />
        <ElTableColumn label="入参" min-width="160">
          <template #default="{ row }">
            <ElTag v-for="i in row.inputs" :key="i.name" size="small" type="info" style="margin-right:4px">{{ i.name }}:{{ i.type }}</ElTag>
            <span v-if="!row.inputs?.length">—</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="可编辑" width="90">
          <template #default="{ row }">
            <ElTag v-if="row.body" size="small" type="success">是</ElTag>
            <ElTag v-else size="small" type="warning">注入式</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" @click="openEdit(row)">编辑</ElButton>
            <ElButton size="small" type="danger" :icon="Delete" circle @click="remove(row)" />
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <ElDialog v-model="dialogVisible" :title="editing ? '编辑函数' : '新建函数'" width="820px" top="4vh" class="edit-fn-dialog">
      <ElForm label-width="110px">
        <ElFormItem label="显示名" required><ElInput v-model="form.displayName" /></ElFormItem>
        <ElFormItem label="API 名称" required>
          <ElInput v-model="form.apiName" :disabled="!!editing" placeholder="如 evaluateDimissionRisk" />
        </ElFormItem>
        <ElFormItem label="语言">
          <ElSelect v-model="form.language" style="width:200px">
            <ElOption label="TypeScript" value="typescript" />
            <ElOption label="Python（暂不支持运行）" value="python" disabled />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="入口"><ElInput v-model="form.entry" placeholder="main" /></ElFormItem>

        <ElFormItem label="入参">
          <div class="io-list">
            <div v-for="(inp, i) in form.inputs" :key="i" class="io-row">
              <ElInput v-model="inp.name" placeholder="参数名" style="width:160px" />
              <ElSelect v-model="inp.type" style="width:140px">
                <ElOption label="string" value="string" />
                <ElOption label="number" value="number" />
                <ElOption label="boolean" value="boolean" />
                <ElOption label="object" value="object" />
              </ElSelect>
              <ElButton size="small" type="danger" circle @click="removeInput(i)">-</ElButton>
            </div>
            <ElButton size="small" @click="addInput">+ 添加入参</ElButton>
          </div>
        </ElFormItem>

        <ElFormItem label="出参类型">
          <div class="io-list">
            <div v-for="(o, i) in form.outputs" :key="i" class="io-row">
              <ElSelect v-model="form.outputs[i]" style="width:160px">
                <ElOption label="string" value="string" />
                <ElOption label="number" value="number" />
                <ElOption label="boolean" value="boolean" />
                <ElOption label="object" value="object" />
                <ElOption label="array" value="array" />
              </ElSelect>
              <ElButton size="small" type="danger" circle @click="removeOutput(i)">-</ElButton>
            </div>
            <ElButton size="small" @click="addOutput">+ 添加出参</ElButton>
          </div>
        </ElFormItem>

        <ElFormItem label="函数体">
          <ElInput v-model="form.body" type="textarea" :rows="14" spellcheck="false"
            placeholder="返回 (args, ctx) => { ... }" style="font-family:monospace" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="saving" @click="save">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page { padding: 16px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.toolbar h2 { display: flex; align-items: center; gap: 6px; margin: 0; }
.io-list { display: flex; flex-direction: column; gap: 8px; }
.io-row { display: flex; gap: 8px; align-items: center; }
</style>
