<template>
  <q-header elevated class="bg-black">
    <q-toolbar>
      <img
        :src="
          $q.screen.gt.sm
            ? '/arema-h-1.svg'
            : $q.screen.gt.xs
              ? '/arema-h-sm.svg'
              : '/arema-h-xs.svg'
        "
        class="cursor-pointer"
        :style="home ? `height: ${homeStore.toolbarRatio * 30}px` : 'height: 30px'"
        style="filter: invert(100%)"
        @click="toHome"
      />
      <q-space />
      <q-btn
        dense
        flat
        round
        icon="menu"
        :size="home ? `${homeStore.toolbarRatio * 18}px` : '18px'"
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
const router = useRouter();

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

function toHome() {
  void router.push('/');
}
</script>
