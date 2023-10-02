import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      {
        path: 'contribute',
        component: () => import('pages/ContributePage.vue'),
      },
      { path: 'charta', component: () => import('pages/ChartaPage.vue') },
      {
        path: 'professional/:id',
        component: () => import('pages/ProfessionalPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
