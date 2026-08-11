import { createRouter, createWebHistory } from 'vue-router';
import Overview from '@/pages/Overview.vue';
import S1Connections from '@/pages/s1/Connections.vue';
import S2ObjectTypes from '@/pages/s2/ObjectTypes.vue';
import S2ObjectTypeDetail from '@/pages/s2/ObjectTypeDetail.vue';
import S2LinkTypes from '@/pages/s2/LinkTypes.vue';
import S2Alerts from '@/pages/s2/Alerts.vue';

const routes = [
  { path: '/', component: Overview, meta: { title: 'Ontology Manager' } },
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
      { path: 'alerts', component: S2Alerts, meta: { title: 'Alerts' } },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
