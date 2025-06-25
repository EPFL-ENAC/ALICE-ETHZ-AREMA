import { RouteRecordRaw } from 'vue-router';

const now = new Date();
// is before 2025-06-27
const isBeforeRelease = now < new Date('2025-06-27');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => (isBeforeRelease ? import('layouts/TempLayout.vue') : import('layouts/HomeLayout.vue')),
    children: [
      {
        name: 'home',
        path: '',
        component: () => (isBeforeRelease ? import('pages/ComingSoonPage.vue') : import('pages/IndexPage.vue')),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/AltLayout.vue'),
    children: [
      { path: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'imprint', component: () => import('pages/ImprintPage.vue') },
      { path: 'disclaimer', component: () => import('pages/DisclaimerPage.vue') },
      { path: 'copyright', component: () => import('pages/CopyrightPage.vue') },
      { path: 'contribute', component: () => import('pages/ContributePage.vue') },
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      { path: 'videos', component: () => import('pages/VideosPage.vue') },
      { path: 'contact', component: () => import('pages/ImprintPage.vue') },
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
