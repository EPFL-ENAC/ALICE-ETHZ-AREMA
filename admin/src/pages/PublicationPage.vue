<template>
  <q-page>
    <div class="text-h5 q-pa-md">{{ t('publication_flow') }}</div>
    <q-separator />
    <div class="q-pa-md">
      <q-markdown :src="publicationFlowContent" no-heading-anchor-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { t } = useI18n();
const publicationFlowContent = ref('');

onMounted(() => {
  void fetch(`/admin/help/en/publication-flow.md`).then((response) => {
    void response.text().then((text) => {
      publicationFlowContent.value = text;
    });
  });
});
</script>
