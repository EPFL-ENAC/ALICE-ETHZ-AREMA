<template>
  <q-header elevated class="bg-black">
    <q-toolbar>
      <img
        v-if="$q.screen.gt.sm"
        src="/arema-h-1.svg"
        :style="home ? `height: ${homeStore.toolbarRatio * 30}px` : 'height: 30px'"
        style="filter: invert(100%)"
      />
      <q-space />
      <q-btn
        dense
        flat
        round
        :icon="rightDrawerOpen ? 'close' : 'menu'"
        :size="home ? `${homeStore.toolbarRatio * ($q.screen.gt.sm ? 18 : 12)}px` : `${$q.screen.gt.sm ? 18 : 12}px`"
        @click="onToggleDrawer"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

interface Props {
  modelValue: boolean;
  home?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const rightDrawerOpen = ref(props.modelValue);

const homeStore = useHome();
const $q = useQuasar();

onMounted(() => {
  homeStore.reset();
});

function onToggleDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
  emit('update:modelValue', rightDrawerOpen.value);
}

onBeforeRouteUpdate(() => {
  rightDrawerOpen.value = false;
});
</script>
