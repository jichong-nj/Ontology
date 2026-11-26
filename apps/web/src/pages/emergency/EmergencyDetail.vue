<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { emergency } from '@/api';

use([CanvasRenderer, GraphChart, TooltipComponent, LegendComponent]);

const route = useRoute();
const router = useRouter();
const caseId = computed(() => decodeURIComponent(String(route.params.id || '')));
const detail = ref<any>(null);
const graph = ref<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
const candidates = ref<any[]>([]);
const extracted = ref<any[]>([]);
const analysis = ref<any>(null);
const analyzing = ref(false);
const analysisVisible = ref(false);
const tasks = ref<any[]>([]);
const loading = ref(false);
const selected = ref<any>(null);
const selectedKind = ref<'node' | 'edge' | null>(null);

const closeVisible = ref(false);
const closing = ref(false);
const drafting = ref(false);
const closeForm = ref({ closureType: 'normal', note: '', finalText: '' });

const typeColors: Record<string, string> = {
  EmergencyResponse: '#f56c6c',
  PublicOpinionEvent: '#e6a23c',
  Document: '#409eff',
  Organization: '#67c23a',
  Employee: '#909399',
  DispatchRecord: '#8e44ad',
  BorrowRecord: '#16a085',
  VerificationTask: '#d35400',
  InspectionTask: '#c0392b',
  VerificationResponse: '#2c3e50',
  InspectionReport: '#2c3e50',
};

const categories = computed(() => [...new Set(graph.value.nodes.map((n) => n.type))].map((t) => ({ name: t, itemStyle: { color: typeColors[t] ?? '#606266' } })));

const option = computed(() => {
  const catIndex = new Map(categories.value.map((c, i) => [c.name, i]));
  const nodes = graph.value.nodes.map((n) => ({
    id: n.id,
    name: n.label,
    category: catIndex.get(n.type) ?? 0,
    symbolSize: n.type === 'EmergencyResponse' ? 46 : n.type === 'PublicOpinionEvent' ? 38 : n.type.includes('Record') ? 26 : 32,
    value: n.properties,
    itemStyle: selectedKind.value === 'node' && selected.value?.id === n.id ? { borderColor: '#f56c6c', borderWidth: 3 } : undefined,
  }));
  const links = graph.value.edges.map((e) => ({
    source: e.source,
    target: e.target,
    label: { show: graph.value.edges.length <= 24, formatter: e.label, fontSize: 10 },
    lineStyle: { curveness: 0.12, opacity: 0.7 },
    value: e,
  }));
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => p.dataType === 'edge'
        ? `${p.data.value.label}`
        : `<b>${p.data.name}</b><br/>${p.data.category !== undefined ? categories.value[p.data.category]?.name ?? '' : ''}`,
    },
    legend: [{ type: 'scroll', data: categories.value.map((c) => c.name), bottom: 4, left: 'center', itemGap: 8, itemWidth: 10, itemHeight: 8, textStyle: { fontSize: 10 } }],
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true, top: 12, bottom: 34,
      force: { repulsion: 260, edgeLength: [90, 180], gravity: 0.08 },
      data: nodes, links,
      categories: categories.value,
      label: { show: true, position: 'right', fontSize: 11, formatter: (p: any) => p.data.name },
      emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
      lineStyle: { color: 'source', curveness: 0.12 },
    }],
  };
});

async function load() {
  loading.value = true;
  try {
    const id = caseId.value;
    const [c, g, cand, t, ex, an] = await Promise.all([
      emergency.getCase(id), emergency.graph(id), emergency.candidates(id), emergency.tasks(id), emergency.extracted(id), emergency.analysis(id),
    ]);
    detail.value = c; graph.value = g; candidates.value = cand; tasks.value = t; extracted.value = ex; analysis.value = an;
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败');
  } finally { loading.value = false; }
}

function onChartClick(p: any) {
  if (p.dataType === 'node') {
    selectedKind.value = 'node';
    selected.value = graph.value.nodes.find((n) => n.id === p.data.id) ?? null;
  } else if (p.dataType === 'edge') {
    selectedKind.value = 'edge';
    selected.value = p.data.value;
  }
}

