<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElButton, ElCard, ElTag, ElCollapse, ElCollapseItem, ElAlert } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();

const codeSnippets = {
  template: `// 函数体统一约定：返回一个 (args, ctx) => { ... } 的函数
//   args: 调用方（规则 / API / 动作）传入的参数字典
//   ctx:  运行时注入的本体访问上下文
return async (args, ctx) => {
  // 业务逻辑...
  return { ok: true };
};`,
  readObjects: `// 读取某对象类型的全部实例属性
const employees = await ctx.objects('Employee');
// employees: [{ objectRid, properties: { name, workHours, ... } }]

// 等价写法（更底层，可读关系 / 计算派生属性）
const repo = ctx.repo;
const emps = await repo.listObjectProperties('Employee');`,
  readLinks: `// 读取某关系类型的全部实例
const links = await ctx.links('EmployeeDepartment');
// links: [{ sourceRid, targetRid }]

// 建立映射：员工 -> 部门
const empDept = new Map();
for (const l of links) empDept.set(l.sourceRid, l.targetRid);`,
  computeDerived: `// 计算某实例的派生属性（如部门平均工时、员工累计请假天数）
// 派生属性由对象类型的 reducer 实时计算，不落库
const r = await ctx.repo.computeDerived('Department', 'avgWorkHours', deptRid);
const avg = Number(r.value); // 计算失败会抛错，建议 try/catch`,
  writePatch: `// 把计算结果写入本体可写侧（不会回写只读数据源）
await ctx.repo.writeObjectPatch('Employee', employeeRid, {
  riskScore: score,
  riskLevel: 'medium',
}, 'function:myFunc');
// 参数：objectType, objectRid, properties, actor(操作者标识)`,
  completeExample: `// 示例：统计每个部门的人数并写入对象的 deptCount 属性
return async (args, ctx) => {
  const { repo } = ctx;
  const LINK = 'EmployeeDepartment';
  const members = await repo.listLinkInstances(LINK); // { sourceRid, targetRid }

  // 部门 -> 人数
  const count = new Map();
  for (const m of members) count.set(m.targetRid, (count.get(m.targetRid) || 0) + 1);

  for (const [deptRid, n] of count) {
    await repo.writeObjectPatch('Department', deptRid, { deptCount: n }, 'function:countDept');
  }
  return { departments: count.size };
};`,
};
</script>

