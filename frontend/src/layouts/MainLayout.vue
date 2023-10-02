<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-white text-grey-10">
      <q-bar dense class="bg-amber text-grey-8 q-pr-md">
        <q-space />
        <div class="text-weight-bold">en</div>
        <div><a href="#" class="text-grey-10">de</a></div>
        <div><a href="#" class="text-grey-10">fr</a></div>
      </q-bar>
      <q-toolbar :style="isHome ? 'height: 100px' : ''">
        <q-toolbar-title>
          <span v-if="isHome" class="q-pr-md"
            >Atlas of REgenerative MAterials</span
          >
          <q-btn
            v-else
            flat
            label="Atlas of REgenerative MAterials"
            :size="isHome ? 'lg' : 'md'"
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
          :size="isHome ? 'lg' : 'md'"
          icon="search"
          label="Search"
          no-caps
          class="on-right"
          to="/search"
        />
        <q-btn
          flat
          dense
          :size="isHome ? 'lg' : 'md'"
          label="Contribute"
          no-caps
          class="on-right"
          to="/contribute"
        />
        <q-btn
          flat
          dense
          :size="isHome ? 'lg' : 'md'"
          label="Charta"
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
const route = useRoute();

const isHome = computed(() => route.path === '/');
</script>