async function accept(c: any) {
  await emergency.acceptCandidate(c.id);
  ElMessage.success('已加入数据池');
  await load();
}
async function acceptExtracted(e: any) {
  await emergency.acceptExtracted(e.id);
  ElMessage.success('已接受');
  await load();
}
async function rejectExtracted(e: any) {
  await emergency.rejectExtracted(e.id);
  ElMessage.success('已忽略');
  await load();
}
async function reject(c: any) {
  await emergency.rejectCandidate(c.id);
  ElMessage.success('已忽略');
  await load();
}
async function receive(t: any) {
  await emergency.receiveTask(t.objectRid);
  ElMessage.success('已接收');
  await load();
}
async function submit(t: any) {
  const { value } = await ElMessageBox.prompt(t.taskType === 'VerificationTask' ? '单位核查回复' : '检查报告', '模拟提交', {
    inputType: 'textarea', inputPlaceholder: '填写回复/报告内容', confirmButtonText: '提交',
  });
  await emergency.submitTask(t.objectRid, { contentText: value ?? '' });
  ElMessage.success('已提交');
  await load();
}
async function startInspection() {
  const orgRid = selected.value?.id;
  const { value } = await ElMessageBox.prompt('检查原因', '发起检查', {
    inputType: 'textarea', inputPlaceholder: '说明为什么检查该单位', confirmButtonText: '发起',
  });
  await emergency.createInspection(orgRid ? caseId.value : caseId.value, {
    orgRid, documentRids: [], reason: value ?? '',
  });
  ElMessage.success('检查任务已创建');
  await load();
}
async function runAnalysis() {
  analyzing.value = true;
  try {
    await emergency.analyze(caseId.value);
    ELMessageReload();
  } catch (e: any) { ElMessage.error(e.message || 'AI 研判失败'); }
  finally { analyzing.value = false; }
}
function ELMessageReload() { ElMessage.success('AI 研判完成'); analysisVisible.value = true; load(); }
async function applyAnalysis() {
  if (!analysis.value?.id) return;
  await emergency.applyAnalysis(analysis.value.id);
  ElMessage.success('已应用到数据池');
  analysisVisible.value = false;
  await load();
}
function targetLabel(rid: string) {
  return graph.value.nodes.find((n) => n.id === rid)?.label ?? rid;
}
async function makeDraft() {
  drafting.value = true;
  try {
    const r = await emergency.closureDraft(caseId.value);
    closeForm.value.finalText = r.text || '';
    ElMessage.success('AI 草稿已生成');
  } catch (e: any) { ElMessage.error(e.message || '生成失败'); }
  finally { drafting.value = false; }
}
async function closeCase() {
  closing.value = true;
  try {
    await emergency.closeCase(caseId.value, closeForm.value);
    ElMessage.success('案件已结束');
    closeVisible.value = false;
    await load();
  } catch (e: any) { ElMessage.error(e.message || '结案失败'); }
  finally { closing.value = false; }
}

function fmt(v: any): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

watch(caseId, load);
onMounted(load);
</script>

