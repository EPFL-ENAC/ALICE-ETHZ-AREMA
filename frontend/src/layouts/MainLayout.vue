<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-white text-grey-10">
      <q-bar dense class="bg-amber text-grey-8 q-pr-md">
        <q-space />
        <div class="text-weight-bold">en</div>
        <div><a href="#" class="text-grey-10">de</a></div>
        <div><a href="#" class="text-grey-10">fr</a></div>
      </q-bar>
      <q-toolbar :style="isHome && !$q.screen.lt.sm ? 'height: 100px' : ''">
        <q-btn
          v-if="isSearch"
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />
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
          label="Search"
          no-caps
          class="on-right"
          to="/search"
        />
        <q-btn
          flat
          dense
          :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
          label="Contribute"
          no-caps
          class="on-right"
          to="/contribute"
        />
        <q-btn
          flat
          dense
          :size="isHome && !$q.screen.lt.sm ? 'lg' : 'md'"
          label="Charta"
          no-caps
          class="on-right"
          to="/charta"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="isSearch" v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-if="isSearch" v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);
const isHome = computed(() => route.path === '/');
const isSearch = computed(() => route.path === '/search');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
