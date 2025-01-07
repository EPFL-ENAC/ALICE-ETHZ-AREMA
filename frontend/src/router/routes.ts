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
      { path: 'videos', component: () => import('pages/VideosPage.vue') },
      {
        name: 'doc',
        path: '_/:id',
        component: () => import('pages/DocumentPage.vue'),
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
