<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import {
  ElCard, ElButton, ElIcon, ElMessage, ElDialog, ElForm, ElFormItem, ElInput,
  ElCheckboxGroup, ElCheckbox, ElTag, ElSwitch, ElTable, ElTableColumn, ElSelect, ElOption,
} from 'element-plus';
import { Plus, Refresh, Cpu } from '@element-plus/icons-vue';
import {
  aip, type AIPProviderDTO, type AIPModelDTO, type ProbeModelDTO,
} from '@/api';
import { tryRequest } from '@/utils/error';

const providers = ref<AIPProviderDTO[]>([]);
const models = ref<AIPModelDTO[]>([]);
const loading = ref(false);

// ---- Provider 弹窗（新建 / 编辑共用） ----
const dialogVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingId = ref('');
const probeLoading = ref(false);
const probeResult = ref<ProbeModelDTO[]>([]);
const probeError = ref('');
const selectedProbeModels = ref<string[]>([]);
const adding = ref(false);

const form = reactive({
  id: '',
  name: '',
  baseUrl: '',
  apiKey: '',
  isDefault: false,
});

async function loadAll() {
  loading.value = true;
  await Promise.all([
    tryRequest(async () => { providers.value = await aip.listProviders(); }),
    tryRequest(async () => { models.value = await aip.listModels(); }),
  ]);
  loading.value = false;
}

function openCreate() {
  dialogMode.value = 'create';
  editingId.value = '';
  Object.assign(form, { id: '', name: '', baseUrl: '', apiKey: '', isDefault: false });
  probeResult.value = [];
  probeError.value = '';
  selectedProbeModels.value = [];
  dialogVisible.value = true;
}

function openEdit(p: AIPProviderDTO) {
  dialogMode.value = 'edit';
  editingId.value = p.id;
  Object.assign(form, {
    id: p.id,
    name: p.name,
    baseUrl: p.baseUrl,
    apiKey: p.apiKey,
    isDefault: !!p.isDefault,
  });
  probeResult.value = [];
  probeError.value = '';
  selectedProbeModels.value = [];
  dialogVisible.value = true;
}

async function probe() {
  probeLoading.value = true;
  probeError.value = '';
  probeResult.value = [];
  selectedProbeModels.value = [];
  await tryRequest(async () => {
    const r = await aip.probeProvider(form.baseUrl, form.apiKey);
    if (!r.ok) { probeError.value = r.error || '探测失败'; return; }
    probeResult.value = r.models;
  });
  probeLoading.value = false;
}

async function saveProvider() {
  if (!form.id || !form.name) { ElMessage.warning('请填写 Provider ID 与名称'); return; }
  adding.value = true;
  await tryRequest(async () => {
    if (dialogMode.value === 'create') {
      await aip.createProvider({
        id: form.id,
        name: form.name,
        baseUrl: form.baseUrl,
        apiKey: form.apiKey,
        protocol: 'openai-compatible',
        isDefault: form.isDefault,
      });
      for (const apiName of selectedProbeModels.value) {
        const probe = probeResult.value.find((m) => m.id === apiName);
        await aip.createModel({
          id: `${form.id}__${apiName}`,
          providerId: form.id,
          apiName,
          displayName: apiName,
          isReasoning: probe?.isReasoning ?? false,
          maxTokens: probe?.isReasoning ? 4096 : 2048,
        });
      }
      ElMessage.success('Provider 已创建，所选模型已加入');
    } else {
      await aip.updateProvider(editingId.value, {
        name: form.name,
        baseUrl: form.baseUrl,
        apiKey: form.apiKey,
        isDefault: form.isDefault,
      });
      ElMessage.success('Provider 已更新');
    }
    dialogVisible.value = false;
    await loadAll();
  });
  adding.value = false;
}

async function removeProvider(id: string) {
  await tryRequest(async () => {
    await aip.deleteProvider(id);
    ElMessage.success('已删除');
    await loadAll();
  });
}

// ---- 模型管理弹窗 ----
const modelDialogVisible = ref(false);
const modelDialogProviderId = ref('');
const modelDialogProviderName = ref('');
const editableModels = ref<AIPModelDTO[]>([]);
const savingModels = ref(false);

function openModels(p: AIPProviderDTO) {
  modelDialogProviderId.value = p.id;
  modelDialogProviderName.value = p.name;
  editableModels.value = models.value
    .filter((m) => m.providerId === p.id)
    .map((m) => ({ ...m }));
  modelDialogVisible.value = true;
}

async function saveModels() {
  savingModels.value = true;
  await tryRequest(async () => {
    for (const m of editableModels.value) {
      await aip.updateModel(m.id, {
        displayName: m.displayName,
        isReasoning: !!m.isReasoning,
        maxTokens: m.maxTokens ?? undefined,
        contextWindow: m.contextWindow ?? undefined,
      });
    }
    ElMessage.success('模型参数已保存');
    modelDialogVisible.value = false;
    await loadAll();
  });
  savingModels.value = false;
}

onMounted(loadAll);
</script>

