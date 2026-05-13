<template>
  <div class="text-caption text-grey-7">
    <span :title="t('low')">{{ min || '-' }}</span> /
    <span :title="t('standard')">{{ std || '-' }}</span> /
    <span :title="t('high')">{{ max || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
const taxonomyStore = useTaxonomyStore();

interface Props {
  urn: string;
  property: string;
  min?: number | null;
  std?: number | null;
  max?: number | null;
}

const props = defineProps<Props>();

const { t } = useI18n();
const node = computed(() => taxonomyStore.getNode(props.urn));
</script>
