<template>
  <div class="agent-mgmt">
    <div class="mgmt-head">
      <span class="sidebar-title">智能体管理</span>
      <el-button size="small" type="primary" plain @click="openNewAgent">+ 新建智能体</el-button>
    </div>

    <ul class="agent-list">
      <li
        v-for="a in agents"
        :key="a.id"
        :class="['agent-item', { active: a.id === currentConfig?.id }]"
        @click="openConfig(a)"
      >
        <div class="agent-name">{{ a.displayName }}</div>
        <div class="agent-id">{{ a.id }}</div>
        <div class="agent-tools muted small">
          能力：{{ (a.enabledTools ?? []).join(' / ') || '无' }}
        </div>
        <el-button
          size="small"
          text
          class="agent-del"
          @click.stop="confirmDelete(a)"
          title="删除"
        >🗑</el-button>
      </li>
    </ul>

    <!-- 智能体新建/配置 Dialog -->
    <el-dialog v-model="configVisible" :title="configIsNew ? '新建智能体' : '配置：' + currentConfig?.displayName" width="720px">
      <el-form label-width="110px">
        <el-form-item label="Agent ID">
          <el-input v-model="form.id" :disabled="!configIsNew" placeholder="英文/数字/_/-，如 hr_expert" />
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="form.displayName" />
        </el-form-item>
        <el-form-item label="人设提示词">
          <el-input v-model="form.systemPrompt" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="默认模型">
          <el-select v-model="form.defaultModelId" filterable placeholder="选择模型" @visible-change="(v:boolean)=>v&&loadModels()">
            <el-option v-for="m in models" :key="m.id" :label="m.displayName" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="温度">
          <el-slider v-model="form.temperature" :min="0" :max="1" :step="0.1" style="width: 300px" />
        </el-form-item>
        <el-form-item label="启用能力">
          <el-checkbox-group v-model="form.enabledTools">
            <el-checkbox value="functions">函数</el-checkbox>
            <el-checkbox value="actions">动作</el-checkbox>
            <el-checkbox value="rules">规则</el-checkbox>
            <el-checkbox value="explore">探索</el-checkbox>
            <el-checkbox value="alerts">告警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="可访问对象类型">
          <el-select
            v-model="form.objectTypes"
            multiple
            filterable
            collapse-tags
            placeholder="空 = 可访问全部对象类型"
            style="width: 100%"
            @visible-change="(v:boolean)=>v&&loadObjectTypes()"
          >
            <el-option v-for="ot in allObjectTypes" :key="ot.apiName" :label="ot.displayName + '（' + ot.apiName + '）'" :value="ot.apiName" />
          </el-select>
          <div class="muted small">仅勾选的对象类型可被该智能体列示与查询；留空表示不限制。</div>
        </el-form-item>
        <el-form-item label="最大步数">
          <el-input-number v-model="form.maxSteps" :min="1" :max="20" />
          <div class="muted small">智能体一次回答中最多可连续调用工具（查数据/算函数/触动作）的轮次；达到上限会强制总结。默认 6 轮，复杂任务可上调。</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { aip as api, AIPAgentConfigDTO } from '../api';
import { s2 } from '../api';
import type { ObjectType } from '../api';

const CONFIG_ID = 'default';
const agents = ref<AIPAgentConfigDTO[]>([]);
const currentConfig = ref<AIPAgentConfigDTO | null>(null);
const allObjectTypes = ref<ObjectType[]>([]);
const models = ref<{ id: string; displayName: string }[]>([]);

const configVisible = ref(false);
const configIsNew = ref(false);
const form = ref<Partial<AIPAgentConfigDTO>>({});

async function loadAgents() {
  agents.value = await api.listAgents();
  // 自动选中第一个作为当前编辑目标（仅用于展示高亮，不影响对话页）
  if (agents.value.length) currentConfig.value = agents.value.find((a) => a.id !== CONFIG_ID) ?? agents.value[0];
  else currentConfig.value = null;
}

async function loadModels() {
  if (models.value.length) return;
  try {
    const ms = await api.listModels();
    models.value = ms.map((m: any) => ({ id: m.id, displayName: m.displayName }));
  } catch {
    models.value = [];
  }
}

async function loadObjectTypes() {
  if (allObjectTypes.value.length) return;
  try {
    allObjectTypes.value = await s2.listObjectTypes();
  } catch {
    allObjectTypes.value = [];
  }
}

async function openNewAgent() {
  configIsNew.value = true;
  await loadModels();
  await loadObjectTypes();
  const scope = models.value.map((m) => m.id);
  form.value = {
    id: '',
    displayName: '新智能体',
    systemPrompt: '你是本 Ontology 平台的智能体，可调用本体函数/动作/规则与探索工具回答用户问题。',
    enabledTools: ['functions', 'actions', 'rules', 'explore', 'alerts'],
    objectTypes: [],
    modelScope: scope,
    defaultModelId: scope[0] ?? '',
    temperature: 0.2,
    maxSteps: 6,
  };
  configVisible.value = true;
}

function openConfig(a: AIPAgentConfigDTO) {
  configIsNew.value = false;
  currentConfig.value = a;
  loadModels();
  loadObjectTypes();
  form.value = { ...a, objectTypes: a.objectTypes ?? [] };
  configVisible.value = true;
}

async function saveConfig() {
  try {
    if (configIsNew.value) {
      if (!form.value.id) return ElMessage.error('Agent ID 必填');
      const cfg = await api.createAgent(form.value);
      ElMessage.success('已新建：' + cfg.displayName);
      await loadAgents();
    } else {
      await api.saveConfig(form.value.id ?? CONFIG_ID, form.value);
      ElMessage.success('已保存');
      await loadAgents();
    }
    configVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.error || e.message || '保存失败');
  }
}

async function confirmDelete(a: AIPAgentConfigDTO) {
  if (a.id === CONFIG_ID) return ElMessage.warning('默认 Agent 不可删除');
  await ElMessageBox.confirm(`确认删除智能体「${a.displayName}」（${a.id}）？`, '删除确认', { type: 'warning' })
    .then(async () => {
      await api.deleteAgent(a.id);
      ElMessage.success('已删除');
      await loadAgents();
    })
    .catch(() => {});
}

onMounted(async () => {
  try {
    await loadAgents();
  } catch {
    agents.value = [];
  }
  try {
    allObjectTypes.value = await s2.listObjectTypes();
  } catch {
    allObjectTypes.value = [];
  }
  try {
    const ms = await api.listModels();
    models.value = ms.map((m: any) => ({ id: m.id, displayName: m.displayName }));
  } catch {
    models.value = [];
  }
});
</script>

<style scoped>
.agent-mgmt { padding: 16px; max-width: 920px; }
.mgmt-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.sidebar-title { font-weight: 600; font-size: 15px; }
.agent-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.agent-item { position: relative; padding: 12px 14px; border-radius: 8px; cursor: pointer; border: 1px solid #ebeef5; background: #fff; transition: border-color .15s; }
.agent-item:hover { border-color: #c0c4cc; }
.agent-item.active { background: #ecf5ff; border-color: #409eff; }
.agent-name { font-weight: 600; }
.agent-id { font-size: 12px; color: #909399; }
.agent-tools { margin-top: 4px; }
.agent-del { position: absolute; top: 8px; right: 8px; }
.muted { color: #909399; }
.small { font-size: 12px; }
</style>
