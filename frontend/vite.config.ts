/// <reference types="vitest" />

import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://github.com/pouchdb/pouchdb/issues/8607
export default defineConfig({
  define: {
    global: 'window',
  },
  // build: {
  //   commonjsOptions: {
  //     transformMixedEsModules: true,
  //     include: [],
  //   },
  // },
  // optimizeDeps: {
  //   disabled: false,
  // },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    // https://vue-i18n.intlify.dev/guide/advanced/sfc.html#configure-plugin-for-vite
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        './src/locales/**',
      ),
    }),
    VueMacros({
      plugins: {
        vue: Vue({
          reactivityTransform: true,
          template: { transformAssetUrls },
        }),
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),
    // Vue({
    //   template: { transformAssetUrls },
    // }),
    vuetify(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
      dts: true,
      dirs: ['./src/composables'],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },

  build: {
    sourcemap: true,
  },

  server: {
    // https://vitejs.dev/config/server-options.html#server-proxy
    proxy: {
      '^/db': {
        target: 'http://localhost:5984',
        rewrite: path => path.replace(/^\/db/, ''),
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          Connection: 'keep-alive',
        },
      },
      '^/api': {
        target: 'http://localhost:5050/',
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false,
      },
      '^/s3': {
        target: 'http://localhost:5660/',
        rewrite: path => path.replace(/^\/s3/, ''),
        secure: false,
      },
    },
  },
})
