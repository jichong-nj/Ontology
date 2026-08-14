<template>
  <div class="aip-layout">
    <!-- 左侧：Agent 列表 -->
    <aside class="aip-sidebar">
      <div class="sidebar-head">
        <span class="sidebar-title">智能体</span>
        <el-button size="small" type="primary" plain @click="openNewAgent">+ 新建</el-button>
      </div>
      <ul class="agent-list">
        <li
          v-for="a in agents"
          :key="a.id"
          :class="['agent-item', { active: a.id === currentId }]"
          @click="switchAgent(a.id)"
        >
          <div class="agent-name">{{ a.displayName }}</div>
          <div class="agent-id">{{ a.id }}</div>
          <el-button
            size="small"
            text
            class="agent-del"
            @click.stop="confirmDelete(a)"
            title="删除"
          >🗑</el-button>
        </li>
      </ul>
    </aside>

    <!-- 右侧：对话区（参考早期 chat 版本的气泡布局） -->
    <section class="aip-main">
      <div class="main-head">
        <div class="head-info">
          <strong>{{ currentConfig?.displayName || 'Ontology Agent' }}</strong>
          <span class="muted">（{{ currentId }}）</span>
          <span v-if="enabledToolLabels.length" class="tool-tags">
            <el-tag v-for="l in enabledToolLabels" :key="l" size="small" class="tool-tag">{{ l }}</el-tag>
          </span>
        </div>
        <div class="head-actions">
          <el-button size="small" :loading="cfgLoading" @click="loadConfig">刷新配置</el-button>
          <el-button size="small" @click="openConfig">配置</el-button>
          <el-button size="small" type="danger" plain @click="clearChat">清空对话</el-button>
        </div>
      </div>

      <div ref="scrollRef" class="chat">
        <!-- 空状态：欢迎语 + 快捷提问 -->
        <div v-if="messages.length === 0" class="chat-empty">
          <p>👋 我是 Ontology 智能体，可调用本体函数 / 动作 / 规则 / 探索 / 告警回答你的问题。</p>
          <div class="quick">
            <el-button v-for="q in quickPrompts" :key="q" size="small" @click="quickAsk(q)">{{ q }}</el-button>
          </div>
        </div>

        <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
          <div class="msg-role">{{ m.role === 'user' ? '你' : 'Agent' }}</div>
          <div class="msg-body">
            <!-- 用户消息 -->
            <div v-if="m.role === 'user'" class="bubble user">{{ m.content }}</div>
            <!-- AI 消息：思考(可折叠) → 工具调用(可折叠) → 回复正文(最后) -->
            <template v-else>
              <!-- 思考链（单次合并，可折叠） -->
              <el-collapse v-if="m.thinking" class="think-collapse">
                <el-collapse-item name="t">
                  <template #title><span class="collapse-title">💭 思考过程</span></template>
                  <div class="thinking">{{ m.thinking }}</div>
                </el-collapse-item>
              </el-collapse>
              <!-- 工具调用（可折叠，工具名正确） -->
              <el-collapse v-if="m.steps?.length" class="steps-collapse">
                <el-collapse-item name="s">
                  <template #title><span class="collapse-title">🔧 工具调用 ({{ m.steps.length }})</span></template>
                  <div v-for="(s, j) in m.steps" :key="j" class="step">
                    <div class="step-header">
                      <el-tag size="small" type="warning">🔧 {{ s.tool || '未知工具' }}</el-tag>
                    </div>
                    <details open class="step-detail">
                      <summary>参数</summary>
                      <pre class="step-args mono">{{ pretty(s.args) }}</pre>
                    </details>
                    <details open class="step-detail">
                      <summary>返回</summary>
                      <pre class="step-result mono">{{ pretty(s.result) }}</pre>
                    </details>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <!-- 回复正文（始终在最后） -->
              <div v-if="m.content" class="bubble ai" v-html="renderMd(m.content)"></div>
            </template>
          </div>
        </div>
      </div>

      <div class="composer">
        <el-input
          v-model="input"
          type="textarea"
          :rows="3"
          placeholder="向智能体提问，例如：列出高风险离职人员"
          @keydown.ctrl.enter="send"
        />
        <div class="composer-actions">
          <el-button @click="stopStream" :disabled="!streaming">停止</el-button>
          <el-button type="primary" @click="send" :disabled="streaming">发送 (Ctrl+Enter)</el-button>
        </div>
      </div>
    </section>

    <!-- Agent 新建/配置 Dialog -->
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
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MarkdownIt from 'markdown-it';
import { aip as api, AIPAgentConfigDTO } from '../api';
import { s2 } from '../api';
import type { ObjectType } from '../api';

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
function renderMd(s: string): string {
  return md.render(s ?? '');
}

const CONFIG_ID = 'default';
const currentId = ref(CONFIG_ID);
const agents = ref<AIPAgentConfigDTO[]>([]);
const currentConfig = ref<AIPAgentConfigDTO | null>(null);
const allObjectTypes = ref<ObjectType[]>([]);
const models = ref<{ id: string; displayName: string }[]>([]);

