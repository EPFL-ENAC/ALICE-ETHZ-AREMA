<template>
  <q-layout view="hHh lpR fFf">
    <header-panel v-model="rightDrawerOpen" />
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
  </q-layout>
</template>

<script setup lang="ts">
import HeaderPanel from 'src/components/HeaderPanel.vue';
import NavDrawer from 'src/components/NavDrawer.vue';
const rightDrawerOpen = ref(false);
</script>
