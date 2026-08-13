<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { s2shared } from '@/api';

const router = useRouter();
const route = useRoute();

// 左侧图标导航栏（48px 宽，纯图标）
const iconNav = [
  { icon: '🏠', key: 'home', label: 'Home', to: '/' },
  { icon: '🔌', key: 's1', label: 'Data Sources', to: '/s1/connections' },
  { icon: '📦', key: 's2', label: 'Ontology', to: '/s2/object-types' },
];

// 次级侧边面板菜单项（按 Palantir 分组）
interface MenuItem {
  key: string;
  label: string;
  to: string;
  count?: number;
  icon?: string;
}

interface MenuSection { title: string; items: MenuItem[]; }

// 根据当前顶级路由决定次级面板内容
const panelSections = computed<MenuSection[]>(() => {
  const path = route.path;
  if (path.startsWith('/s2')) {
    return [
      { title: 'Resources', items: [
        { key: 'obj-types', label: 'Object types', to: '/s2/object-types', icon: '📦' },
        { key: 'link-types', label: 'Link types', to: '/s2/link-types', icon: '🔗' },
        { key: 'functions', label: 'Functions', to: '/s2/functions', icon: '⚙️' },
        { key: 'actions', label: 'Actions', to: '/s2/actions', icon: '🚀' },
        { key: 'alerts', label: 'Alerts', to: '/s2/alerts', icon: '🔔' },
        { key: 'shared', label: 'Shared Properties', to: '/s2/shared-properties', icon: '🌐', count: sharedCount.value },
        { key: 'explore', label: 'Object Explorer', to: '/s2/explore', icon: '🧭' },
      ]},
    ];
  }
  if (path.startsWith('/s1')) {
    return [
      { title: 'Data Sources', items: [
        { key: 'connections', label: 'Connections', to: '/s1/connections', icon: '🔌' },
      ]},
    ];
  }
  // Home
  return [
    { title: 'Overview', items: [
      { key: 'overview', label: 'Dashboard', to: '/', icon: '🏠' },
    ]},
  ];
});

// 面板折叠状态
const panelCollapsed = ref(false);

// 共享属性数量（菜单徽标）
const sharedCount = ref(0);
function loadSharedCount() {
  s2shared.list().then((d) => { sharedCount.value = d.length; }).catch(() => { sharedCount.value = 0; });
}
onMounted(loadSharedCount);

// 当前激活的图标
const activeIcon = computed(() => {
  if (route.path.startsWith('/s2')) return 's2';
  if (route.path.startsWith('/s1')) return 's1';
  return 'home';
});

// 页面标题
const pageTitle = computed(() => {
  const meta = (route.meta?.title as string) || '';
  if (meta) return meta;
  if (route.path === '/') return 'Ontology Manager';
  if (route.path.includes('/object-types/')) return 'Object Type';
  if (route.path.includes('/link-types')) return 'Link Types';
  if (route.path.includes('/connections')) return 'Data Sources';
  return 'Ontology Manager';
});

function navigateTo(item: { to: string }) {
  router.push(item.to);
}
</script>

<template>
  <div class="app-layout">

    <!-- ====== 左侧图标导航栏 (48px) ====== -->
    <nav class="icon-nav">
      <div class="brand-icon" @click="router.push('/')" title="Ontology Manager">
        <span class="brand-mark">O</span>
      </div>
      <div class="nav-items">
        <button v-for="item in iconNav" :key="item.key"
          class="nav-btn" :class="{ active: activeIcon === item.key }"
          :title="item.label" @click="router.push(item.to)">
          <span class="nav-icon">{{ item.icon }}</span>
        </button>
      </div>
      <div class="nav-bottom">
        <button class="nav-btn" title="Settings">⚙️</button>
      </div>
    </nav>

    <!-- ====== 次级侧边面板 (220px, 可折叠) ====== -->
    <aside class="side-panel" :class="{ collapsed: panelCollapsed }">
      <!-- 面板头部 -->
      <div class="panel-header">
        <button class="back-btn" v-if="route.path !== '/'" @click="$router.back()">
          ← Back
        </button>
        <span v-else class="panel-title">{{ pageTitle }}</span>
      </div>

      <!-- 分组菜单 -->
      <div class="panel-body">
        <div v-for="(section, si) in panelSections" :key="si" class="menu-section">
          <div class="section-title">{{ section.title }}</div>
          <div class="menu-items">
            <button v-for="item in section.items" :key="item.key"
              class="menu-item" :class="{ active: route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) }"
              @click="navigateTo(item)">
              <span v-if="item.icon" class="mi-icon">{{ item.icon }}</span>
              <span class="mi-label">{{ item.label }}</span>
              <span v-if="item.count !== undefined" class="mi-count">{{ item.count }}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- ====== 主内容区 ====== -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="top-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="top-right">
          <!-- 搜索框占位 -->
          <div class="search-box">
            <input type="text" placeholder="Search..." class="search-input" />
            <span class="search-icon">🔍</span>
          </div>
          <div class="user-avatar">
            <span>U</span>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style>
