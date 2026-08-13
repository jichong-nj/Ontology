import { createRouter, createWebHistory } from 'vue-router';
import Overview from '@/pages/Overview.vue';
import S1Connections from '@/pages/s1/Connections.vue';
import S2ObjectTypes from '@/pages/s2/ObjectTypes.vue';
import S2ObjectTypeDetail from '@/pages/s2/ObjectTypeDetail.vue';
import S2LinkTypes from '@/pages/s2/LinkTypes.vue';
import S2Rules from '@/pages/s2/Alerts.vue';
import S2Explore from '@/pages/s2/Explore.vue';
import S2Functions from '@/pages/s2/Functions.vue';
import S2Actions from '@/pages/s2/Actions.vue';
import S2SharedProperties from '@/pages/s2/SharedProperties.vue';
import AlertsPage from '@/pages/AlertsPage.vue';

const routes = [
  { path: '/', component: Overview, meta: { title: 'Ontology Manager' } },
  { path: '/alerts', component: AlertsPage, meta: { title: 'Alerts' } },
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
      { path: 'rules', component: S2Rules, meta: { title: 'Rules' } },
      { path: 'functions', component: S2Functions, meta: { title: 'Functions' } },
      { path: 'actions', component: S2Actions, meta: { title: 'Actions' } },
      { path: 'shared-properties', component: S2SharedProperties, meta: { title: 'Shared Properties' } },
      { path: 'explore/:objectType?', component: S2Explore, meta: { title: '探索' } },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
