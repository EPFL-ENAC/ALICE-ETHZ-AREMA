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
        :label="vocOpt.label"
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
      <template v-for="termOpt in termOptions" :key="termOpt.urn">
        <q-btn-dropdown
          v-if="termOpt.children?.length"
          :outline="!isTermSelected(termOpt)"
          :disable="searchService.searching"
          color="primary"
          unelevated
          square
          no-caps
          split
          size="12px"
          class="on-left q-mb-sm"
          @click="onTermSelect(termOpt)"
        >
          <template v-slot:label>
            {{ termOpt.label }}
            <q-badge
              v-if="getSelectedTerms(termOpt).length"
              color="primary"
              class="text-white q-ml-xs"
            >
              {{ getSelectedTerms(termOpt).length }}
            </q-badge>
          </template>
          <q-list>
            <template v-for="childOpt in termOpt.children" :key="childOpt.urn">
              <q-item
                clickable
                class="text-primary"
                :active="isTermSelected(childOpt)"
                active-class="text-white bg-primary"
                @click="onTermSelect(childOpt)"
              >
                <q-item-section>
                  <q-item-label>{{ childOpt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-else
          :outline="!isTermSelected(termOpt)"
          :disable="searchService.searching"
          color="primary"
          unelevated
          square
          no-caps
          size="12px"
          :label="termOpt.label"
          class="on-left q-mb-sm"
          @click="onTermSelect(termOpt)"
        />
      </template>
    </div>
    <div class="q-mt-md">
      <q-spinner-dots v-if="searchService.searching" size="md" />
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <videos-results />
  </div>
</template>

<script setup lang="ts">
import VideosResults from 'src/components/VideosResults.vue';
import { VocabularyOption, TermOption } from 'src/components/models';

const taxonomies = useTaxonomyStore();
const searchService = useSearchService();

const selectedVocabulary = ref<VocabularyOption>();

const vocabularies = [
  'natural-resource:type',
  'building-material:type',
  'technical-construction:type',
  'professional:type',
  'building:type',
  'building:status',
];
const vocabularyOptions = ref<VocabularyOption[]>([]);
const termOptions = ref<TermOption[]>([]);

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
                urn: taxonomies.toUrn(tx.id, node.id),
                taxonomy: tx,
                vocabulary: node,
              } as VocabularyOption)
            : undefined;
        })
        .filter((opt) => opt !== undefined);
    })
    .then(() => {
      searchService.search_videos(100);
    });
});

function onVocabularySelect(voc: VocabularyOption) {
  if (voc === selectedVocabulary.value) {
    // any selected terms ?
    if (!searchService.selectedTerms.some((term) => term.startsWith(voc.urn))) {
      // select all terms
      searchService.selectedTerms.push(
        ...termOptions.value
          .map((term) =>
            term.children ? term.children.map((child) => child.urn) : term.urn,
          )
          .flat(),
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
    voc.vocabulary.children?.map((term) => {
      const termOpt: TermOption = {
        value: term.id,
        label: taxonomies.getLabel(term.names) || term.id,
        urn: taxonomies.toUrn(voc.taxonomy.id, [voc.vocabulary.id, term.id]),
      };
      if (term.children?.length) {
        termOpt.children = term.children.map((child) => ({
          value: child.id,
          label: taxonomies.getLabel(child.names) || child.id,
          urn: taxonomies.toUrn(voc.taxonomy.id, [
            voc.vocabulary.id,
            term.id,
            child.id,
          ]),
        }));
      }
      return termOpt;
    }) || [];
}

function onTermSelect(term: TermOption) {
  if (!selectedVocabulary.value) return;
  searchService.selectTerm(term);
  searchService.search_videos();
}

function getSelectedTerms(voc: TermOption) {
  return searchService.getSelectedTerms(voc);
}

function isTermSelected(term: TermOption) {
  return searchService.isTermSelected(term);
}
</script>
