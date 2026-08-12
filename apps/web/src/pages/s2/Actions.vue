<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import {
  ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem,
  ElInput, ElSelect, ElOption,
} from 'element-plus';
import { Plus, Operation, VideoPlay } from '@element-plus/icons-vue';
import { s2actions, s2functions } from '@/api';
import type { ActionType, ActionParameter, ActionEffect, OntologyFunction } from '@/api';
import { tryRequest } from '@/utils/error';

const list = ref<ActionType[]>([]);
const functions = ref<OntologyFunction[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const saving = ref(false);
const editing = ref<string | null>(null);

const form = reactive<ActionType>({
  apiName: '', displayName: '', kind: 'object',
  parameters: [], effect: { kind: 'function' }, version: 1,
});

async function load() {
  loading.value = true;
  await tryRequest(async () => {
    const [acts, fns] = await Promise.all([s2actions.list(), s2functions.list()]);
    list.value = acts;
    functions.value = fns;
  });
  loading.value = false;
}

function openCreate() {
  editing.value = null;
  Object.assign(form, {
    apiName: '', displayName: '', kind: 'object',
    parameters: [], effect: { kind: 'function' as const }, version: 1,
  });
  dialogVisible.value = true;
}

function openEdit(a: ActionType) {
  editing.value = a.apiName;
  Object.assign(form, {
    apiName: a.apiName, displayName: a.displayName, kind: a.kind,
    parameters: a.parameters ?? [], effect: a.effect ?? { kind: 'function' }, version: a.version,
  });
  dialogVisible.value = true;
}

function addParam() { form.parameters!.push({ name: '', type: 'string', required: false }); }
function removeParam(i: number) { form.parameters!.splice(i, 1); }

async function save() {
  if (!form.apiName || !form.displayName) { ElMessage.warning('apiName 与 displayName 必填'); return; }
  if (form.effect.kind === 'function' && !form.effect.ref) { ElMessage.warning('function 类型动作需选择函数'); return; }
  saving.value = true;
  await tryRequest(async () => {
    if (editing.value) {
      await s2actions.update(editing.value, {
        displayName: form.displayName, parameters: form.parameters, effect: form.effect,
      });
      ElMessage.success('已更新');
    } else {
      await s2actions.create({ ...form });
      ElMessage.success('已创建');
    }
    dialogVisible.value = false;
    await load();
  });
  saving.value = false;
}

const triggerVisible = ref(false);
const triggerAction = ref<ActionType | null>(null);
const triggerArgs = ref('{}');

function openTrigger(a: ActionType) {
  triggerAction.value = a;
  triggerArgs.value = '{}';
  triggerVisible.value = true;
}
async function runTrigger() {
  if (!triggerAction.value) return;
  let args: Record<string, unknown> = {};
  try { args = JSON.parse(triggerArgs.value || '{}'); } catch { ElMessage.error('参数必须是合法 JSON'); return; }
  await tryRequest(async () => {
    const r = await s2actions.trigger(triggerAction.value!.apiName, args);
    ElMessage.success(`执行成功：${JSON.stringify(r.result)}`);
    triggerVisible.value = false;
  });
}

async function remove(a: ActionType) {
  await tryRequest(async () => {
    await s2actions.remove(a.apiName);
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
        <h2><ElIcon><Operation /></ElIcon> 动作 Actions</h2>
        <ElButton type="primary" :icon="Plus" @click="openCreate">新建动作</ElButton>
      </div>
      <ElTable :data="list" v-loading="loading" stripe>
        <ElTableColumn prop="displayName" label="显示名" />
        <ElTableColumn prop="apiName" label="API 名称" />
        <ElTableColumn label="执行体" width="200">
          <template #default="{ row }">
            <ElTag v-if="row.effect?.kind==='function'" type="success">函数：{{ row.effect.ref }}</ElTag>
            <ElTag v-else type="info">{{ row.effect?.kind }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" type="primary" :icon="VideoPlay" @click="openTrigger(row)">触发</ElButton>
            <ElButton size="small" @click="openEdit(row)">编辑</ElButton>
            <ElButton size="small" type="danger" circle @click="remove(row)" />
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <ElDialog v-model="dialogVisible" :title="editing ? '编辑动作' : '新建动作'" width="720px" top="5vh">
      <ElForm label-width="110px">
        <ElFormItem label="显示名" required><ElInput v-model="form.displayName" /></ElFormItem>
        <ElFormItem label="API 名称" required>
          <ElInput v-model="form.apiName" :disabled="!!editing" />
        </ElFormItem>
        <ElFormItem label="执行体类型">
          <ElSelect v-model="form.effect.kind" style="width:200px">
            <ElOption label="函数(function)" value="function" />
            <ElOption label="对象(object)" value="object" disabled />
            <ElOption label="无(none)" value="none" disabled />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="form.effect.kind==='function'" label="引用函数">
          <ElSelect v-model="form.effect.ref" style="width:320px" placeholder="选择已注册函数">
            <ElOption v-for="fn in functions" :key="fn.apiName" :label="`${fn.displayName} (${fn.apiName})`" :value="fn.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="参数">
          <div class="io-list">
            <div v-for="(p, i) in form.parameters" :key="i" class="io-row">
              <ElInput v-model="p.name" placeholder="参数名" style="width:160px" />
              <ElSelect v-model="p.type" style="width:120px">
                <ElOption label="string" value="string" />
                <ElOption label="number" value="number" />
                <ElOption label="boolean" value="boolean" />
              </ElSelect>
              <ElButton size="small" type="danger" circle @click="removeParam(i)">-</ElButton>
            </div>
            <ElButton size="small" @click="addParam">+ 添加参数</ElButton>
          </div>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="saving" @click="save">保存</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="triggerVisible" title="触发动作" width="520px" top="8vh">
      <div v-if="triggerAction">
        <p>动作：<b>{{ triggerAction.displayName }}</b>（{{ triggerAction.apiName }}）</p>
        <p>执行函数：<ElTag type="success">{{ triggerAction.effect?.ref }}</ElTag></p>
        <ElFormItem label="参数(JSON)">
          <ElInput v-model="triggerArgs" type="textarea" :rows="6" style="font-family:monospace" placeholder='{"objectType":"Employee","objectRid":"E0001"}' />
        </ElFormItem>
      </div>
      <template #footer>
        <ElButton @click="triggerVisible = false">取消</ElButton>
        <ElButton type="primary" @click="runTrigger">执行</ElButton>
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
