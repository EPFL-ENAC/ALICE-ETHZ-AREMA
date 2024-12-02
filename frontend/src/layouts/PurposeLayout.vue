<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-black">
      <q-bar v-show="false" dense class="bg-amber text-grey-8 q-pr-md">
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

      <q-toolbar>
        <img src="arema-h-1.svg" height="30px" style="filter: invert(80%)" />
        <q-space />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="a-bg-orange q-mb-lg">
      <q-btn
        flat
        icon="expand_more"
        size="48px"
        to="/filters"
        class="text-grey-3 full-width q-pb-md"
      />
    </q-footer>
    <q-footer class="bg-grey-3 a-text-orange">
      <q-toolbar>
        <q-btn
          flat
          dense
          size="lg"
          to="/filters"
          class=""
          :label="$t('filters')"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
const { locale } = useI18n({ useScope: 'global' });

const locales = ['en', 'de', 'fr'];

function onLocaleSelection(lang: string) {
  locale.value = lang;
}
</script>
