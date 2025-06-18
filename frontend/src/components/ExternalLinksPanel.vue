<template>
  <div v-if="document?.external_links">
    <div class="text-primary text-caption">
      {{ $t('external_links') }}
    </div>
    <q-separator color="primary" class="q-mb-sm" />
    <q-markdown :src="document.external_links" no-heading-anchor-links />
  </div>
</template>

<script setup lang="ts">
import { Document } from 'src/models';

interface Props {
  document: Document;
}

defineProps<Props>();
</script>
