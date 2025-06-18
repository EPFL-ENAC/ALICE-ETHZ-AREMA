import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  //{
  //  path: '/',
  //  component: () => import('layouts/HomeLayout.vue'),
  //  children: [{ name: 'home', path: '', component: () => import('pages/IndexPage.vue') }],
  //},
  {
    path: '/',
    component: () => import('layouts/TempLayout.vue'),
    children: [{ name: 'home', path: '', component: () => import('pages/ComingSoonPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/AltLayout.vue'),
    children: [
      { path: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'imprint', component: () => import('pages/ImprintPage.vue') },
      { path: 'disclaimer', component: () => import('pages/DisclaimerPage.vue') },
      { path: 'copyright', component: () => import('pages/CopyrightPage.vue') },
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      { path: 'videos', component: () => import('pages/VideosPage.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
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
