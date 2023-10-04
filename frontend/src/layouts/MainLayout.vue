<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-white text-grey-10">
      <q-bar dense class="bg-amber text-grey-8 q-pr-md">
        <q-space />
        <div v-for="lang in locales" :key="lang">
          <a
            href="#"
            :class="locale === lang ? 'text-weight-bold' : ''"
            :style="locale === lang ? 'text-decoration: none' : ''"
            class="text-grey-10"
            @click="onLocaleSelection(lang)"
            >{{ lang }}</a
          >
        </div>
      </q-bar>
      <q-toolbar :style="isHome && !$q.screen.lt.sm ? 'height: 100px' : ''">
        <q-toolbar-title>
          <span v-if="isHome" class="q-pr-md"
            >Atlas of REgenerative MAterials</span
          >
          <q-btn
            v-else
            flat
            label="Atlas of REgenerative MAterials"
            :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
            to="/"
            no-caps
          />

          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-black.svg" />
          </q-avatar>
        </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          dense
          :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
          icon="search"
          :label="$t('search')"
          no-caps
          class="on-right"
          to="/search"
        />
        <q-btn
          flat
          dense
          :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
          :label="$t('contribute')"
          no-caps
          class="on-right"
          to="/contribute"
        />
        <q-btn
          flat
          dense
          :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
          :label="$t('charter')"
          no-caps
          class="on-right"
          to="/charta"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

const $q = useQuasar();
const route = useRoute();
const isHome = computed(() => route.path === '/');
const { locale } = useI18n({ useScope: 'global' });

const locales = ['en', 'de', 'fr'];

function onLocaleSelection(lang: string) {
  locale.value = lang;
  cookies.set('locale', lang);
}
</script>