const messages = ref<{ role: 'user' | 'ai'; content: string; steps?: any[]; thinking?: string }[]>([]);
const input = ref('');
const streaming = ref(false);
let abortCtl: AbortController | null = null;
const scrollRef = ref<HTMLElement | null>(null);
const cfgLoading = ref(false);

const configVisible = ref(false);
const configIsNew = ref(false);
const form = ref<Partial<AIPAgentConfigDTO>>({});

const TOOL_OPTIONS = [
  { value: 'functions', label: '函数' },
  { value: 'actions', label: '动作' },
  { value: 'rules', label: '规则' },
  { value: 'explore', label: '探索' },
  { value: 'alerts', label: '告警' },
];
const quickPrompts = [
  '现在哪些员工离职风险较高？', '列出所有对象类型', '统计各部门人数', '运行一次全部规则', '查看当前告警',
];
const enabledToolLabels = computed(() =>
  (currentConfig.value?.enabledTools ?? []).map((t) => TOOL_OPTIONS.find((o) => o.value === t)?.label ?? t),
);

async function loadAgents() {
  agents.value = await api.listAgents();
  if (!agents.value.find((a) => a.id === currentId.value)) {
    currentId.value = agents.value[0]?.id ?? CONFIG_ID;
  }
  await loadConfig();
}

async function loadConfig() {
  cfgLoading.value = true;
  try {
    currentConfig.value = await api.getConfig(currentId.value);
  } catch {
    currentConfig.value = null;
  } finally {
    cfgLoading.value = false;
  }
}

async function switchAgent(id: string) {
  currentId.value = id;
  messages.value = [];
  await loadConfig();
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
  if (!allObjectTypes.value.length) {
    try {
      allObjectTypes.value = await s2.listObjectTypes();
    } catch {
      allObjectTypes.value = [];
    }
  }
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

async function openConfig() {
  configIsNew.value = false;
  await loadModels();
  form.value = { ...currentConfig.value, objectTypes: currentConfig.value?.objectTypes ?? [] } as Partial<AIPAgentConfigDTO>;
  configVisible.value = true;
}

async function saveConfig() {
  try {
    if (configIsNew.value) {
      if (!form.value.id) return ElMessage.error('Agent ID 必填');
      const cfg = await api.createAgent(form.value);
      ElMessage.success('已新建：' + cfg.displayName);
      await loadAgents();
      currentId.value = cfg.id;
    } else {
      await api.saveConfig(currentId.value, form.value);
      ElMessage.success('已保存');
      await loadConfig();
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
      if (currentId.value === a.id) currentId.value = CONFIG_ID;
      await loadAgents();
    })
    .catch(() => {});
}

function quickAsk(t: string) {
  input.value = t;
  send();
}

async function send() {
  const text = input.value.trim();
  if (!text || streaming.value) return;
  messages.value.push({ role: 'user', content: text });
  input.value = '';
  await nextTick();
  scrollDown();

  const aiMsg = reactive({ role: 'ai' as const, content: '', steps: [] as any[], thinking: '' });
  messages.value.push(aiMsg);
  streaming.value = true;

  const assistant: { id?: string; tool: string; args: unknown; result: unknown }[] = [];
  let thinking = '';
  let reply = '';
  abortCtl = new AbortController();

  try {
    await api.streamRun(
      currentId.value,
      text,
      (ev: any) => {
        if (ev.type === 'thought') {
          // 多次思考累计合并（去掉每个 token 强制换行，避免一行一 token）
          thinking += ev.content;
          aiMsg.thinking = thinking;
        } else if (ev.type === 'action') {
          assistant.push({ id: ev.id, tool: ev.tool, args: ev.args, result: undefined });
          aiMsg.steps = [...assistant];
        } else if (ev.type === 'result') {
          const step = assistant.find((s) => s.id === ev.id) || assistant[assistant.length - 1];
          if (step) step.result = ev.result;
          aiMsg.steps = [...assistant];
        } else if (ev.type === 'reply_chunk') {
          reply += ev.content;
          aiMsg.content = reply;
        } else if (ev.type === 'done') {
          aiMsg.content = reply || ev.reply || '';
        } else if (ev.type === 'error') {
          aiMsg.content = '⚠️ ' + ev.message;
        }
        scrollDown();
      },
      [],
      undefined,
      abortCtl.signal,
    );
  } catch (e: any) {
    aiMsg.content = '⚠️ ' + (e.message || '对话失败');
  } finally {
    streaming.value = false;
    abortCtl = null;
  }
}

function stopStream() {
  abortCtl?.abort();
}

function clearChat() {
  messages.value = [];
}

function scrollDown() {
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  });
}

