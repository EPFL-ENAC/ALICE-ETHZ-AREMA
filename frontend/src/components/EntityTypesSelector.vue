<template>
  <div>
    <q-btn-dropdown
      v-if="!$q.screen.gt.sm"
      :label="$t('filter_by_types')"
      outline
      unelevated
      square
      no-caps
      size="md"
      color="secondary"
      class="on-left q-mb-md"
    >
      <template v-slot:label>
        <div>
          <q-badge
            v-if="selectedEntityTypesCount > 0"
            class="q-ml-xs"
            color="secondary"
            :label="selectedEntityTypesCount"
            style="font-size: 12px"
          />
        </div>
      </template>
      <q-list>
        <template v-for="entityType in entityTypes" :key="entityType.value">
          <q-item>
            <q-item-section>
              <q-item-label :class="isEntityTypeEnabled(entityType.value) ? 'text-secondary' : 'text-primary'">{{
                entityType.label
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="selectedEntityTypes[entityType.value]"
                size="sm"
                class="on-left"
                :color="isEntityTypeEnabled(entityType.value) ? 'secondary' : 'primary'"
                :class="isEntityTypeEnabled(entityType.value) ? 'text-secondary' : 'text-primary'"
                :disable="isEntityTypeEnabled(entityType.value)"
                @update:model-value="onEntityTypeSelect()"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown>
    <div v-if="$q.screen.gt.sm" class="text-primary q-mb-md">
      <span class="text-secondary">{{ $t('filter_by_types') }}</span>
      <template v-for="entityType in entityTypes" :key="entityType.value">
        <q-toggle
          v-model="selectedEntityTypes[entityType.value]"
          :label="entityType.label"
          size="sm"
          class="text-primary on-left"
          :class="isEntityTypeEnabled(entityType.value) ? 'text-secondary' : 'text-primary'"
          :disable="isEntityTypeEnabled(entityType.value)"
          :color="isEntityTypeEnabled(entityType.value) ? 'secondary' : 'primary'"
          @update:model-value="onEntityTypeSelect()"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const taxonomyStore = useTaxonomyStore();
const searchService = useSearchService();

interface Props {
  modelValue: { [key: string]: boolean };
  useGeo?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const selectedEntityTypes = ref<{ [key: string]: boolean }>(props.modelValue);
const entityTypes = computed(() => {
  return (
    taxonomyStore.taxonomies?.taxonomy.map((tx) => {
      return {
        value: tx.id,
        label: taxonomyStore.getLabel(tx.names),
      };
    }) || []
  );
});
const geoEntityTypes = ['building', 'professional'];

const selectedEntityTypesCount = computed(() => {
  return Object.keys(selectedEntityTypes.value).filter((key) => selectedEntityTypes.value[key]).length;
});

function isEntityTypeEnabled(entityType: string) {
  if (!props.useGeo) {
    return false;
  }
  if (searchService.selectedView === 'map') {
    return !geoEntityTypes.includes(entityType);
  }
  return false;
}

function onEntityTypeSelect() {
  emit('update:modelValue', selectedEntityTypes.value);
}
</script>
