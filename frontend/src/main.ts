import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'

import { LocalStorageKey } from '~/utils/localStorage'
import { createPinia } from 'pinia'
import { createI18n, useI18n } from 'vue-i18n'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import { createVuetify } from 'vuetify'
import { en as vuetifyEn, fr as vuetifyFr } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
// import { VDataTable } from 'vuetify/labs/components'
import App from './App.vue'
import en from '~/locales/en.json'
import fr from '~/locales/fr.json'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  // components: {
  //   VDataTable,
  // },
  components: {
    ...components,
    ...labsComponents,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
app.use(vuetify)

const pinia = createPinia()
app.use(pinia)

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(LocalStorageKey.Locale) ?? 'en',
  fallbackLocale: 'en',
  messages: {
    en: { $vuetify: vuetifyEn, ...en },
    fr: { $vuetify: vuetifyFr, ...fr },
  },
})
app.use(i18n)

app.mount('#app')