/* ======== 全局重置与变量 ======== */
:root {
  /* ===== Palantir 配色（原始命名，供 App 框架使用） ===== */
  --pal-nav-bg: #1a365d;           /* 深蓝导航 */
  --pal-nav-hover: #234876;
  --pal-nav-active: #2b6cb0;
  --pal-panel-bg: #ffffff;
  --pal-panel-border: #e2e8f0;
  --pal-bg: #f7f8fa;               /* 主背景 */
  --pal-card-bg: #ffffff;
  --pal-text: #1a202c;
  --pal-text-secondary: #64748b;
  --pal-text-muted: #94a3b8;
  --pal-primary: #2563eb;
  --pal-primary-light: #dbeafe;
  --pal-success: #16a34a;
  --pal-warning: #d97706;
  --pal-danger: #dc2626;
  --pal-border: #e2e8f0;
  --pal-radius: 6px;
  --pal-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  /* ===== 统一设计令牌（供各页面组件复用，与上方对齐） ===== */
  --accent: #2563eb;
  --accent-soft: #eaf1fe;
  --border: #e2e8f0;
  --surface: #ffffff;
  --text: #1a202c;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --radius: 8px;
  --font-mono: 'SFMono-Regular', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #app {
  height: 100%;
  font-family: var(--pal-font);
  font-size: 13px;
  color: var(--pal-text);
  background: var(--pal-bg);
  -webkit-font-smoothing: antialiased;
}

/* Element Plus 覆盖 */
.el-button--primary {
  --el-button-bg-color: var(--pal-primary) !important;
  --el-button-border-color: var(--pal-primary) !important;
}
.el-dialog { --el-dialog-border-radius: 8px !important; }
.el-table th { background-color: #f8fafc !important; color: var(--pal-text-secondary) !important; font-size: 12px !important; }
.el-table td { font-size: 13px !important; }
.el-card { --el-card-border-radius: 8px !important; }
.el-tag { border-radius: 4px !important; }
.el-input__wrapper { border-radius: 4px !important; }
.el-select .el-input__wrapper { border-radius: 4px !important; }
</style>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ========== 图标导航栏 (48px) ========== */
.icon-nav {
  width: 48px;
  background: var(--pal-nav-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
  flex-shrink: 0;
  z-index: 10;
}
.brand-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand-mark {
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -1px;
}
.nav-items {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 2px;
  flex: 1;
}
.nav-bottom { padding: 8px 0; }
.nav-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
  font-size: 17px;
}
.nav-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
.nav-btn.active { background: rgba(255,255,255,0.15); color: #fff; }
.nav-icon { font-size: 17px; line-height: 1; }

/* ========== 次级侧边面板 ========== */
.side-panel {
  width: 230px;
  background: var(--pal-panel-bg);
  border-right: 1px solid var(--pal-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width .2s;
}
.side-panel.collapsed { width: 0; overflow: hidden; border: none; }

.panel-header {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid var(--pal-border);
  flex-shrink: 0;
}
.back-btn {
  background: none; border: none; cursor: pointer;
  color: var(--pal-text); font-size: 13px;
  display: flex; align-items: center; gap: 4px;
  padding: 4px 8px; border-radius: 4px;
}
.back-btn:hover { background: var(--pal-bg); }
.panel-title { font-weight: 600; font-size: 14px; color: var(--pal-text); }

.panel-body {
  flex: 1; overflow-y: auto; padding: 12px 0;
}
.menu-section { margin-bottom: 16px; }
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--pal-text-muted);
  padding: 4px 14px 6px;
  font-weight: 600;
}
.menu-items { display: flex; flex-direction: column; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--pal-text-secondary);
  font-size: 13px;
  text-align: left;
  width: 100%;
  transition: all .1s;
  border-left: 3px solid transparent;
}
.menu-item:hover { background: var(--pal-bg); color: var(--pal-text); }
.menu-item.active {
  background: var(--pal-primary-light);
  color: var(--pal-primary);
  border-left-color: var(--pal-primary);
  font-weight: 500;
}
.mi-icon { font-size: 15px; flex-shrink: 0; }
.mi-label { flex: 1; }
.mi-count {
  font-size: 11px;
  color: var(--pal-text-muted);
  background: var(--pal-bg);
  padding: 1px 7px;
  border-radius: 10px;
}

/* ========== 主内容区 ========== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* 顶部栏 */
.top-bar {
  height: 52px;
  background: #fff;
  border-bottom: 1px solid var(--pal-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}
.top-left { display: flex; align-items: center; gap: 12px; }
.page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--pal-text);
}
.top-right { display: flex; align-items: center; gap: 10px; }

.search-box {
  position: relative;
  width: 240px;
}
.search-input {
  width: 100%;
  height: 32px;
  border: 1px solid var(--pal-border);
  border-radius: 4px;
  padding: 0 30px 0 10px;
  font-size: 13px;
  outline: none;
  background: var(--pal-bg);
  color: var(--pal-text);
  transition: border-color .15s;
}
.search-input:focus { border-color: var(--pal-primary); }
.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  opacity: 0.45;
  pointer-events: none;
}

.top-btn {
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--pal-border);
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: var(--pal-text);
  font-weight: 500;
  transition: all .15s;
}
.top-btn:hover { border-color: var(--pal-primary); color: var(--pal-primary); }
.top-btn.primary {
  background: var(--pal-success);
  color: #fff;
  border-color: var(--pal-success);
}
.top-btn.primary:hover { opacity: 0.9; }

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--pal-nav-bg);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}
</style>
