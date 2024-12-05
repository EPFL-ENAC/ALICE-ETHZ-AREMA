<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h5 text-uppercase text-primary">
      {{ $t('filters') }}
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <q-input
      v-model="search"
      borderless
      input-style="font-size: 48px;"
      input-class="text-secondary"
      :placeholder="$t('type_here')"
      class="q-mt-md q-mb-md"
    />
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
    <div>
      <q-btn
        v-for="vocOpt in vocabularyOptions"
        :key="vocOpt.value"
        :outline="vocOpt !== selectedVocabulary"
        color="primary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(vocOpt.label)"
        class="on-left q-mb-sm"
        @click="onVocabularySelect(vocOpt)"
      />
    </div>
    <div class="q-mt-sm" v-if="selectedVocabulary">
      <q-btn
        v-for="termOpt in termOptions"
        :key="termOpt.urn"
        :outline="!selectedTerms.includes(termOpt.urn)"
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
    <div class="q-mt-md">{{ selectedTerms }}</div>
    <div class="q-mt-md">
      <q-btn
        v-for="view in views"
        :key="view"
        :outline="view !== selectedView"
        color="secondary"
        unelevated
        square
        no-caps
        size="md"
        :label="$t(view)"
        class="on-left"
        @click="onViewSelect(view)"
      />
    </div>
    <q-separator size="2px" class="bg-primary q-mt-md q-mb-md" />
  </q-page>
</template>

<script setup lang="ts">
import { TaxonomyNodeOption } from 'src/components/models';

const taxonomies = useTaxonomyStore();

const search = ref('');
const selectedVocabulary = ref<TaxonomyNodeOption>();
const selectedTerms = ref<string[]>([]);
const selectedView = ref('map');

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
  taxonomies.init().then(() => {
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
  });
});

function onVocabularySelect(voc: TaxonomyNodeOption) {
  selectedVocabulary.value = voc;
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
  selectedTerms.value.includes(urn)
    ? selectedTerms.value.splice(selectedTerms.value.indexOf(urn), 1)
    : selectedTerms.value.push(urn);
}

function onViewSelect(view: string) {
  selectedView.value = view;
}
</script>