<template>
  <div class="em-detail" v-loading="loading">
    <div class="head">
      <div>
        <h2>{{ detail?.title || '应急响应' }}</h2>
        <div class="meta">
          <el-tag size="small" type="danger">{{ detail?.level || '—' }}</el-tag>
          <el-tag size="small" :type="detail?.status === 'in_progress' ? 'warning' : 'info'">
            {{ detail?.status === 'in_progress' ? '进行中' : '已结束' }}
          </el-tag>
          <span class="muted">{{ caseId }}</span>
        </div>
      </div>
      <div class="actions">
        <el-button @click="load">刷新</el-button>
        <el-button type="danger" :disabled="detail?.status === 'closed'" @click="closeVisible = true">结束应急响应</el-button>
      </div>
    </div>

    <div class="body">
      <div class="graph-wrap">
        <VChart :option="option" autoresize class="graph" @click="onChartClick" />
        <div class="legend-hint">点击节点/关系查看详情；滚轮缩放、拖拽平移</div>
        <div class="ai-card">
          <div class="ai-head">🤖 AI 研判</div>
          <div v-if="analysis" class="ai-summary">{{ analysis.summary }}</div>
          <div v-else class="ai-summary muted">还没有研判结果</div>
          <div class="ai-ops">
            <el-button size="small" :loading="analyzing" @click="runAnalysis">{{ analysis ? '重新生成' : '开始研判' }}</el-button>
            <el-button v-if="analysis" size="small" type="primary" @click="analysisVisible = true">查看报告</el-button>
          </div>
        </div>
      </div>

      <aside class="side">
        <template v-if="selected">
          <div class="side-head">
            <b>{{ selectedKind === 'node' ? selected.label : selected.label }}</b>
            <el-button link @click="selected = null; selectedKind = null">清除</el-button>
          </div>
          <div class="side-type">{{ selectedKind === 'node' ? selected.type : `关系：${selected.linkType}` }}</div>
          <template v-if="selectedKind === 'node'">
            <el-button v-if="selected.type === 'Organization'" size="small" type="danger" style="margin-bottom: 8px" @click="startInspection">发起检查</el-button>
            <div v-for="(v, k) in selected.properties" :key="k" class="prop-row">
              <span class="prop-key">{{ k }}</span><span class="prop-val">{{ fmt(v) }}</span>
            </div>
          </template>
          <template v-else>
            <div class="prop-row"><span class="prop-key">source</span><span class="prop-val">{{ selected.source }}</span></div>
            <div class="prop-row"><span class="prop-key">target</span><span class="prop-val">{{ selected.target }}</span></div>
            <div class="prop-row"><span class="prop-key">label</span><span class="prop-val">{{ selected.label }}</span></div>
          </template>
        </template>
        <template v-else>
          <div class="side-head"><b>案件概览</b></div>
          <p class="summary">{{ detail?.summary || '暂无摘要' }}</p>
          <div class="stat">数据池实体：{{ detail?.refs?.length ?? 0 }}</div>
          <div class="stat">待办任务：{{ tasks.filter((t: any) => t.status !== 'submitted').length }}</div>
        </template>

        <div class="side-section">
          <div class="side-head"><b>AI 抽取候选</b></div>
          <div v-if="!extracted.filter((e: any) => e.status === 'pending').length" class="muted">暂无待确认抽取</div>
          <div v-for="e in extracted.filter((e: any) => e.status === 'pending')" :key="e.id" class="cand">
            <div class="cand-title">[{{ e.entityType }}] {{ e.value }}</div>
            <div class="cand-meta">置信度 {{ e.confidence ?? '—' }} · {{ e.rawText }}</div>
            <div class="cand-ops">
              <el-button size="small" type="primary" @click="acceptExtracted(e)">接受</el-button>
              <el-button size="small" @click="rejectExtracted(e)">忽略</el-button>
            </div>
          </div>
        </div>

        <div class="side-section">
          <div class="side-head"><b>文档候选</b></div>
          <div v-if="!candidates.filter((c: any) => c.status === 'pending').length" class="muted">暂无待确认候选</div>
          <div v-for="c in candidates.filter((c: any) => c.status === 'pending')" :key="c.id" class="cand">
            <div class="cand-title">{{ c.document?.title || c.documentRid }}</div>
            <div class="cand-meta">匹配度 {{ c.matchScore ?? '—' }} · {{ c.reason }}</div>
            <div class="cand-ops">
              <el-button size="small" type="primary" @click="accept(c)">加入数据池</el-button>
              <el-button size="small" @click="reject(c)">忽略</el-button>
            </div>
          </div>
        </div>

        <div class="side-section">
          <div class="side-head"><b>处置任务</b></div>
          <div v-if="!tasks.length" class="muted">暂无任务</div>
          <div v-for="t in tasks" :key="t.objectRid" class="task">
            <div class="task-title">{{ t.taskType === 'VerificationTask' ? '单位核查' : '检查任务' }} · {{ t.orgRid }}</div>
            <div class="task-meta">{{ t.status }} · {{ t.reason }}</div>
            <div class="task-ops">
              <el-button v-if="t.status === 'pending'" size="small" @click="receive(t)">模拟接收</el-button>
              <el-button v-if="t.status !== 'submitted'" size="small" type="primary" @click="submit(t)">模拟提交</el-button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <el-dialog v-model="analysisVisible" title="AI 研判报告" width="680px">
      <template v-if="analysis">
        <h4>结论</h4>
        <p class="ai-text">{{ analysis.summary }}</p>
        <h4>风险目标</h4>
        <div v-if="!analysis.findings?.length" class="muted">暂无风险目标</div>
        <div v-for="f in analysis.findings" :key="f.id" class="finding">
          <div class="finding-head">
            <b>{{ targetLabel(f.targetRid) }}</b>
            <el-tag size="small" :type="f.level === 'high' ? 'danger' : f.level === 'medium' ? 'warning' : 'info'">
              {{ f.score }} 分
            </el-tag>
          </div>
          <ul><li v-for="(r, i) in f.reasons" :key="i">{{ r }}</li></ul>
        </div>
      </template>
      <template #footer>
        <el-button @click="analysisVisible = false">关闭</el-button>
        <el-button :loading="analyzing" @click="runAnalysis">重新生成</el-button>
        <el-button type="primary" @click="applyAnalysis">一键刷新到数据池</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="closeVisible" title="结束应急响应" width="560px">
      <el-form label-width="90px">
        <el-form-item label="结案类型">
          <el-select v-model="closeForm.closureType" style="width: 180px">
            <el-option label="正常办结" value="normal" />
            <el-option label="中途办结" value="midway" />
            <el-option label="异常办结" value="abnormal" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="closeForm.note" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="结案报告">
          <el-input v-model="closeForm.finalText" type="textarea" :rows="6" placeholder="可手动填写，或点击下方生成 AI 草稿" />
          <el-button size="small" style="margin-top: 6px" :loading="drafting" @click="makeDraft">AI 生成草稿</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeVisible = false">取消</el-button>
        <el-button type="danger" :loading="closing" @click="closeCase">确认结束</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.em-detail { height: 100%; display: flex; flex-direction: column; padding: 16px 20px; box-sizing: border-box; }
