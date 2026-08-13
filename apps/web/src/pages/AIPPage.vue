<script setup lang="ts">
import { onMounted, ref, reactive, computed, nextTick } from 'vue';
import { ElCard, ElButton, ElIcon, ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSwitch, ElSelect, ElOption, ElCheckboxGroup, ElCheckbox, ElTag } from 'element-plus';
import { Refresh, ChatDotRound, Setting, Cpu } from '@element-plus/icons-vue';
import { aip, type AIPAgentConfigDTO } from '@/api';
import { tryRequest } from '@/utils/error';

const CONFIG_ID = 'default';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  steps?: { tool: string; args: unknown; result: unknown }[];
}

const messages = ref<ChatMsg[]>([]);
const input = ref('');
const sending = ref(false);
const cfg = ref<AIPAgentConfigDTO | null>(null);
const cfgLoading = ref(false);
const cfgSaving = ref(false);
const dialogVisible = ref(false);

const TOOL_OPTIONS = [
  { value: 'functions', label: '函数（执行 Ontology 函数）' },
  { value: 'actions', label: '动作（触发 Action）' },
  { value: 'rules', label: '规则（运行自动化规则）' },
  { value: 'explore', label: '探索（查询实例/关系/聚合）' },
  { value: 'alerts', label: '告警（查看 Alert 实例）' },
];

// 编辑表单（与已存配置双向绑定）
const form = reactive({
  displayName: 'Ontology Agent',
  systemPrompt: '',
  model: 'local-model',
  baseUrl: 'http://localhost:1234/v1',
  apiKey: '',
  temperature: 0.2,
  enabledTools: ['functions', 'actions', 'rules', 'explore', 'alerts'],
  maxSteps: 6,
});

const chatBox = ref<HTMLElement | null>(null);
const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

async function loadConfig() {
  cfgLoading.value = true;
  await tryRequest(async () => {
    const c = await aip.getConfig(CONFIG_ID);
    cfg.value = c;
    if (c) Object.assign(form, {
      displayName: c.displayName,
      systemPrompt: c.systemPrompt,
      model: c.model,
      baseUrl: c.baseUrl,
      apiKey: c.apiKey,
      temperature: c.temperature,
      enabledTools: c.enabledTools,
      maxSteps: c.maxSteps,
    });
  });
  cfgLoading.value = false;
}

function openConfig() {
  if (cfg.value) Object.assign(form, {
    displayName: cfg.value.displayName,
    systemPrompt: cfg.value.systemPrompt,
    model: cfg.value.model,
    baseUrl: cfg.value.baseUrl,
    apiKey: cfg.value.apiKey,
    temperature: cfg.value.temperature,
    enabledTools: cfg.value.enabledTools,
    maxSteps: cfg.value.maxSteps,
  });
  else Object.assign(form, {
    displayName: 'Ontology Agent',
    systemPrompt: '',
    model: 'local-model',
    baseUrl: 'http://localhost:1234/v1',
    apiKey: '',
    temperature: 0.2,
    enabledTools: ['functions', 'actions', 'rules', 'explore', 'alerts'],
    maxSteps: 6,
  });
  dialogVisible.value = true;
}

async function saveConfig() {
  cfgSaving.value = true;
  await tryRequest(async () => {
    const saved = await aip.saveConfig(CONFIG_ID, {
      displayName: form.displayName,
      systemPrompt: form.systemPrompt,
      model: form.model,
      baseUrl: form.baseUrl,
      apiKey: form.apiKey,
      temperature: form.temperature,
      enabledTools: form.enabledTools,
      maxSteps: form.maxSteps,
    });
    cfg.value = saved;
    ElMessage.success('Agent 配置已保存');
    dialogVisible.value = false;
  });
  cfgSaving.value = false;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;
  messages.value.push({ role: 'user', content: text });
  input.value = '';
  await scrollToBottom();

  sending.value = true;
  await tryRequest(async () => {
    const res = await aip.run(CONFIG_ID, text, []);
    if (res?.error) {
      messages.value.push({ role: 'assistant', content: `⚠️ ${res.error}` });
      return;
    }
    messages.value.push({
      role: 'assistant',
      content: res?.reply ?? '(无回复)',
      steps: res?.steps ?? [],
    });
  });
  sending.value = false;
  await scrollToBottom();
}

function quickAsk(t: string) {
  input.value = t;
  send();
}

const quickPrompts = [
  '现在哪些员工离职风险较高？', '列出所有对象类型', '统计各部门人数', '运行一次全部规则', '查看当前告警',
];

const enabledToolLabels = computed(() =>
  (cfg.value?.enabledTools ?? []).map((t) => TOOL_OPTIONS.find((o) => o.value === t)?.label ?? t),
);

onMounted(loadConfig);
</script>

