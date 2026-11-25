<template>
  <div class="aip-layout">
    <!-- 中间：会话列表 -->
    <aside class="conv-sidebar">
      <div class="sidebar-head">
        <span class="sidebar-title">会话</span>
        <el-button size="small" type="primary" plain @click="newConversation">+ 新建会话</el-button>
      </div>
      <ul class="conv-list" v-if="conversations.length">
        <li
          v-for="c in conversations"
          :key="c.id"
          :class="['conv-item', { active: c.id === currentConvId }]"
          @click="switchConversation(c.id)"
        >
          <div class="conv-title">{{ c.title }}</div>
          <div class="conv-time muted">{{ fmtTime(c.updatedAt) }}</div>
          <el-button size="small" text class="conv-del" @click.stop="confirmDeleteConv(c)" title="删除">🗑</el-button>
        </li>
      </ul>
      <div v-else class="conv-empty muted">暂无会话<br />点击上方「+ 新建会话」</div>
    </aside>

    <!-- 右侧：对话区（参考早期 chat 版本的气泡布局） -->
    <section class="aip-main">
      <div class="main-head">
        <div class="head-info">
          <el-select
            v-model="currentId"
            filterable
            placeholder="选择智能体"
            style="width: 220px"
            @change="switchAgent"
            @visible-change="(v:boolean)=>v&&loadAgents()"
          >
            <el-option v-for="a in agents" :key="a.id" :label="a.displayName + '（' + a.id + '）'" :value="a.id" />
          </el-select>
          <span class="muted">（{{ currentId }}）</span>
          <span v-if="enabledToolLabels.length" class="tool-tags">
            <el-tag v-for="l in enabledToolLabels" :key="l" size="small" class="tool-tag">{{ l }}</el-tag>
          </span>
        </div>
        <div class="head-actions">
          <el-button size="small" :loading="cfgLoading" @click="loadConfig">刷新配置</el-button>
          <el-button size="small" @click="openConfig">配置</el-button>
          <el-button size="small" type="danger" plain @click="newConversation">新会话</el-button>
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
            <!-- AI 消息：按时间顺序依次展示思考 / 工具调用，回复正文在最后 -->
            <template v-else>
              <div v-if="m.timeline?.length" class="timeline-toolbar">
                <span class="tl-stat">💭 思考 {{ thoughtCount(m) }} · 🔧 工具 {{ actionCount(m) }}</span>
                <el-button size="small" link type="primary" @click="setAllThoughts(i, true)">展开全部思考</el-button>
                <el-button size="small" link @click="setAllThoughts(i, false)">收起全部思考</el-button>
                <el-button size="small" link type="primary" @click="setAllTools(i, true)">展开全部执行</el-button>
                <el-button size="small" link @click="setAllTools(i, false)">收起全部执行</el-button>
              </div>
              <template v-for="(t, k) in m.timeline" :key="k">
                <!-- 思考框（每个思考段落独立，可展开/收起） -->
                <div v-if="t.kind === 'thought'" class="think-block">
                  <div class="think-block__head" @click="toggleThought(i, k)">
                    <span class="collapse-title">💭 思考 {{ thinkIndex(m.timeline, k) }}</span>
                    <span v-if="!isThoughtOpen(i, k)" class="think-preview">{{ thoughtPreview(t.content) }}</span>
                    <span class="think-toggle">{{ isThoughtOpen(i, k) ? '收起' : '展开' }}</span>
                  </div>
                  <div v-show="isThoughtOpen(i, k)" class="thinking">{{ t.content }}</div>
                </div>
                <!-- 工具调用（折叠块：标题+参数摘要，展开看参数/返回） -->
                <div v-if="t.kind === 'action' && t.step" class="tool-block">
                  <div class="tool-block__head" @click="toggleTool(i, k)">
                    <span class="collapse-title">🔧 {{ t.step.tool || '未知工具' }}</span>
                    <span v-if="!isToolOpen(i, k)" class="think-preview">{{ toolPreview(t.step.args) }}</span>
                    <span class="think-toggle">{{ isToolOpen(i, k) ? '收起' : '展开' }}</span>
                  </div>
                  <div v-show="isToolOpen(i, k)" class="step">
                    <div class="step-detail">
                      <div class="step-label-row">
                        <span class="step-label">参数</span>
                        <el-button size="small" link @click.stop="copyJson(t.step.args)">复制</el-button>
                      </div>
                      <pre class="step-args mono">{{ pretty(t.step.args) }}</pre>
                    </div>
                    <div class="step-detail">
                      <div class="step-label-row">
                        <span class="step-label">返回</span>
                        <el-button size="small" link @click.stop="copyJson(t.step.result)">复制</el-button>
                      </div>
                      <pre class="step-result mono">{{ pretty(t.step.result) }}</pre>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 流式思考中：尚未被工具/回复打断的当前思考 -->
              <div v-if="m.curThink" class="think-block think-block--live">
                <div class="think-block__head"><span class="collapse-title">💭 思考中…</span></div>
                <div class="thinking">{{ m.curThink }}</div>
              </div>
              <!-- 回复正文（始终在最后） -->
              <div v-if="m.content" class="bubble ai" v-html="renderMd(m.content)"></div>
              <div v-if="m.stopped" class="stopped-hint">⏹ 已停止生成</div>
              <!-- AIP 建模草案：确认创建卡片（创建动作由用户点击触发，模型不直接写库） -->
              <div v-if="m.draft && m.draft.type === 'object_type_draft'" class="draft-card">
                <div class="draft-title">📦 对象类型草案 · {{ m.draft.displayName }}（{{ m.draft.apiName }}）</div>
                <div class="draft-meta">
                  源表 {{ m.draft.schema || 'public' }}.{{ m.draft.sourceTable }}
                  · 主键 {{ m.draft.primaryKey || 'id' }}
                  · {{ m.draft.properties.length }} 个属性
                </div>
                <div class="draft-props">
                  <span v-for="p in m.draft.properties" :key="p.apiName" class="draft-prop">
                    <span class="mono">{{ p.apiName }}</span>
                    <span class="draft-prop-type">{{ p.type }}</span>
                    <span class="draft-prop-src">← {{ p.sourceMapping }}</span>
                  </span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  :loading="m.draftCreating"
                  @click="confirmDraft(m)"
                >确认创建并同步实例</el-button>
                <div v-if="m.draftResult" class="draft-result">
                  <span v-if="m.draftResult.error" class="draft-err">✗ {{ m.draftResult.error }}</span>
                  <span v-else>
                    ✓ 已创建 {{ m.draftResult.apiName }}
                    <template v-if="m.draftResult.sync && !m.draftResult.sync.error">
                      ，同步 {{ m.draftResult.sync.written }} 条实例（读取 {{ m.draftResult.sync.read }} 行）
                    </template>
                  </span>
                </div>
              </div>

              <!-- 关系类型草案卡片 -->
              <div v-else-if="m.draft && m.draft.type === 'link_type_draft'" class="draft-card">
                <div class="draft-title">🔗 关系类型草案 · {{ m.draft.displayName }}（{{ m.draft.apiName }}）</div>
                <div class="draft-meta">
                  {{ m.draft.sourceType }} → {{ m.draft.targetType }}
                  · {{ m.draft.cardinality }}
                  · 外键 {{ m.draft.foreignKey }}
                  · 目标键 {{ m.draft.targetKeyProperty || m.draft.primaryKey }}
                </div>
                <el-button
                  type="primary"
                  size="small"
                  :loading="m.draftCreating"
                  @click="confirmDraft(m)"
                >确认创建并同步关系实例</el-button>
                <div v-if="m.draftResult" class="draft-result">
                  <span v-if="m.draftResult.error" class="draft-err">✗ {{ m.draftResult.error }}</span>
                  <span v-else>
                    ✓ 已创建 {{ m.draftResult.apiName }}
                    <template v-if="m.draftResult.sync && !m.draftResult.sync.error">
                      ，同步 {{ m.draftResult.sync.written }} 条关系实例（读取 {{ m.draftResult.sync.read }} 行）
                    </template>
                  </span>
                </div>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MarkdownIt from 'markdown-it';
