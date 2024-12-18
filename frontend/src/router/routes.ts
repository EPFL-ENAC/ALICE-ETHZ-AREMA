import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      {
        name: 'doc',
        path: 'doc/:id',
        component: () => import('pages/DocumentPage.vue'),
      },
      {
        path: 'natural-resource/:id',
        component: () => import('pages/EntityPage.vue'),
      },
      {
        name: 'building-material',
        path: 'building-material/:id',
        component: () => import('pages/EntityPage.vue'),
      },
      {
        name: 'technical-construction',
        path: 'technical-construction/:id',
        component: () => import('pages/EntityPage.vue'),
      },
      {
        name: 'building',
        path: 'building/:id',
        component: () => import('pages/EntityPage.vue'),
      },
      {
        name: 'professional',
        path: 'professional/:id',
        component: () => import('pages/EntityPage.vue'),
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
