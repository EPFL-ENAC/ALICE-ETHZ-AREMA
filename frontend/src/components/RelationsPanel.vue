<template>
  <div v-if="relationSummaries.length || relatedResources.length" class="q-mt-md">
    <div class="content">
      <div class="text-primary text-uppercase q-mb-sm">
        {{ title }}
      </div>
      <div class="cards">
        <template
          v-for="entity_type in Object.keys(relationSummariesPerEntityType)"
          :key="entity_type"
        >
          <q-card flat class="q-mb-md" style="min-width: 200px">
            <q-card-section>
              <div class="text-primary">{{ t(entity_type) }}</div>
              <ul class="q-mt-xs q-mb-none q-pl-md">
                <li
                  v-for="doc in relationSummariesPerEntityType[entity_type]"
                  :key="doc.id"
                  class="text-bold cursor-pointer"
                  @click="emit('document-click', doc)"
                >
                  {{ doc.name }}
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </template>
        <q-card v-if="relatedResources.length" flat class="q-mb-md" style="min-width: 200px">
          <q-card-section>
            <div class="text-primary">{{ t(entityType) }}</div>
            <ul class="q-mt-xs q-mb-none q-pl-md">
              <li
                v-for="doc in relatedResources"
                :key="doc.id"
                class="text-bold cursor-pointer"
                @click="emit('document-click', doc)"
              >
                {{ doc.name }}
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';

const { t } = useI18n();

interface Props {
  title: string;
  relationSummaries: Document[];
  relatedResources: Document[];
  entityType: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'document-click', doc: Document): void;
}>();

const relationSummariesPerEntityType = computed(() => {
  const relations: { [key: string]: Document[] } = {};
  props.relationSummaries.forEach((doc) => {
    const entityType = doc.entity_type;
    if (!relations[entityType]) {
      relations[entityType] = [];
    }
    relations[entityType].push(doc);
  });
  return relations;
});
</script>

<style scoped>
.content {
  grid-column: 2 / 3;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .content {
    grid-column: 1 / -1;
  }
}
</style>
