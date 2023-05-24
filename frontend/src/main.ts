import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'

import { createPinia } from 'pinia'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
// import { VDataTable } from 'vuetify/labs/components'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables

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

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.use(vuetify)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
