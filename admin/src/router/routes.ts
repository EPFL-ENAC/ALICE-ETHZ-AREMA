import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'buildings',
        component: () => import('pages/BuildingsPage.vue'),
      },
      {
        path: 'professionals',
        component: () => import('pages/ProfessionalsPage.vue'),
      },
      {
        path: 'natural-resources',
        component: () => import('pages/NaturalResourcesPage.vue'),
      },
      {
        path: 'users',
        component: () => import('pages/UsersPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