.head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.head h2 { margin: 0 0 6px; font-size: 20px; }
.meta { display: flex; gap: 8px; align-items: center; }
.muted { color: #909399; font-size: 12px; }
.actions { display: flex; gap: 8px; }
.body { flex: 1; display: flex; gap: 12px; min-height: 0; }
.graph-wrap { flex: 1; border: 1px solid #ebeef5; border-radius: 8px; position: relative; min-width: 0; background: #fff; }
.graph { width: 100%; height: 100%; min-height: 560px; }
.legend-hint { position: absolute; left: 12px; top: 8px; color: #909399; font-size: 12px; }
.ai-card { position: absolute; right: 12px; top: 12px; width: 260px; background: #fff; border: 1px solid #e4e7ed; border-radius: 8px; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
.ai-head { font-weight: 600; margin-bottom: 6px; }
.ai-summary { font-size: 12px; color: #606266; line-height: 1.5; max-height: 90px; overflow: hidden; }
.ai-ops { margin-top: 8px; display: flex; gap: 6px; }
.ai-text { font-size: 13px; line-height: 1.7; color: #303133; }
.finding { border: 1px solid #f0f0f0; border-radius: 6px; padding: 8px; margin-top: 8px; }
.finding-head { display: flex; justify-content: space-between; align-items: center; }
.finding ul { margin: 6px 0 0; padding-left: 18px; color: #606266; font-size: 12px; }
.side { width: 340px; border: 1px solid #ebeef5; border-radius: 8px; padding: 12px; overflow-y: auto; background: #fff; }
.side-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.side-type { color: #909399; font-size: 12px; margin-bottom: 8px; }
.prop-row { display: flex; gap: 8px; padding: 4px 0; border-bottom: 1px dashed #f0f0f0; font-size: 12px; }
.prop-key { color: #909399; min-width: 90px; }
.prop-val { word-break: break-all; }
.summary { color: #606266; font-size: 13px; line-height: 1.6; }
.stat { font-size: 13px; margin-top: 4px; }
.side-section { margin-top: 14px; border-top: 1px solid #f0f0f0; padding-top: 10px; }
.cand, .task { border: 1px solid #f0f0f0; border-radius: 6px; padding: 8px; margin-top: 8px; }
.cand-title, .task-title { font-weight: 600; font-size: 13px; }
.cand-meta, .task-meta { color: #909399; font-size: 12px; margin-top: 2px; }
.cand-ops, .task-ops { margin-top: 6px; display: flex; gap: 6px; }
</style>
