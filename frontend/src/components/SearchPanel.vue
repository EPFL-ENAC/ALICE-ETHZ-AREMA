<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('filters') }}
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <q-input
      v-model="searchService.filterText"
      borderless
      clearable
      debounce="500"
      input-style="font-size: 48px;"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-md q-mb-md"
      @update:model-value="searchService.search()"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <div>
      <q-btn
        v-for="vocOpt in vocabularyOptions"
        :key="vocOpt.value"
        :outline="vocOpt !== selectedVocabulary"
        :disable="searchService.searching"
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(vocOpt.label)"
        class="on-left q-mb-sm"
        @click="onVocabularySelect(vocOpt)"
      >
        <q-badge
          v-if="getSelectedTerms(vocOpt).length"
          :color="vocOpt !== selectedVocabulary ? 'primary' : 'white'"
          :class="vocOpt !== selectedVocabulary ? 'text-white' : 'text-primary'"
          class="q-ml-xs"
        >
          {{ getSelectedTerms(vocOpt).length }}
        </q-badge>
      </q-btn>
    </div>
    <div class="q-mt-sm" v-if="selectedVocabulary">
      <q-btn
        v-for="termOpt in termOptions"
        :key="termOpt.urn"
        :outline="!searchService.selectedTerms.includes(termOpt.urn)"
        :disable="searchService.searching"
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(termOpt.label)"
        class="on-left q-mb-sm"
        @click="onTermSelect(termOpt)"
      />
    </div>
    <div class="q-mt-md">
      <q-btn
        v-for="view in views"
        :key="view"
        :outline="view !== searchService.selectedView"
        color="secondary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(view)"
        class="on-left"
        @click="onViewSelect(view)"
      />
      <q-spinner-dots v-if="searchService.searching" size="md" />
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <map-results v-if="searchService.selectedView === 'map'" />
    <list-results v-else-if="searchService.selectedView === 'list'" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SearchPanel',
});
</script>
<script setup lang="ts">
import MapResults from 'src/components/MapResults.vue';
import ListResults from 'src/components/ListResults.vue';
import { TaxonomyNodeOption } from 'src/components/models';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();

const selectedVocabulary = ref<TaxonomyNodeOption>();

const vocabularies = [
  'natural-resource:type',
  'building-material:type',
  'technical-construction:type',
  'professional:type',
  'building:type',
  'building:status',
];
const vocabularyOptions = ref<TaxonomyNodeOption[]>([]);
const termOptions = ref<TaxonomyNodeOption[]>([]);
const views = ['map', 'list'];

onMounted(() => {
  taxonomies
    .init()
    .then(() => {
      vocabularyOptions.value = vocabularies
        .map((voc) => {
          const tx = taxonomies.getTaxonomy(voc);
          if (!tx) return undefined;
          const node = taxonomies.getNode(voc);
          return node
            ? ({
                value: voc,
                label: voc.endsWith(':type')
                  ? taxonomies.getLabel(tx?.names)
                  : taxonomies.getLabel(node.names) || voc,
                vocabulary: node,
                taxonomy: tx,
                urn: taxonomies.toUrn(tx.id, node.id),
              } as TaxonomyNodeOption)
            : undefined;
        })
        .filter((opt) => opt !== undefined);
    })
    .then(() => {
      searchService.search(100);
    });
});

function onVocabularySelect(voc: TaxonomyNodeOption) {
  if (voc === selectedVocabulary.value) {
    // clear associated terms
    searchService.selectedTerms = searchService.selectedTerms.filter(
      (term) => !term.startsWith(voc.urn),
    );
    searchService.search();
  } else {
    selectedVocabulary.value = voc;
  }
  termOptions.value =
    voc.vocabulary.children?.map((child) => ({
      value: child.id,
      label: taxonomies.getLabel(child.names) || child.id,
      taxonomy: voc.taxonomy,
      vocabulary: voc.vocabulary,
      term: child,
      urn: taxonomies.toUrn(voc.taxonomy.id, [voc.vocabulary.id, child.id]),
    })) || [];
}

function onTermSelect(term: TaxonomyNodeOption) {
  if (!selectedVocabulary.value) return;
  const urn = term.urn;
  searchService.selectedTerms.includes(urn)
    ? searchService.selectedTerms.splice(
        searchService.selectedTerms.indexOf(urn),
        1,
      )
    : searchService.selectedTerms.push(urn);
  searchService.search();
}

function onViewSelect(view: string) {
  searchService.selectedView = view;
}

function getSelectedTerms(voc: TaxonomyNodeOption) {
  return (
    searchService.selectedTerms.filter((term) => term.startsWith(voc.urn)) || []
  );
}
</script>
