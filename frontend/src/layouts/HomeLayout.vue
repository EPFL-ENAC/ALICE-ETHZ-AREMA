<template>
  <q-layout view="hHh lpR fFf">
    <header-panel v-model="rightDrawerOpen" home />

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
      <nav-drawer home />
    </q-drawer>

    <div class="bg-black text-white">
      <div class="row items-center justify-center">
        <router-link to="/about" class="text-white q-pa-md">{{ $t('about') }}</router-link>
        <router-link to="/imprint" class="text-white q-pa-md">{{ $t('imprint') }}</router-link>
        <router-link to="/disclaimer" class="text-white q-pa-md">{{ $t('disclaimer') }}</router-link>
        <router-link to="/copyright" class="text-white q-pa-md">{{ $t('copyright') }}</router-link>
      </div>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import HeaderPanel from 'src/components/HeaderPanel.vue';
import NavDrawer from 'src/components/NavDrawer.vue';
const rightDrawerOpen = ref(false);
</script>
