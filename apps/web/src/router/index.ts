import { createRouter, createWebHistory } from 'vue-router';
import Overview from '@/pages/Overview.vue';
import S1Connections from '@/pages/s1/Connections.vue';
import S2ObjectTypes from '@/pages/s2/ObjectTypes.vue';
import S2ObjectTypeDetail from '@/pages/s2/ObjectTypeDetail.vue';
import S2LinkTypes from '@/pages/s2/LinkTypes.vue';
import S2Rules from '@/pages/s2/Alerts.vue';
import S2Explore from '@/pages/s2/Explore.vue';
import S2Functions from '@/pages/s2/Functions.vue';
import S2FunctionHelp from '@/pages/s2/FunctionHelp.vue';
import S2Actions from '@/pages/s2/Actions.vue';
import S2SharedProperties from '@/pages/s2/SharedProperties.vue';
import S2ValueTypes from '@/pages/s2/ValueTypes.vue';
import AlertsPage from '@/pages/AlertsPage.vue';
import AIPPage from '@/pages/AIPPage.vue';
import AIPAgentManagement from '@/pages/AIPAgentManagement.vue';
import ProviderPage from '@/pages/ProviderPage.vue';
import EmergencyList from '@/pages/emergency/EmergencyList.vue';
import EmergencyDetail from '@/pages/emergency/EmergencyDetail.vue';
import EmergencyInbox from '@/pages/emergency/EmergencyInbox.vue';

const routes = [
  { path: '/', component: Overview, meta: { title: 'Ontology Manager' } },
  { path: '/alerts', component: AlertsPage, meta: { title: 'Alerts' } },
  { path: '/emergency', component: EmergencyList, meta: { title: '应急响应' } },
  { path: '/emergency/inbox', component: EmergencyInbox, meta: { title: '模拟业务端' } },
  { path: '/emergency/:id', component: EmergencyDetail, meta: { title: '应急响应详情' } },
  { path: '/aip', component: AIPPage, meta: { title: 'AIP Chat' } },
  { path: '/aip/agents', component: AIPAgentManagement, meta: { title: 'Agent Management' } },
  { path: '/aip/providers', component: ProviderPage, meta: { title: 'Provider' } },
  {
    path: '/s1',
    redirect: '/s1/connections',
    children: [
      { path: 'connections', component: S1Connections, meta: { title: 'Data Sources' } },
    ],
  },
  {
    path: '/s2',
    children: [
      {
        path: 'object-types',
        component: S2ObjectTypes,
        meta: { title: 'Object Types' },
        // 对象类型详情作为嵌套子路由（内嵌于列表布局）
        children: [
          {
            path: ':apiName',
            component: S2ObjectTypeDetail,
            meta: { title: 'Object Type' },
          },
        ],
      },
      { path: 'link-types', component: S2LinkTypes, meta: { title: 'Link Types' } },
      { path: 'automations', component: S2Rules, meta: { title: 'Automation' } },
      { path: 'rules', redirect: '/s2/automations' },
      { path: 'functions', component: S2Functions, meta: { title: 'Functions' } },
      { path: 'functions/help', component: S2FunctionHelp, meta: { title: '函数编写指南' } },
      { path: 'actions', component: S2Actions, meta: { title: 'Actions' } },
      { path: 'shared-properties', component: S2SharedProperties, meta: { title: 'Shared Properties' } },
      { path: 'value-types', component: S2ValueTypes, meta: { title: 'Value Types' } },
      { path: 'explore/:objectType?', component: S2Explore, meta: { title: '探索' } },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