<template>
  <div class="help-page">
    <header class="help-header">
      <ElButton :icon="ArrowLeft" text @click="router.push('/s2/functions')">返回函数列表</ElButton>
      <h1>函数编写指南</h1>
      <p class="help-sub">Ontology S2 — 在「新建函数 / 编辑函数」中编写可在线执行的 TypeScript 函数</p>
    </header>

    <ElAlert type="info" :closable="false" show-icon class="help-alert">
      函数体必须以 <code>return (args, ctx) =&gt; { ... }</code> 形式编写，保存后即时生效，无需重启服务。
    </ElAlert>

    <section class="help-section">
      <h2><span class="step-num">1</span> 函数体约定</h2>
      <p>函数体是一个 <b>返回函数</b> 的表达式。外层 <code>return</code> 出 <code>(args, ctx)</code> 函数，运行时引擎会调用它并注入两个参数：</p>
      <ul>
        <li><code>args</code> — 调用方传入的参数（来自规则配置、手动调用或动作触发）。例：<code>args.threshold</code>、<code>args.departmentId</code>。</li>
        <li><code>ctx</code> — 运行时注入的本体访问上下文，提供读取对象 / 关系 / 计算派生 / 写入的能力。</li>
      </ul>
      <pre class="code-block">{{ codeSnippets.template }}</pre>
    </section>

    <section class="help-section">
      <h2><span class="step-num">2</span> ctx 提供的能力</h2>
      <p><code>ctx</code> 提供以下常用接口，帮助你读取和操作本体数据：</p>
      <ElCollapse class="help-collapse">
        <ElCollapseItem title="ctx.objects(objectType) — 读取对象实例" name="objects">
          <pre class="code-block">{{ codeSnippets.readObjects }}</pre>
        </ElCollapseItem>
        <ElCollapseItem title="ctx.links(linkType) — 读取关系实例" name="links">
          <pre class="code-block">{{ codeSnippets.readLinks }}</pre>
        </ElCollapseItem>
        <ElCollapseItem title="ctx.repo.computeDerived(...) — 计算派生属性" name="derived">
          <pre class="code-block">{{ codeSnippets.computeDerived }}</pre>
        </ElCollapseItem>
        <ElCollapseItem title="ctx.repo.writeObjectPatch(...) — 写入实例属性" name="write">
          <pre class="code-block">{{ codeSnippets.writePatch }}</pre>
        </ElCollapseItem>
      </ElCollapse>
    </section>

    <section class="help-section">
      <h2><span class="step-num">3</span> 入参 / 出参定义</h2>
      <div class="param-grid">
        <ElCard shadow="never" class="param-card">
          <template #header><b>入参（inputs）</b></template>
          <p>声明函数接收的参数，供规则 / 动作调用时透传。</p>
          <ul>
            <li><ElTag size="small">name</ElTag> 参数名，如 <code>threshold</code></li>
            <li><ElTag size="small">type</ElTag> string / number / boolean / object</li>
            <li><ElTag size="small">required</ElTag> 是否必填</li>
          </ul>
        </ElCard>
        <ElCard shadow="never" class="param-card">
          <template #header><b>出参（outputs）</b></template>
          <p>声明函数返回值的类型，便于其他功能理解返回结构。</p>
          <ul>
            <li>string / number / boolean / object / array</li>
            <li>返回结构示例：<code>{ flaggedCount: 3, flagged: [...] }</code></li>
          </ul>
        </ElCard>
      </div>
    </section>

    <section class="help-section">
      <h2><span class="step-num">4</span> 完整示例</h2>
      <p>一个统计各对象人数并回写属性的完整函数：</p>
      <pre class="code-block">{{ codeSnippets.completeExample }}</pre>
    </section>

    <section class="help-section">
      <h2><span class="step-num">5</span> 注意事项</h2>
      <ul class="tips">
        <li>函数是 <b>异步</b> 的，读取数据请使用 <code>await</code>。</li>
        <li>写入操作写到 <b>本体可写侧</b>（object_write），<b>不会回写只读数据源</b>。</li>
        <li>建议对 <code>computeDerived</code> 等可能失败的调用使用 <code>try/catch</code> 兜底。</li>
        <li>参数尽量提供默认值，例如 <code>const t = args.threshold ?? 0.8</code>，保证健壮性。</li>
        <li>保存后若语法错误，控制台 / 列表会提示；修正后重新保存即可。</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.help-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 32px;
}
.help-header {
  margin-bottom: 20px;
}
.help-header h1 {
  margin: 12px 0 4px;
  font-size: 22px;
}
.help-sub {
  color: var(--text-muted, #6b7280);
  margin: 0;
}
.help-alert {
  margin-bottom: 24px;
}
.help-alert code,
.help-section code {
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}
.help-section {
  margin-bottom: 28px;
}
.help-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  margin: 0 0 10px;
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.help-section p {
  color: #374151;
  line-height: 1.7;
  margin: 6px 0;
}
.help-section ul {
  padding-left: 20px;
  color: #374151;
  line-height: 1.9;
}
.code-block {
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12.5px;
  line-height: 1.6;
  margin: 10px 0;
}
.help-collapse :deep(.el-collapse-item__header) {
  font-weight: 500;
}
.param-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.param-card p {
  margin-top: 0;
}
.param-card ul {
  padding-left: 18px;
}
.tips li {
  margin-bottom: 6px;
}
</style>
