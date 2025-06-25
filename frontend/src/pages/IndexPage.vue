<template>
  <q-page>
    <q-scroll-observer @scroll="onScroll" />
    <div class="row items-center justify-evenly bg-black" style="height: 95vh">
      <img src="arema-1.svg" style="filter: invert(100%); width: 80%" />
    </div>
    <div
      class="bg-black text-white q-pt-lg q-pb-sm row items-center justify-center"
      :class="topPos < 10 ? 'fixed-bottom' : ''"
    >
      <q-icon
        name="keyboard_arrow_down"
        :size="`${$q.screen.gt.sm ? 96 : 80}px`"
        :style="`opacity: ${1 - topPos / 100}`"
        @click="scrollTo('#purpose-panel')"
      />
    </div>
    <div id="purpose-panel">
      <purpose-panel class="q-pa-md bg-primary" style="min-height: 50vh" />
    </div>
    <div>
      <search-panel class="q-pa-md" style="min-height: 90vh" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PurposePanel from 'src/components/PurposePanel.vue';
import SearchPanel from 'src/components/SearchPanel.vue';
import { useQuasar } from 'quasar';
import { useHome } from 'src/stores/home';

const $q = useQuasar();
const homeStore = useHome();

const topPos = ref(0);

function onScroll(info: { position: { top: number } }) {
  topPos.value = info.position.top;
  homeStore.update(topPos.value, $q.screen.height);
}

function scrollTo(selector: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>
