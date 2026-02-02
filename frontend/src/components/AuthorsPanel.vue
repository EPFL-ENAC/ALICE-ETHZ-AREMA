<template>
  <div v-if="authors.length">
    <div class="text-primary">{{ t('authors') }}</div>
    <div class="q-mt-xs q-mb-none">
      <span
        v-for="(doc, index) in authors"
        :key="doc.id"
        class="cursor-pointer"
        @click="onDocument(doc)"
      >
        <span>{{ doc.name }}</span>
        <span v-if="index < authors.length - 1">, </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';

const { t } = useI18n();

interface Props {
  authors: Document[];
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'document-click', doc: Document): void;
}>();

function onDocument(doc: Document) {
  emit('document-click', doc);
}
</script>
