<template>
  <q-page>
    <q-scroll-observer @scroll="onScroll" />
    <div class="row items-center justify-evenly bg-black" style="height: 89vh">
      <img src="arema-1.svg" style="filter: invert(100%); width: 80%" />
    </div>
    <div>
      <about-panel class="q-pa-md bg-primary" style="height: 90vh" />
    </div>
    <div>
      <search-panel class="q-pa-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AboutPanel from 'src/components/AboutPanel.vue';
import SearchPanel from 'src/components/SearchPanel.vue';
import { useQuasar } from 'quasar';
import { useHome } from 'src/stores/home';

const $q = useQuasar();
const homeStore = useHome();

function onScroll(info) {
  homeStore.update(info.position.top, $q.screen.height);
}
</script>