import { useRouter } from 'vue-router';
import { aip as api, s2, AIPAgentConfigDTO, AIPConversationDTO, AIPMessageDTO } from '../api';

const router = useRouter();
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
function renderMd(s: string): string {
  return md.render(s ?? '');
}

const CONFIG_ID = 'default';
const currentId = ref(CONFIG_ID);
const agents = ref<AIPAgentConfigDTO[]>([]);
const currentConfig = ref<AIPAgentConfigDTO | null>(null);
const conversations = ref<AIPConversationDTO[]>([]);
const currentConvId = ref<string | null>(null);

const messages = ref<{ role: 'user' | 'ai'; content: string; timeline?: any[]; curThink?: string; draft?: any; draftCreating?: boolean; draftResult?: any; stopped?: boolean }[]>([]);
const input = ref('');
const streaming = ref(false);
let abortCtl: AbortController | null = null;
const scrollRef = ref<HTMLElement | null>(null);
const cfgLoading = ref(false);

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
  await loadConversations();
}

function openConfig() {
  router.push('/aip/agents');
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
  currentConvId.value = null;
  await loadConfig();
  await loadConversations();
}

// ---------- 会话管理 ----------
async function loadConversations() {
  try {
    conversations.value = await api.listConversations(currentId.value);
    // 自动选中最近一个会话
    if (conversations.value.length) {
      await switchConversation(conversations.value[0].id);
    } else {
      currentConvId.value = null;
      messages.value = [];
    }
  } catch {
    conversations.value = [];
  }
}

