import type { RouteRecordRaw } from 'vue-router';

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
        component: () => import('pages/ResourcesPage.vue'),
      },
      {
        path: 'resources',
        component: () => import('pages/ResourcesPage.vue'),
      },
      {
        path: 'building-materials',
        component: () => import('pages/BuildingMaterialsPage.vue'),
      },
      {
        path: 'construction-techniques',
        component: () => import('pages/ConstructionTechniquesPage.vue'),
      },
      {
        path: 'authors',
        component: () => import('pages/AuthorsPage.vue'),
      },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'publication', component: () => import('pages/PublicationPage.vue') },
      { path: 'layout', component: () => import('pages/LayoutPage.vue') },
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
