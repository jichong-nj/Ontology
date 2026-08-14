<script setup lang="ts">
import { ref, shallowRef, reactive, computed, onMounted, nextTick, triggerRef } from 'vue';
import { renderMarkdown } from '@/markdown';
import {
  ElCard, ElButton, ElIcon, ElMessage, ElDialog, ElForm, ElFormItem, ElInput,
  ElCheckboxGroup, ElCheckbox, ElSelect, ElOption, ElTag,
} from 'element-plus';
import { Refresh, ChatDotRound, Setting, Cpu } from '@element-plus/icons-vue';
import {
  aip, type AIPAgentConfigDTO, type AIPModelDTO, type AgentStreamEvent,
} from '@/api';
import { tryRequest } from '@/utils/error';

const CONFIG_ID = 'default';

interface AgentStep {
  id: string;
  tool: string;
  args: unknown;
  result?: unknown;
  ok?: boolean;
  status: 'running' | 'done';
}
// LLM 调用状态：体现在对话中「正在调用 qwen... / 成功 / 失败」
interface CallStatus {
  step: number;
  model: string;
  status: 'calling' | 'ok' | 'failed';
  message?: string;
}
// 思考/推理：可折叠的一行提示 + 展开内容
interface ThoughtBlock {
  text: string;       // 已累计的完整思考内容
  collapsed: boolean; // 是否折叠
  label: string;      // 折叠时的一行提示
}
interface ChatMsg {
  role: 'user' | 'assistant';
  text?: string;       // 用户消息
  calls: CallStatus[]; // LLM 调用状态时间线
  thoughts: ThoughtBlock[];
  steps: AgentStep[];
  reply: string;       // 最终答复（流式累积原始文本）
  renderedReply: string;// markdown 渲染后的 HTML（节流更新）
  streaming: boolean;
}

const messages = shallowRef<ChatMsg[]>([]);
const input = ref('');
const sending = ref(false);
const stopFlag = ref(false);
const cfg = ref<AIPAgentConfigDTO | null>(null);
const cfgLoading = ref(false);
const dialogVisible = ref(false);
const models = ref<AIPModelDTO[]>([]);

const TOOL_OPTIONS = [
  { value: 'functions', label: '函数（执行 Ontology 函数）' },
  { value: 'actions', label: '动作（触发 Action）' },
  { value: 'rules', label: '规则（运行自动化规则）' },
  { value: 'explore', label: '探索（查询实例/关系/聚合）' },
  { value: 'alerts', label: '告警（查看 Alert 实例）' },
];

const form = reactive({
  displayName: 'Ontology Agent',
  systemPrompt: '',
  modelScope: [] as string[],
  defaultModelId: '',
  temperature: 0.2,
  enabledTools: ['functions', 'actions', 'rules', 'explore', 'alerts'],
  maxSteps: 6,
});

const activeModelId = ref('');
const chatBox = ref<HTMLElement | null>(null);
let abortCtrl: AbortController | null = null;
const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

// 流式渲染节流：每 300ms 将原始 reply 渲染为 markdown HTML，避免每 chunk 全量重解析
let renderTimer: ReturnType<typeof setInterval> | null = null;
function startRenderThrottle(msg: ChatMsg) {
  stopRenderThrottle();
  renderTimer = setInterval(() => {
    if (msg.reply !== msg.renderedReply) {
      msg.renderedReply = renderMarkdown(msg.reply);
    }
  }, 300);
}
function stopRenderThrottle() {
  if (renderTimer) { clearInterval(renderTimer); renderTimer = null; }
}