<template>
  <div class="providers">
    <header class="page-head">
      <div>
        <h2 class="page-title"><ElIcon><Cpu /></ElIcon> Model Providers</h2>
        <p class="page-sub">配置模型供应商接入点，并探测加入其下的模型</p>
      </div>
      <div class="page-actions">
        <ElButton :loading="loading" @click="loadAll"><ElIcon><Refresh /></ElIcon> 刷新</ElButton>
        <ElButton type="primary" @click="openCreate"><ElIcon><Plus /></ElIcon> 新建 Provider</ElButton>
      </div>
    </header>

    <div class="cards">
      <ElCard v-for="p in providers" :key="p.id" class="prov-card" shadow="hover">
        <div class="prov-head">
          <div>
            <div class="prov-name">{{ p.name }} <ElTag v-if="p.isDefault" size="small" type="success">默认</ElTag></div>
            <div class="prov-meta">{{ p.id }}</div>
            <div class="prov-url">{{ p.baseUrl }}</div>
          </div>
          <div class="prov-actions">
            <ElButton size="small" plain @click="openEdit(p)">编辑</ElButton>
            <ElButton size="small" type="danger" plain @click="removeProvider(p.id)">删除</ElButton>
          </div>
        </div>
        <ElDivider style="margin:10px 0" />
        <div class="prov-models-line">
          <span class="prov-models-count" @click="openModels(p)" title="点击管理模型参数">
            模型（{{ models.filter(m => m.providerId === p.id).length }}）
          </span>
          <ElButton v-if="models.some(m => m.providerId === p.id)" size="small" link type="primary" @click="openModels(p)">管理</ElButton>
        </div>
      </ElCard>

      <div v-if="!providers.length" class="empty">
        还没有 Provider，点击右上角「新建 Provider」并探测模型。
      </div>
    </div>

    <ElDialog v-model="dialogVisible" :title="dialogMode === 'edit' ? '编辑 Provider' : '新建 Provider 并加入模型'" width="640px">
      <ElForm label-width="120px">
        <ElFormItem label="Provider ID">
          <ElInput v-model="form.id" placeholder="如 local-lmstudio" :disabled="dialogMode === 'edit'" />
        </ElFormItem>
        <ElFormItem label="名称">
          <ElInput v-model="form.name" placeholder="如 本地 LM Studio" />
        </ElFormItem>
        <ElFormItem label="Base URL">
          <ElInput v-model="form.baseUrl" placeholder="如 http://localhost:1234/v1" />
        </ElFormItem>
        <ElFormItem label="API Key">
          <ElInput v-model="form.apiKey" placeholder="本地模型可留空" />
        </ElFormItem>
        <ElFormItem label="设为默认">
          <ElSwitch v-model="form.isDefault" />
        </ElFormItem>
        <ElFormItem>
          <ElButton :loading="probeLoading" @click="probe">🔍 探测模型</ElButton>
        </ElFormItem>
        <ElFormItem v-if="probeError" label=" ">
          <span class="err">探测失败：{{ probeError }}</span>
        </ElFormItem>
        <ElFormItem v-if="probeResult.length" label="选择模型">
          <div class="probe-list">
            <ElCheckboxGroup v-model="selectedProbeModels">
              <div v-for="m in probeResult" :key="m.id" class="probe-item">
                <ElCheckbox :value="m.id">{{ m.id }}</ElCheckbox>
                <ElTag v-if="m.isReasoning" size="small" type="warning">推理</ElTag>
              </div>
            </ElCheckboxGroup>
          </div>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="adding" @click="saveProvider">
          {{ dialogMode === 'edit' ? '保存' : '保存并加入所选模型' }}
        </ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="modelDialogVisible" :title="`模型管理 · ${modelDialogProviderName}`" width="720px">
      <div v-if="editableModels.length" class="model-edit-list">
        <div v-for="m in editableModels" :key="m.id" class="model-edit-row">
          <div class="model-edit-head">
            <span class="model-api">{{ m.apiName }}</span>
            <ElSwitch v-model="m.isReasoning" size="small" inline-prompt active-text="推理" inactive-text="普通" />
          </div>
          <ElForm label-width="110px" class="model-edit-form">
            <ElFormItem label="显示名">
              <ElInput v-model="m.displayName" size="small" />
            </ElFormItem>
            <ElFormItem label="Max Tokens">
              <ElInput v-model.number="m.maxTokens" size="small" type="number" placeholder="如 4096" />
            </ElFormItem>
            <ElFormItem label="Context Window">
              <ElInput v-model.number="m.contextWindow" size="small" type="number" placeholder="如 32768" />
            </ElFormItem>
          </ElForm>
        </div>
      </div>
      <div v-else class="empty">该 Provider 下暂无模型</div>
      <template #footer>
        <ElButton @click="modelDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="savingModels" @click="saveModels">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.providers { display: flex; flex-direction: column; height: 100%; }
.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-4); flex-shrink: 0; }
.page-title { display: flex; align-items: center; gap: var(--space-2); font-size: 1.4rem; margin: 0; }
.page-sub { color: var(--text-muted); margin: 4px 0 0; font-size: 0.9rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-4); }
.prov-card { min-width: 0; }
.prov-head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-2); }
.prov-actions { display: flex; gap: 6px; flex-shrink: 0; }
.prov-name { font-weight: 600; font-size: 1rem; display: flex; align-items: center; gap: 6px; }
.prov-meta { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.prov-url { font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; word-break: break-all; }
.prov-models-line { display: flex; align-items: center; gap: 8px; }
.prov-models-count { font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
.prov-models-count:hover { color: var(--el-color-primary); text-decoration: underline dotted; }
.model-list { display: flex; flex-direction: column; gap: 4px; max-width: 260px; }
.model-edit-list { display: flex; flex-direction: column; gap: 12px; max-height: 60vh; overflow: auto; }
.model-edit-row { border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }
.model-edit-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.model-api { font-weight: 600; font-size: 0.9rem; color: var(--text-secondary); word-break: break-all; }
.model-edit-form { margin-bottom: 0; }
.model-item { font-size: 0.85rem; line-height: 1.6; }
.empty { color: var(--text-muted); padding: 40px; text-align: center; }
.err { color: var(--el-color-danger); font-size: 0.85rem; }
.probe-list { max-height: 220px; overflow: auto; border: 1px solid var(--border); border-radius: 8px; padding: 8px; width: 100%; }
.probe-item { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
</style>