<template>
  <div class="aip">
    <header class="page-head">
      <div>
        <h2 class="page-title"><ElIcon><Cpu /></ElIcon> AIP · 统一智能体</h2>
        <p class="page-sub">
          一个 Agent 通过工具调用承载本体的全部能力
          <template v-if="cfg">
            （已启用：<ElTag v-for="l in enabledToolLabels" :key="l" size="small" style="margin-left:4px">{{ l }}</ElTag>）
          </template>
        </p>
      </div>
      <div class="page-actions">
        <ElButton :loading="cfgLoading" @click="loadConfig"><ElIcon><Refresh /></ElIcon> 刷新配置</ElButton>
        <ElButton type="primary" @click="openConfig"><ElIcon><Setting /></ElIcon> 配置 Agent</ElButton>
      </div>
    </header>

    <ElCard class="chat-card" shadow="never">
      <div ref="chatBox" class="chat-box">
        <div v-if="messages.length === 0" class="chat-empty">
          <p>👋 我是 Ontology 智能体，可以帮你查询数据、评估风险、运行规则。</p>
          <div class="quick">
            <ElButton v-for="q in quickPrompts" :key="q" size="small" @click="quickAsk(q)">{{ q }}</ElButton>
          </div>
        </div>

        <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
          <div class="msg-role">{{ m.role === 'user' ? '你' : 'Agent' }}</div>
          <div class="msg-content">
            <p>{{ m.content }}</p>
            <div v-if="m.steps && m.steps.length" class="steps">
              <div v-for="(s, j) in m.steps" :key="j" class="step">
                <ElTag size="small" type="warning">🔧 {{ s.tool }}</ElTag>
                <span class="step-args mono">{{ JSON.stringify(s.args) }}</span>
                <div class="step-result mono">{{ JSON.stringify(s.result).slice(0, 600) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <ElInput
          v-model="input"
          type="textarea"
          :rows="2"
          placeholder="输入任务，如：哪些员工离职风险高？请运行规则并汇总"
          @keydown.ctrl.enter="send"
        />
        <ElButton type="primary" :loading="sending" @click="send"><ElIcon><ChatDotRound /></ElIcon> 发送</ElButton>
      </div>
    </ElCard>

    <ElDialog v-model="dialogVisible" title="配置 AIP Agent" width="640px">
      <ElForm label-width="120px">
        <ElFormItem label="显示名称">
          <ElInput v-model="form.displayName" />
        </ElFormItem>
        <ElFormItem label="模型">
          <ElInput v-model="form.model" placeholder="local-model" />
        </ElFormItem>
        <ElFormItem label="Base URL">
          <ElInput v-model="form.baseUrl" placeholder="http://localhost:1234/v1" />
          <div class="hint">OpenAI 兼容端点。本地模型（LM Studio/Ollama）通常无需 key。</div>
        </ElFormItem>
        <ElFormItem label="API Key">
          <ElInput v-model="form.apiKey" placeholder="本地模型可留空" />
        </ElFormItem>
        <ElFormItem label="温度">
          <ElInput v-model.number="form.temperature" type="number" :min="0" :max="2" :step="0.1" style="width:160px" />
        </ElFormItem>
        <ElFormItem label="最大步数">
          <ElInput v-model.number="form.maxSteps" type="number" :min="1" :max="20" style="width:160px" />
          <div class="hint">单轮对话中 Agent 最多工具调用次数，防止死循环。</div>
        </ElFormItem>
        <ElFormItem label="启用能力">
          <ElCheckboxGroup v-model="form.enabledTools">
            <ElCheckbox v-for="o in TOOL_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</ElCheckbox>
          </ElCheckboxGroup>
        </ElFormItem>
        <ElFormItem label="系统提示词">
          <ElInput v-model="form.systemPrompt" type="textarea" :rows="6" placeholder="留空则使用平台默认提示词" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="cfgSaving" @click="saveConfig">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.aip { padding: var(--space-6); max-width: 1000px; margin: 0 auto; }
.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-5); }
.page-title { display: flex; align-items: center; gap: var(--space-2); font-size: 1.4rem; margin: 0; }
.page-sub { color: var(--text-muted); margin: 4px 0 0; font-size: 0.9rem; }
.page-actions { display: flex; gap: var(--space-2); }
.chat-card { display: flex; flex-direction: column; height: calc(100vh - 220px); }
.chat-box { flex: 1; overflow-y: auto; padding: var(--space-3); }
.chat-empty { text-align: center; color: var(--text-muted); padding-top: 40px; }
.quick { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
.msg { display: flex; gap: 10px; margin-bottom: var(--space-4); }
.msg.user { flex-direction: row-reverse; }
.msg-role { font-size: 0.75rem; color: var(--text-muted); min-width: 36px; text-align: center; padding-top: 4px; }
.msg-content { max-width: 78%; padding: 10px 14px; border-radius: 10px; background: var(--bg-elevated); }
.msg.user .msg-content { background: var(--el-color-primary-light-9); }
.msg-content p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
.steps { margin-top: 8px; border-top: 1px dashed var(--border); padding-top: 8px; }
.step { margin-bottom: 6px; }
.step-args { font-size: 0.78rem; color: var(--text-muted); margin-left: 6px; }
.step-result { font-size: 0.74rem; color: var(--text-muted); background: var(--bg); border-radius: 6px; padding: 6px; margin-top: 4px; max-height: 160px; overflow: auto; word-break: break-all; }
.chat-input { display: flex; gap: 10px; padding: var(--space-3); border-top: 1px solid var(--border); align-items: flex-end; }
.chat-input .el-button { flex-shrink: 0; }
.hint { color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; line-height: 1.4; }
.mono { font-family: var(--font-mono); }
</style>