async function switchConversation(cid: string) {
  currentConvId.value = cid;
  messages.value = [];
  try {
    const msgs = await api.listMessages(cid);
    messages.value = msgs.map((m: AIPMessageDTO) => ({
      role: m.role,
      content: m.content,
      // 历史消息里的 action 是扁平结构 {kind,tool,args,result}；流式时是 {kind,step}
      // 统一成 step 结构，保证工具调用在刷新后仍可展示
      timeline: (m.timeline ?? []).map((t: any) =>
        t?.kind === 'action' && !t.step
          ? { kind: 'action', step: { id: t.id, tool: t.tool, args: t.args, result: t.result } }
          : t,
      ),
    }));
  } catch {
    messages.value = [];
  }
  await nextTick();
  scrollDown();
}

async function newConversation() {
  try {
    const conv = await api.createConversation(currentId.value, '新会话');
    conversations.value.unshift(conv);
    currentConvId.value = conv.id;
    messages.value = [];
  } catch (e: any) {
    ElMessage.error(e?.message || '新建会话失败');
  }
}

async function confirmDeleteConv(c: AIPConversationDTO) {
  await ElMessageBox.confirm(`确认删除会话「${c.title}」？`, '删除确认', { type: 'warning' })
    .then(async () => {
      await api.deleteConversation(c.id);
      conversations.value = conversations.value.filter((x) => x.id !== c.id);
      if (currentConvId.value === c.id) {
        currentConvId.value = null;
        messages.value = [];
        if (conversations.value.length) await switchConversation(conversations.value[0].id);
      }
      ElMessage.success('已删除');
    })
    .catch(() => {});
}

