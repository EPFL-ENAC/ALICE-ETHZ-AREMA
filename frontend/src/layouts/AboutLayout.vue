<template>
  <q-layout view="hHh lpr fFr">
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
        <img
          v-if="$q.screen.gt.sm"
          src="arema-h-1.svg"
          height="30px"
          style="filter: invert(100%)"
        />
        <q-space />
        <q-btn
          dense
          flat
          round
          :icon="rightDrawerOpen ? 'close' : 'menu'"
          size="xl"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer
      overlay
      v-model="rightDrawerOpen"
      side="right"
      class="bg-black text-white"
      :width="$q.screen.gt.sm ? 800 : $q.screen.gt.xs ? 500 : 300"
    >
      <nav-drawer />
    </q-drawer>

    <q-footer class="bg-primary q-mb-lg">
      <q-btn
        flat
        icon="expand_more"
        size="48px"
        to="/search"
        class="text-grey-3 full-width q-pb-md"
      />
    </q-footer>
    <q-footer class="bg-grey-3 text-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          size="lg"
          to="/search"
          class=""
          :label="$t('filters')"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import NavDrawer from 'src/components/NavDrawer.vue';
const rightDrawerOpen = ref(false);
const { locale } = useI18n({ useScope: 'global' });

const locales = ['en', 'de', 'fr'];

function onLocaleSelection(lang: string) {
  locale.value = lang;
}
</script>
