<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElIcon } from 'element-plus';
import { Connection, Coin, Share, DataLine, Cpu, Operation } from '@element-plus/icons-vue';
import { s2, s2link, s1 } from '@/api';
import { tryRequest } from '@/utils/error';

const router = useRouter();
const stats = ref({ objects: 0, links: 0, connections: 0 });

async function load() {
  await tryRequest(async () => {
    const [o, l, c] = await Promise.all([
      s2.listObjectTypes(), s2link.listLinkTypes(), s1.listConnections(),
    ]);
    stats.value = { objects: o.length, links: l.length, connections: c.length };
  });
}

const cards = [
  { key: 'connections', title: '数据源', desc: '管理数据库连接与同步', icon: Connection, to: '/s1/connections' },
  { key: 'objects', title: '对象类型', desc: '定义本体中的实体类型', icon: Coin, to: '/s2/object-types' },
  { key: 'links', title: '关系类型', desc: '定义对象之间的关联', icon: Share, to: '/s2/link-types' },
  { key: 'functions', title: '函数', desc: '可复用的业务逻辑（派生/告警/动作执行体）', icon: Cpu, to: '/s2/functions' },
  { key: 'actions', title: '动作', desc: '对本体执行变更的操作', icon: Operation, to: '/s2/actions' },
] as const;

onMounted(load);
</script>

<template>
  <div class="overview">
    <header class="overview__hero">
      <div class="overview__badge"><ElIcon><DataLine /></ElIcon></div>
      <div>
        <h1 class="overview__title">Ontology Manager</h1>
        <p class="overview__sub">统一管理对象类型、关系类型与数据源映射</p>
      </div>
    </header>

    <section class="overview__stats">
      <div class="stat">
        <span class="stat__num">{{ stats.objects }}</span>
        <span class="stat__label">对象类型</span>
      </div>
      <div class="stat">
        <span class="stat__num">{{ stats.links }}</span>
        <span class="stat__label">关系类型</span>
      </div>
      <div class="stat">
        <span class="stat__num">{{ stats.connections }}</span>
        <span class="stat__label">数据源</span>
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
        <div class="entry-card__icon"><ElIcon><component :is="c.icon" /></ElIcon></div>
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
  max-width: 960px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat__num {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
}
.stat__label {
  font-size: 13px;
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
  margin-bottom: var(--space-2);
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
