<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-black"
      :style="`height: ${homeStore.toolbarRatio * 50}px`"
    >
      <q-toolbar>
        <img
          v-if="$q.screen.gt.sm"
          src="arema-h-1.svg"
          :style="`height: ${homeStore.toolbarRatio * ($q.screen.gt.sm ? 30 : 20)}px`"
          style="filter: invert(100%)"
        />
        <q-space />
        <q-btn
          dense
          flat
          round
          :icon="rightDrawerOpen ? 'close' : 'menu'"
          :size="`${homeStore.toolbarRatio * ($q.screen.gt.sm ? 24 : 12)}px`"
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
  </q-layout>
</template>

<script setup lang="ts">
import NavDrawer from 'src/components/NavDrawer.vue';
const rightDrawerOpen = ref(false);

const homeStore = useHome();

onMounted(() => {
  homeStore.reset();
});
</script>