function pretty(v: unknown): string {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
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
.aip-layout { display: flex; height: calc(100vh - 120px); }
.aip-sidebar { width: 240px; border-right: 1px solid #ebeef5; padding: 12px; overflow-y: auto; }
.sidebar-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.sidebar-title { font-weight: 600; }
.agent-list { list-style: none; padding: 0; margin: 0; }
.agent-item { position: relative; padding: 10px 12px; border-radius: 8px; cursor: pointer; margin-bottom: 6px; border: 1px solid transparent; }
.agent-item.active { background: #ecf5ff; border-color: #409eff; }
.agent-name { font-weight: 600; }
.agent-id { font-size: 12px; color: #909399; }
.agent-del { position: absolute; top: 6px; right: 6px; }

.aip-main { flex: 1; display: flex; flex-direction: column; padding: 12px 16px; min-width: 0; }
.main-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 12px; flex-wrap: wrap; }
.head-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tool-tags { display: inline-flex; gap: 4px; flex-wrap: wrap; }
.tool-tag { margin-left: 0; }
.head-actions { display: flex; gap: 8px; }

.chat { flex: 1; overflow-y: auto; border: 1px solid #ebeef5; border-radius: 8px; padding: 16px; background: #fafafa; }
.chat-empty { text-align: center; color: #909399; padding-top: 48px; }
.chat-empty .quick { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }

.msg { display: flex; gap: 10px; margin-bottom: 18px; align-items: flex-start; }
.msg.user { flex-direction: row-reverse; }
.msg-role { font-size: 12px; color: #909399; min-width: 36px; text-align: center; padding-top: 6px; flex-shrink: 0; }
.msg-body { min-width: 0; display: flex; flex-direction: column; }
.msg.user .msg-body { align-items: flex-end; max-width: 70%; }

.bubble { padding: 10px 14px; border-radius: 10px; line-height: 1.6; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; }
.bubble.user { background: #409eff; color: #fff; border-radius: 10px 10px 2px 10px; }
.bubble.ai { background: #fff; border: 1px solid #ebeef5; border-radius: 10px 10px 10px 2px; width: 100%; box-sizing: border-box; }
.bubble.ai :deep(pre) { background: #f4f4f5; padding: 8px; border-radius: 6px; overflow-x: auto; margin: 8px 0 0; }
/* markdown 渲染样式 */
.bubble.ai :deep(h1),
.bubble.ai :deep(h2),
.bubble.ai :deep(h3),
.bubble.ai :deep(h4) { margin: 10px 0 6px; line-height: 1.3; }
.bubble.ai :deep(h1) { font-size: 18px; }
.bubble.ai :deep(h2) { font-size: 16px; }
.bubble.ai :deep(h3) { font-size: 15px; }
.bubble.ai :deep(p) { margin: 6px 0; }
.bubble.ai :deep(ul),
.bubble.ai :deep(ol) { padding-left: 22px; margin: 6px 0; }
.bubble.ai :deep(li) { margin: 2px 0; }
.bubble.ai :deep(code):not(pre code) { background: #f4f4f5; padding: 1px 5px; border-radius: 4px; font-size: 13px; }
.bubble.ai :deep(table) { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 13px; }
.bubble.ai :deep(th),
.bubble.ai :deep(td) { border: 1px solid #dcdfe6; padding: 6px 10px; text-align: left; }
.bubble.ai :deep(th) { background: #f5f7fa; font-weight: 600; }
.bubble.ai :deep(tr:nth-child(even) td) { background: #fafafa; }
.bubble.ai :deep(blockquote) { border-left: 3px solid #dcdfe6; margin: 8px 0; padding: 2px 12px; color: #606266; }
.bubble.ai :deep(a) { color: #409eff; }

/* 折叠面板：去边框/底色，直接在聊天背景上 */
.think-collapse, .steps-collapse { margin-bottom: 8px; border: none; background: transparent; }
.think-collapse :deep(.el-collapse-item__header),
.steps-collapse :deep(.el-collapse-item__header),
.think-collapse :deep(.el-collapse-item__wrap),
.steps-collapse :deep(.el-collapse-item__wrap) { background: transparent; border: none; }
.collapse-title { font-size: 13px; color: #606266; }

/* 思考链：无底色，直接在背景上，字号比回复小一号 */
.thinking { color: #909399; white-space: pre-wrap; word-break: break-word; font-size: 13px; padding: 2px 0; background: transparent; line-height: 1.7; max-height: 300px; overflow-y: auto; }

/* 工具步骤：无底色，直接在背景上，字号比回复小一号 */
.steps-collapse :deep(.el-collapse-item__content) { background: transparent; padding-bottom: 0; }
.step { margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #ebeef5; background: transparent; }
.step:last-child { border-bottom: none; }
.step-header { margin-bottom: 4px; }
.step-detail { margin-top: 4px; cursor: pointer; }
.step-detail summary { font-size: 12px; color: #909399; outline: none; user-select: none; }
.step-detail summary:hover { color: #409eff; }
.step-args, .step-result { margin: 4px 0 0; white-space: pre-wrap; word-break: break-all; font-size: 13px; color: #606266; background: transparent; }
.step-result { border-radius: 6px; padding: 4px 0; max-height: 200px; overflow: auto; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

.composer { margin-top: 10px; }
.composer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.muted { color: #909399; }
.small { font-size: 12px; }
</style>
