<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElIcon, ElTag } from 'element-plus';
import { Connection, Coin, Share, DataLine, Cpu, Operation, Files, CollectionTag, SetUp } from '@element-plus/icons-vue';
import { s2, s2link, s1, s2shared, s2functions, s2actions, valtype } from '@/api';
import { tryRequest } from '@/utils/error';

const router = useRouter();
const stats = ref({
  objects: 0, links: 0, connections: 0,
  shared: 0, valueTypes: 0, functions: 0, actions: 0, rules: 0,
});

async function load() {
  await tryRequest(async () => {
    const [o, l, c, sp, vt, fn, ac, ru] = await Promise.all([
      s2.listObjectTypes(), s2link.listLinkTypes(), s1.listConnections(),
      s2shared.list(), valtype.list(), s2functions.list(), s2actions.list(), s2.listRules(),
    ]);
    stats.value = {
      objects: o.length, links: l.length, connections: c.length,
      shared: sp.length, valueTypes: vt.length, functions: fn.length,
      actions: ac.length, rules: ru.length,
    };
  });
}

// 卡片顺序：数据源 → 对象/关系 → 建模语义（共享属性/值类型）→ 逻辑与自动化（函数/动作/规则）
const cards = [
  { key: 'connections', stat: 'connections', title: '数据源', desc: '管理数据库连接与同步', icon: Connection, to: '/s1/connections' },
  { key: 'objects', stat: 'objects', title: '对象类型', desc: '定义本体中的实体类型', icon: Coin, to: '/s2/object-types' },
  { key: 'links', stat: 'links', title: '关系类型', desc: '定义对象之间的关联', icon: Share, to: '/s2/link-types' },
  { key: 'shared', stat: 'shared', title: '共享属性', desc: '跨对象复用的属性定义', icon: Files, to: '/s2/shared-properties' },
  { key: 'value-types', stat: 'valueTypes', title: '值类型', desc: '语义类型与枚举/范围/正则约束', icon: CollectionTag, to: '/s2/value-types' },
  { key: 'functions', stat: 'functions', title: '函数', desc: '可复用的业务逻辑（只读计算 / 可写动作）', icon: Cpu, to: '/s2/functions' },
  { key: 'actions', stat: 'actions', title: '动作', desc: '对本体执行变更的操作', icon: Operation, to: '/s2/actions' },
  { key: 'rules', stat: 'rules', title: '规则', desc: '按周期/事件触发的自动化（告警、通知、重算）', icon: SetUp, to: '/s2/rules' },
] as const;

const statTiles = [
  { key: 'objects', label: '对象类型' },
  { key: 'links', label: '关系类型' },
  { key: 'shared', label: '共享属性' },
  { key: 'valueTypes', label: '值类型' },
  { key: 'functions', label: '函数' },
  { key: 'actions', label: '动作' },
  { key: 'rules', label: '规则' },
  { key: 'connections', label: '数据源' },
] as const;

onMounted(load);
</script>

<template>
  <div class="overview">
    <header class="overview__hero">
      <div class="overview__badge"><ElIcon><DataLine /></ElIcon></div>
      <div>
        <h1 class="overview__title">Ontology Manager</h1>
        <p class="overview__sub">统一管理数据源映射、对象与关系、语义类型、函数、动作与自动化规则</p>
      </div>
    </header>

    <section class="overview__stats">
      <div v-for="s in statTiles" :key="s.key" class="stat">
        <span class="stat__num">{{ (stats as any)[s.key] }}</span>
        <span class="stat__label">{{ s.label }}</span>
      </div>
    </section>

    <section class="overview__cards">
      <ElCard
        v-for="c in cards"
        :key="c.key"
        class="entry-card"
        shadow="hover"
        @click="router.push(c.to)"
      >
        <div class="entry-card__top">
          <div class="entry-card__icon"><ElIcon><component :is="c.icon" /></ElIcon></div>
          <ElTag size="small" type="info">{{ (stats as any)[c.stat] }}</ElTag>
        </div>
        <div class="entry-card__body">
          <h3>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
        </div>
      </ElCard>
    </section>
  </div>
</template>

<style scoped>
.overview {
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.overview__hero {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.overview__badge {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 28px;
}
.overview__title {
  margin: 0;
  font-size: 24px;
}
.overview__sub {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}
.overview__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: var(--space-2);
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat__num {
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
}
.stat__label {
  font-size: 12px;
  color: var(--text-muted);
}
.overview__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-3);
}
.entry-card {
  cursor: pointer;
}
.entry-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}
.entry-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.entry-card__body h3 {
  margin: 0 0 4px;
  font-size: 15px;
}
.entry-card__body p {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
