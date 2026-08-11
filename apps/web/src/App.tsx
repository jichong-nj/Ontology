// apps/web — 前端骨架（React + TS + Tailwind）
// 企业级数据平台风格：深色侧边导航 + 浅色内容区，子系统导航占位。

import React from 'react';

const SUBSYSTEMS = [
  { id: 'S1', name: '数据接入与映射', desc: '连接已治理数据源，建立对象↔源映射' },
  { id: 'S2', name: 'Ontology 内核', desc: '对象/关系/动作/函数建模核心' },
  { id: 'S3', name: '分析与探索', desc: '对象浏览器 / 图表 / 图谱' },
  { id: 'S4', name: '应用构建', desc: '低代码应用 / 对象视图 / 看板' },
  { id: 'S5', name: 'AI 决策编排', desc: '语义搜索 / LLM 函数 / 智能体 / NL2Query' },
  { id: 'S6', name: '权限与治理', desc: 'RBAC / 对象级授权 / 审计' },
];

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="w-64 bg-slate-900 text-slate-100 p-4 fixed inset-y-0 left-0">
        <div className="text-lg font-bold mb-6 text-blue-400">Ontology Platform</div>
        <nav className="space-y-1">
          {SUBSYSTEMS.map((s) => (
            <button
              key={s.id}
              className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <div className="font-medium">{s.id} · {s.name}</div>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-2">总览</h1>
        <p className="text-slate-600 mb-6">对标 Palantir（Foundry + AIP 裁剪版）的本体驱动数据分析平台。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBSYSTEMS.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow p-4 border border-slate-200">
              <div className="font-semibold text-blue-700">{s.id} · {s.name}</div>
              <div className="text-sm text-slate-500 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
