<template>
  <div>
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('videos') }}
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
      @update:model-value="searchService.search_videos()"
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
        size="12px"
        :label="$t(termOpt.label)"
        class="on-left q-mb-sm"
        @click="onTermSelect(termOpt)"
      />
    </div>
    <div class="q-mt-md">
      <q-spinner-dots v-if="searchService.searching" size="md" />
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <videos-results />
  </div>
</template>

<script setup lang="ts">
import { TaxonomyNodeOption } from 'src/components/models';
import VideosResults from './VideosResults.vue';

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
      searchService.search_videos(100);
    });
});

function onVocabularySelect(voc: TaxonomyNodeOption) {
  if (voc === selectedVocabulary.value) {
    // any selected terms ?
    if (!searchService.selectedTerms.some((term) => term.startsWith(voc.urn))) {
      // select all terms
      searchService.selectedTerms.push(
        ...termOptions.value.map((term) => term.urn),
      );
    } else {
      // clear associated terms
      searchService.selectedTerms = searchService.selectedTerms.filter(
        (term) => !term.startsWith(voc.urn),
      );
    }
    searchService.search_videos();
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
  searchService.search_videos();
}

function getSelectedTerms(voc: TaxonomyNodeOption) {
  return (
    searchService.selectedTerms.filter((term) => term.startsWith(voc.urn)) || []
  );
}
</script>
