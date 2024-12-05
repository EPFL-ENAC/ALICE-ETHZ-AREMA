<template>
  <q-page>
    <q-scroll-observer @scroll="onScroll" />
    <div class="row items-center justify-evenly bg-black" style="height: 100vh">
      <img src="arema-1.svg" style="filter: invert(100%); width: 80%" />
    </div>
    <div>
      <about-panel style="height: 90vh" />
    </div>
    <q-card
      flat
      square
      v-touch-pan.prevent.mouse="handlePan"
      class="bg-primary text-secondary"
      style="
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
      "
    >
      <q-icon
        :name="panning ? 'search' : 'expand_less'"
        :size="panning ? '72px' : '96px'"
      />
    </q-card>
    <div>
      <q-toolbar class="text-primary bg-grey-3">
        <q-btn
          flat
          dense
          size="lg"
          to="/search"
          class="full-width"
          align="left"
          :label="$t('filters')"
        />
      </q-toolbar>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AboutPanel from 'src/components/AboutPanel.vue';
import { useQuasar } from 'quasar';
import { useHome } from 'src/stores/home';

const $q = useQuasar();
const router = useRouter();
const homeStore = useHome();

const panning = ref(false);

function onScroll(info) {
  homeStore.update(info.position.top, $q.screen.height);
}

function handlePan(evt) {
  panning.value = evt.offset.y < -100;
  if (evt.isFinal) {
    if (panning.value) {
      router.push('/search');
    }
    panning.value = false;
  }
}
</script>