function fmtTime(t?: string): string {
  if (!t) return '';
  const d = new Date(t);
  if (isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function quickAsk(t: string) {
  input.value = t;
  send();
}

// 从 AI 回复中提取对象类型草案（```json {"type":"object_type_draft",...} ```）
function extractDraft(text: string): any | null {
  const re = /```json\s*([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text || '')) !== null) {
    try {
      const obj = JSON.parse(m[1]);
      if (
        obj &&
        (obj.type === 'object_type_draft' || obj.type === 'link_type_draft') &&
        obj.apiName &&
        (obj.type === 'link_type_draft' || Array.isArray(obj.properties))
      ) return obj;
    } catch { /* 非 JSON 块，忽略 */ }
  }
  return null;
}

// 用户点击「确认创建」：落库对象类型 + 同步实例
async function confirmDraft(m: any) {
  if (!m?.draft || m.draftCreating) return;
  m.draftCreating = true;
  m.draftResult = null;
  const isLink = m.draft.type === 'link_type_draft';
  try {
    const r: any = isLink
      ? await s2.createLinkTypeFromDraft(m.draft, true)
      : await s2.createObjectTypeFromDraft(m.draft, true);
    m.draftResult = r;
    const kind = isLink ? '关系类型' : '对象类型';
    if (r?.sync?.error) {
      ElMessage.warning(`${kind} ${m.draft.apiName} 已创建，但关系/实例同步失败：${r.sync.error}`);
    } else {
      ElMessage.success(`已创建${kind} ${m.draft.apiName}，同步 ${r?.sync?.written ?? 0} 条${isLink ? '关系实例' : '实例'}`);
    }
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.message || '创建失败';
    m.draftResult = { error: msg };
    ElMessage.error(msg);
  } finally {
    m.draftCreating = false;
  }
}

async function send() {
  const text = input.value.trim();
  if (!text || streaming.value) return;

  // 首条消息：若无当前会话则自动新建
  let convId = currentConvId.value;
  if (!convId) {
    try {
      const conv = await api.createConversation(currentId.value, deriveTitle(text));
      conversations.value.unshift(conv);
      currentConvId.value = conv.id;
      convId = conv.id;
    } catch (e: any) {
      ElMessage.error(e?.message || '创建会话失败');
      return;
    }
  }

  // 多轮上下文：把已有会话（用户 + AI 文本）带给模型，支撑"AI 追问 → 用户回答"的建模流程
  const history = messages.value
    .filter((m) => (m.content || '').trim().length > 0)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    .slice(-20);                       // C 方案：只带最近 20 条
  while (history.length && history[0].role !== 'user') history.shift();

  messages.value.push({ role: 'user', content: text });
  input.value = '';
  await nextTick();
  scrollDown();

  const aiMsg = reactive({ role: 'ai' as const, content: '', timeline: [] as any[], curThink: '', draft: undefined as any, stopped: false });
  messages.value.push(aiMsg);
  streaming.value = true;

  const assistant: { id?: string; tool: string; args: unknown; result: unknown }[] = [];
  let reply = '';
  abortCtl = new AbortController();

  // 将当前累积的思考段落收尾为一个独立 think 框（按时间顺序插入 timeline）
  const flushThink = () => {
    if (aiMsg.curThink.trim()) {
      aiMsg.timeline.push({ kind: 'thought', content: aiMsg.curThink });
      aiMsg.curThink = '';
    }
  };

  try {
    await api.streamRun(
      currentId.value,
      text,
      (ev: any) => {
        if (ev.type === 'thought') {
          // 逐 token 累积到当前思考段落（不强制换行）
          aiMsg.curThink += ev.content;
        } else if (ev.type === 'action') {
          // 思考被工具调用打断 → 收尾当前 think 框，再插入工具调用（保持时间顺序）
          flushThink();
          const step = { id: ev.id, tool: ev.tool, args: ev.args, result: undefined };
          assistant.push(step);
          aiMsg.timeline.push({ kind: 'action', step });
        } else if (ev.type === 'result') {
          const step = assistant.find((s) => s.id === ev.id) || assistant[assistant.length - 1];
          if (step) step.result = ev.result;
          // 回填 timeline 中对应 action 条目的结果
          for (let k = aiMsg.timeline.length - 1; k >= 0; k--) {
            if (aiMsg.timeline[k].kind === 'action' && aiMsg.timeline[k].step.id === ev.id) {
              aiMsg.timeline[k].step.result = ev.result;
              break;
            }
          }
        } else if (ev.type === 'reply_chunk') {
          // 思考被最终回复打断 → 收尾当前 think 框
          flushThink();
          reply += ev.content;
          aiMsg.content = reply;
        } else if (ev.type === 'done') {
          flushThink();
          aiMsg.content = reply || ev.reply || '';
          aiMsg.draft = extractDraft(aiMsg.content) ?? undefined;
        } else if (ev.type === 'error') {
          flushThink();
          aiMsg.content = '⚠️ ' + ev.message;
        }
        scrollDown();
      },
      history,
      undefined,
      abortCtl.signal,
      convId ?? undefined,
    );
  } catch (e: any) {
    const aborted = e?.name === 'AbortError' || /abort/i.test(e?.message || '');
    if (aborted) {
      // 用户主动停止：保留已生成内容，只标记"已停止"，不当作错误
      aiMsg.stopped = true;
    } else {
      aiMsg.content = '⚠️ ' + (e.message || '对话失败');
    }
  } finally {
    streaming.value = false;
    abortCtl = null;
  }
}

// 由首条消息推导会话标题（取前 20 个非换行字符）
function deriveTitle(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim().slice(0, 20);
  return t || '新会话';
}

function stopStream() {
  abortCtl?.abort();
}

// 清空对话 = 新建会话（旧会话仍保留在列表中）
function clearChat() {
  newConversation();
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

// 计算当前时间线条目之前共有几次思考，用于「思考 N」序号
// 思考块展开状态（默认展开，可单个或全部收起）
const thoughtOpen = reactive<Record<string, boolean>>({});
function isThoughtOpen(msgIndex: number, k: number): boolean {
  // 已完成的思考默认收起（节省空间）；用户点击后再展开
  return thoughtOpen[`${msgIndex}-${k}`] === true;
}
function toggleThought(msgIndex: number, k: number) {
  thoughtOpen[`${msgIndex}-${k}`] = !isThoughtOpen(msgIndex, k);
}
function setAllThoughts(msgIndex: number, open: boolean) {
  const m = messages.value[msgIndex];
  (m?.timeline ?? []).forEach((t: any, k: number) => {
    if (t.kind === 'thought') thoughtOpen[`${msgIndex}-${k}`] = open;
  });
}
const toolOpen = reactive<Record<string, boolean>>({});
function isToolOpen(msgIndex: number, k: number): boolean {
  return toolOpen[`${msgIndex}-${k}`] === true;
}
function toggleTool(msgIndex: number, k: number) {
  toolOpen[`${msgIndex}-${k}`] = !isToolOpen(msgIndex, k);
}
function setAllTools(msgIndex: number, open: boolean) {
  const m = messages.value[msgIndex];
  (m?.timeline ?? []).forEach((t: any, k: number) => {
    if (t.kind === 'action') toolOpen[`${msgIndex}-${k}`] = open;
  });
}
async function copyJson(value: unknown): Promise<void> {
  const text = pretty(value);
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('已复制');
  } catch {
    ElMessage.warning('复制失败，请手动选择');
  }
}

function toolPreview(args: unknown): string {
  if (args === undefined || args === null) return '无参数';
  if (typeof args === 'object' && Object.keys(args as Record<string, unknown>).length === 0) return '无参数';
  const text = typeof args === 'string' ? args : JSON.stringify(args);
  const compact = (text ?? '').replace(/\s+/g, ' ').trim();
  return compact.length > 90 ? `${compact.slice(0, 90)}…` : compact;
}

function thoughtPreview(content: string): string {
  const text = (content ?? '').replace(/\s+/g, ' ').trim();
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

function thoughtCount(m: any): number {
  return (m?.timeline ?? []).filter((t: any) => t.kind === 'thought').length;
}
function actionCount(m: any): number {
  return (m?.timeline ?? []).filter((t: any) => t.kind === 'action').length;
}

function thinkIndex(timeline: any[] | undefined, cur: number): number {
  const list = timeline ?? [];
  let n = 0;
  for (let k = 0; k <= cur; k++) if (list[k]?.kind === 'thought') n++;
  return n;
}

onMounted(async () => {
  try {
    await loadAgents();
  } catch {
    agents.value = [];
  }
});
</script>

<style scoped>
.aip-layout { display: flex; height: calc(100vh - 120px); }

/* 中间会话栏 */
.conv-sidebar {
  width: 260px;
  border-right: 1px solid #ebeef5;
  padding: 14px 12px;
  overflow-y: auto;
  background: #fbfbfc;
  display: flex;
  flex-direction: column;
}
.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 2px;
}
.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text, #303133);
}
.sidebar-head :deep(.el-button) {
  padding: 4px 10px;
  font-size: 12px;
}
.conv-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.conv-item {
  position: relative;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background .15s, border-color .15s;
}
.conv-item:hover { background: #f2f4f7; }
.conv-item.active { background: #ecf5ff; border-color: #a0cfff; }
.conv-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 26px;
}
.conv-time {
  font-size: 12px;
  color: #909399;
  margin-top: 3px;
}
.conv-del {
  position: absolute;
  top: 8px;
  right: 6px;
  opacity: 0;
  transition: opacity .15s;
  color: #909399;
  padding: 2px 4px;
}
.conv-item:hover .conv-del,
.conv-item.active .conv-del { opacity: 1; }
.conv-del:hover { color: #f56c6c; }
.conv-empty { text-align: center; font-size: 13px; padding-top: 40px; line-height: 1.8; }

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
.msg-body { min-width: 0; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; }
.msg.user .msg-body { align-items: flex-end; max-width: 70%; }

.bubble { padding: 10px 14px; border-radius: 10px; line-height: 1.6; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; }
.bubble.user { background: #409eff; color: #fff; border-radius: 10px 10px 2px 10px; }
.bubble.ai { background: #fff; border: 1px solid #ebeef5; border-radius: 10px 10px 10px 2px; width: fit-content; max-width: 100%; box-sizing: border-box; }
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

/* 折叠面板：参考终端风格（▸ 箭头左侧 + 粗体标题 + 深色代码块）——紧凑间距 */
.think-collapse, .steps-collapse { margin-bottom: 1px; border: none; background: transparent; }
.think-collapse :deep(.el-collapse-item__header),
.steps-collapse :deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  height: auto;
  line-height: 1.4;
  padding: 1px 0;
  display: flex;
  align-items: center;
}
.think-collapse :deep(.el-collapse-item__wrap),
.steps-collapse :deep(.el-collapse-item__wrap) { background: transparent; border: none; }
.think-collapse :deep(.el-collapse-item__content),
.steps-collapse :deep(.el-collapse-item__content) { padding: 0 0 1px; }
/* 标题文字：粗体、深色 */
.collapse-title { font-size: 13px; font-weight: 600; color: #303133; }
/* 箭头强制放到左侧 */
.think-collapse :deep(.el-collapse-item__arrow),
.steps-collapse :deep(.el-collapse-item__arrow) {
  margin-left: 0;
  margin-right: 5px;
  order: -1;
  font-size: 12px;
  color: #606266;
}
/* 确保 header 是 flex 且方向正常 */
.think-collapse :deep(.el-collapse-item__header),
.steps-collapse :deep(.el-collapse-item__header) {
  display: flex !important;
  align-items: center;
  flex-direction: row;
}

/* 思考链：浅灰字，直接显示 */
.thinking { color: #909399; white-space: pre-wrap; word-break: break-word; font-size: 13px; padding: 0; background: transparent; line-height: 1.55; max-height: 300px; overflow-y: auto; }

/* 工具步骤：浅色 JSON 代码块（参考 DSH 风格） */
.step { margin-bottom: 1px; padding: 0; background: transparent; width: 100%; box-sizing: border-box; }
.step:last-child { margin-bottom: 0; }
.step-detail { margin-top: 2px; }
.step-label-row {
  display: flex; align-items: center; justify-content: space-between;
  margin: 8px 0 4px;
}
.step-label { font-size: 12px; color: #6b7280; }
.step-args, .step-result {
  margin: 0;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.55;
  color: #1f2328;
  background: #f6f8fa;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  max-height: 300px;
  overflow: auto;
}
.step-result { max-height: 320px; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

.composer { margin-top: 10px; }
.composer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.muted { color: #909399; }
.small { font-size: 12px; }
.stopped-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.draft-card {
  margin-top: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  background: var(--surface);
}
.draft-title { font-weight: 600; font-size: 13px; margin-bottom: 6px; }
.draft-meta { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
.draft-props { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.draft-prop {
  display: inline-flex; gap: 4px; align-items: center;
  font-size: 11px; border: 1px solid var(--border); border-radius: 4px;
  padding: 2px 6px; background: var(--accent-soft);
}
.draft-prop-type { color: var(--text-muted); }
.draft-prop-src { color: var(--text-secondary); }
.draft-result { margin-top: 8px; font-size: 12px; color: var(--text-secondary); }
.draft-err { color: #dc2626; }

.timeline-toolbar {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--text-muted);
  margin-bottom: 6px;
}
.timeline-toolbar .tl-stat { margin-right: auto; }
.tool-block {
  width: 100%; align-self: stretch;
  border: 1px solid var(--border, #e4e7ed);
  border-radius: 6px;
  background: var(--surface, #fff);
  margin-bottom: 6px;
  overflow: hidden;
}
.tool-block__head {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; cursor: pointer; user-select: none;
  font-size: 13px; font-weight: 500;
}
.tool-block__head:hover { background: var(--el-fill-color-light, #f5f7fa); }
.tool-block .step { padding: 0 10px 8px; }
.step-label { font-size: 12px; color: var(--text-muted); margin: 6px 0 2px; }
.tool-block .step-args, .tool-block .step-result { margin: 0; }
.think-block {
  width: 100%; align-self: stretch;
  border: 1px solid var(--border, #e4e7ed);
  border-radius: 6px;
  background: var(--el-fill-color-lighter, #fafafa);
  margin-bottom: 6px;
  overflow: hidden;
}
.think-block__head {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; cursor: pointer; user-select: none;
  font-size: 13px; font-weight: 500;
}
.think-preview {
  flex: 1; min-width: 0;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  font-size: 12px; font-weight: 400; color: var(--text-muted);
}
.think-toggle { flex-shrink: 0; }
.think-block__head:hover { background: var(--el-fill-color-light, #f5f7fa); }
.think-toggle { font-size: 12px; color: var(--el-color-primary, #409eff); }
.think-block .thinking {
  padding: 0 10px 8px;
  font-size: 13px; line-height: 1.6;
  color: var(--text-muted);
  white-space: pre-wrap;
  max-height: 360px; overflow: auto;
}
.think-block--live { border-style: dashed; }
</style>