async function loadAll() {
  cfgLoading.value = true;
  await Promise.all([
    tryRequest(async () => { models.value = await aip.listModels(); }),
    tryRequest(async () => {
      const c = await aip.getConfig(CONFIG_ID);
      cfg.value = c;
      if (c) {
        Object.assign(form, {
          displayName: c.displayName,
          systemPrompt: c.systemPrompt,
          modelScope: c.modelScope ?? [],
          defaultModelId: c.defaultModelId ?? '',
          temperature: c.temperature,
          enabledTools: c.enabledTools,
          maxSteps: c.maxSteps,
        });
        activeModelId.value = c.defaultModelId ?? '';
      }
    }),
  ]);
  cfgLoading.value = false;
}

async function saveConfig() {
  await tryRequest(async () => {
    if (form.modelScope.length && !form.modelScope.includes(form.defaultModelId)) {
      form.defaultModelId = form.modelScope[0];
    }
    const saved = await aip.saveConfig(CONFIG_ID, {
      displayName: form.displayName,
      systemPrompt: form.systemPrompt,
      modelScope: form.modelScope,
      defaultModelId: form.defaultModelId,
      temperature: form.temperature,
      enabledTools: form.enabledTools,
      maxSteps: form.maxSteps,
    });
    cfg.value = saved;
    activeModelId.value = saved.defaultModelId ?? '';
    ElMessage.success('Agent 配置已保存');
    dialogVisible.value = false;
  });
}

function openConfig() {
  if (cfg.value) {
    Object.assign(form, {
      displayName: cfg.value.displayName,
      systemPrompt: cfg.value.systemPrompt,
      modelScope: cfg.value.modelScope ?? [],
      defaultModelId: cfg.value.defaultModelId ?? '',
      temperature: cfg.value.temperature,
      enabledTools: cfg.value.enabledTools,
      maxSteps: cfg.value.maxSteps,
    });
  }
  dialogVisible.value = true;
}

async function send() {
  const text = input.value.trim();
  if (!text || sending.value) return;
  messages.value.push({ role: 'user', text, calls: [], thoughts: [], steps: [], reply: '', renderedReply: '', streaming: false });
  input.value = '';
  await scrollToBottom();

  const assistant: ChatMsg = { role: 'assistant', calls: [], thoughts: [], steps: [], reply: '', renderedReply: '', streaming: true };
  startRenderThrottle(assistant);
  messages.value.push(assistant);
  sending.value = true;
  stopFlag.value = false;
  const controller = new AbortController();
  abortCtrl = controller;

  await tryRequest(async () => {
    await aip.streamRun(CONFIG_ID, text, (ev: AgentStreamEvent) => {
      switch (ev.type) {
        case 'call':
          assistant.calls.push({ step: ev.step, model: ev.model, status: 'calling' });
          break;
        case 'call_status':
          {
            const c = assistant.calls.find((x) => x.step === ev.step);
            if (c) { c.status = ev.ok ? 'ok' : 'failed'; c.message = ev.message; }
            else assistant.calls.push({ step: ev.step, model: '', status: ev.ok ? 'ok' : 'failed', message: ev.message });
          }
          break;
        case 'thought':
          {
            let block = assistant.thoughts[0];
            if (!block) {
              block = { text: '', collapsed: false, label: '思考过程' };
              assistant.thoughts.push(block);
            }
            block.text += ev.content;
          }
          break;
        case 'reply_chunk':
          assistant.reply += ev.content;
          break;
        case 'action':
          assistant.steps.push({ id: ev.id, tool: ev.tool, args: ev.args, status: 'running' });
          break;
        case 'result':
          {
            const s = assistant.steps.find((x) => x.id === ev.id);
            if (s) { s.result = ev.result; s.ok = ev.ok; s.status = 'done'; }
          }
          break;
        case 'error':
          assistant.thoughts.push({ text: `⚠️ ${ev.message}`, collapsed: false, label: '' });
          break;
        case 'done':
          if (!assistant.reply) assistant.reply = ev.reply;
          break;
      }
      // 强制触发 Vue 响应式更新，确保高频 SSE 事件下 UI 能实时渲染
      triggerRef(messages);
      scrollToBottom();
    }, [], activeModelId.value || undefined, controller.signal);
  });

  assistant.streaming = false;
  sending.value = false;
  stopRenderThrottle();
  // 最终完整渲染一次（确保 markdown 表格等复杂结构正确）
  assistant.renderedReply = renderMarkdown(assistant.reply);
  await scrollToBottom();
}

function stop() {
  stopFlag.value = true;
  sending.value = false;
  abortCtrl?.abort();
  abortCtrl = null;
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

const switchableModels = computed(() => models.value.filter((m) => form.modelScope.includes(m.id)));

onMounted(loadAll);
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
        <ElButton :loading="cfgLoading" @click="loadAll"><ElIcon><Refresh /></ElIcon> 刷新配置</ElButton>
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
            <p v-if="m.role === 'user'" class="reply">{{ m.text }}</p>
            <template v-else>
              <!-- LLM 调用状态时间线：清楚体现每次交互在做什么、成功还是失败 -->
              <div v-if="m.calls.length" class="calls">
                <div v-for="(c, ci) in m.calls" :key="'c' + ci" class="call" :class="c.status">
                  <span class="call-ico">
                    <template v-if="c.status === 'calling'">⏳</template>
                    <template v-else-if="c.status === 'ok'">✅</template>
                    <template v-else>❌</template>
                  </span>
                  <span class="call-text">
                    <template v-if="c.status === 'calling'">正在调用模型{{ c.model ? ` ${c.model}` : '' }}…</template>
                    <template v-else-if="c.status === 'ok'">已调用模型{{ c.model ? ` ${c.model}` : '' }}（成功）</template>
                    <template v-else>调用模型{{ c.model ? ` ${c.model}` : '' }} 失败：{{ c.message }}</template>
                  </span>
                </div>
              </div>

              <!-- 思考/推理：一行提示，可折叠展开 -->
              <div v-for="(t, ti) in m.thoughts" :key="'t' + ti" class="thought" :class="{ error: !t.label }">
                <div class="thought-toggle" @click="t.collapsed = !t.collapsed">
                  <ElIcon class="thought-ico"><ChatDotRound /></ElIcon>
                  <span class="thought-label">{{ t.label || '发生错误' }}</span>
                  <span class="thought-caret">{{ t.collapsed ? '▸' : '▾' }}</span>
                </div>
                <div v-show="!t.collapsed" class="thought-body">{{ t.text }}</div>
              </div>

              <!-- 工具调用（函数/动作/规则/探索/告警）及返回 -->
              <div v-if="m.steps.length" class="steps">
                <div v-for="(s, j) in m.steps" :key="'s' + j" class="step" :class="s.ok === false ? 'fail' : ''">
                  <div class="step-head">
                    <ElTag size="small" :type="s.status === 'running' ? 'info' : (s.ok === false ? 'danger' : 'warning')">
                      {{ s.status === 'running' ? '⏳' : (s.ok === false ? '❌' : '🔧') }} {{ s.tool }}
                    </ElTag>
                    <span v-if="s.status === 'running'" class="step-running">执行中…</span>
                    <span v-else-if="s.ok === false" class="step-failed">失败</span>
                    <span v-else class="step-ok">成功</span>
                  </div>
                  <div class="step-args mono">入参：{{ JSON.stringify(s.args) }}</div>
                  <div v-if="s.status === 'done'" class="step-result mono">返回：{{ JSON.stringify(s.result).slice(0, 800) }}</div>
                </div>
              </div>

              <!-- 最终答复（流式累积，支持 markdown） -->
              <div v-if="m.renderedReply || m.reply" class="reply md" v-html="m.renderedReply || m.reply"></div>
              <p v-else-if="m.streaming" class="typing">▋ 正在生成…</p>
            </template>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="model-switch">
          <span class="model-label">模型</span>
          <ElSelect v-model="activeModelId" placeholder="选择模型" size="default" style="width:240px">
            <ElOption v-for="m in switchableModels" :key="m.id" :label="m.displayName" :value="m.id">
              <span>{{ m.displayName }}</span>
              <small v-if="m.isReasoning" style="color:var(--el-color-warning)"> · 推理</small>
            </ElOption>
          </ElSelect>
        </div>
        <ElInput
          v-model="input"
          type="textarea"
          :rows="2"
          placeholder="输入任务，如：哪些员工离职风险高？请运行规则并汇总"
          @keydown.ctrl.enter="send"
        />
        <ElButton v-if="!sending" type="primary" :disabled="!activeModelId" @click="send"><ElIcon><ChatDotRound /></ElIcon> 发送</ElButton>
        <ElButton v-else type="danger" @click="stop"><ElIcon><ChatDotRound /></ElIcon> 停止</ElButton>
      </div>
    </ElCard>

    <ElDialog v-model="dialogVisible" title="配置 AIP Agent" width="680px">
      <ElForm label-width="120px">
        <ElFormItem label="显示名称">
          <ElInput v-model="form.displayName" />
        </ElFormItem>
        <ElFormItem label="模型范围">
          <ElSelect v-model="form.modelScope" multiple placeholder="选择可用模型（在 Provider 页添加）" style="width:100%">
            <ElOption v-for="m in models" :key="m.id" :label="m.displayName" :value="m.id" />
          </ElSelect>
          <div class="hint">用户对话时只能在所选模型范围内切换。</div>
        </ElFormItem>
        <ElFormItem label="默认模型">
          <ElSelect v-model="form.defaultModelId" placeholder="选择默认模型" style="width:100%">
            <ElOption v-for="m in models.filter(x => form.modelScope.includes(x.id))" :key="m.id" :label="m.displayName" :value="m.id" />
          </ElSelect>
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
        <ElButton type="primary" :loading="cfgLoading" @click="saveConfig">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.aip { display: flex; flex-direction: column; height: calc(100vh - 92px); min-height: 0; max-width: 1000px; margin: 0 auto; width: 100%; }
.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-4); flex-shrink: 0; }
.page-title { display: flex; align-items: center; gap: var(--space-2); font-size: 1.4rem; margin: 0; }
.page-sub { color: var(--text-muted); margin: 4px 0 0; font-size: 0.9rem; }
.page-actions { display: flex; gap: var(--space-2); }
.chat-card { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.chat-box { flex: 1; min-height: 0; overflow-y: auto; padding: var(--space-3); }
.chat-empty { text-align: center; color: var(--text-muted); padding-top: 40px; }
.quick { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
.msg { display: flex; gap: 10px; margin-bottom: var(--space-4); }
.msg.user { flex-direction: row-reverse; }
.msg-role { font-size: 0.75rem; color: var(--text-muted); min-width: 36px; text-align: center; padding-top: 4px; }
.msg-content { max-width: 78%; padding: 10px 14px; border-radius: 10px; background: var(--bg-elevated); }
.msg.user .msg-content { background: var(--el-color-primary-light-9); }
.msg-content p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
.calls { margin: 4px 0; border-left: 2px solid var(--border); padding-left: 8px; }
.call { display: flex; gap: 6px; align-items: center; font-size: 0.82rem; padding: 2px 0; line-height: 1.5; }
.call-ico { flex-shrink: 0; }
.call-text { color: var(--text-muted); }
.call.ok .call-text { color: var(--el-color-success); }
.call.failed .call-text { color: var(--el-color-danger); }
.thought { margin: 6px 0; padding: 6px 10px; border-radius: 8px; background: var(--bg); border: 1px dashed var(--border); }
.thought.error { border-color: var(--el-color-danger); background: var(--el-color-danger-light-9); }
.thought-toggle { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
.thought-ico { color: var(--el-color-primary); flex-shrink: 0; }
.thought-label { font-size: 0.82rem; color: var(--text-muted); }
.thought-caret { margin-left: auto; color: var(--text-muted); font-size: 0.75rem; }
.thought-body { margin-top: 6px; font-size: 0.85rem; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.6; max-height: 320px; overflow: auto; }
.steps { margin-top: 8px; border-top: 1px dashed var(--border); padding-top: 8px; }
.step { margin-bottom: 8px; padding: 8px 10px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); }
.step.fail { border-color: var(--el-color-danger); background: var(--el-color-danger-light-9); }
.step-head { display: flex; align-items: center; gap: 8px; }
.step-running { font-size: 0.75rem; color: var(--el-color-info); }
.step-ok { font-size: 0.75rem; color: var(--el-color-success); }
.step-failed { font-size: 0.75rem; color: var(--el-color-danger); }
.step-args { font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; }
.step-result { font-size: 0.74rem; color: var(--text-muted); background: var(--bg); border-radius: 6px; padding: 6px; margin-top: 4px; max-height: 160px; overflow: auto; word-break: break-all; }
.reply { margin: 8px 0 0; white-space: pre-wrap; line-height: 1.7; font-size: 0.95rem; }
.msg.user .msg-content .reply { margin: 0; }
.typing { color: var(--text-muted); font-style: italic; margin: 4px 0 0 !important; }

/* Markdown 渲染样式（:deep 确保 v-html 注入内容也能命中） */
.md { margin: 8px 0 0; line-height: 1.7; font-size: 0.95rem; word-break: break-word; }
.md > :first-child { margin-top: 0; }
.md > :last-child { margin-bottom: 0; }
.md :deep(p) { margin: 8px 0; line-height: 1.7; }
.md :deep(h1), .md :deep(h2), .md :deep(h3), .md :deep(h4) { margin: 14px 0 8px; line-height: 1.3; font-weight: 600; }
.md :deep(h1) { font-size: 1.4rem; }
.md :deep(h2) { font-size: 1.2rem; }
.md :deep(h3) { font-size: 1.05rem; }
.md :deep(ul), .md :deep(ol) { margin: 8px 0; padding-left: 1.5em; }
.md :deep(li) { margin: 4px 0; }
.md :deep(a) { color: var(--el-color-primary); text-decoration: none; }
.md :deep(a):hover { text-decoration: underline; }
.md :deep(strong) { font-weight: 600; }
.md :deep(blockquote) { margin: 8px 0; padding: 4px 12px; border-left: 3px solid var(--el-color-primary); background: var(--bg); color: var(--text-muted); }
.md :deep(code) { font-family: var(--font-mono); font-size: 0.85em; background: var(--bg); padding: 2px 5px; border-radius: 4px; }
.md :deep(pre) { background: #1e1e2e; color: #e4e4e7; padding: 12px 14px; border-radius: 8px; overflow: auto; margin: 8px 0; }
.md :deep(pre code) { background: transparent; color: inherit; padding: 0; font-size: 0.85em; }
.md :deep(table) { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 0.88rem; border: 1px solid #d1d5db; }
.md :deep(th), .md :deep(td) { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
.md :deep(thead th) { background: #f9fafb; font-weight: 600; }
.md :deep(tbody tr:nth-child(even)) { background: var(--bg); }
.md :deep(hr) { border: none; border-top: 1px solid #d1d5db; margin: 12px 0; }
.md :deep(img) { max-width: 100%; border-radius: 6px; }
.chat-input {
  display: flex;
  gap: 10px;
  padding: var(--space-3);
  border-top: 1px solid var(--border);
  align-items: flex-end;
  flex-shrink: 0;
  background: var(--bg-elevated);
}
.chat-input .el-button { flex-shrink: 0; }
.model-switch { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.model-label { font-size: 0.85rem; color: var(--text-muted); }
.hint { color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; line-height: 1.4; }
.mono { font-family: var(--font-mono); }
</style>
