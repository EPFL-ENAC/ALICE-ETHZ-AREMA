<template>
  <div class="masonry">
    <template v-for="section in sections" :key="section">
      <div class="col-12 col-lg-6" v-if="hasValues(section)">
        <div class="text-h6 q-mb-sm" :title="getSectionDescription(section)">
          {{ getSectionLabel(section) }}
        </div>
        <q-list dense class="q-mb-md">
          <template v-for="field in fields[section]" :key="field">
            <q-item
              v-if="hasFieldValue(field)"
              class="item q-pa-none"
              style="padding: 0 !important"
            >
              <q-item-section>
                <q-item-label>
                  <span> {{ getFieldLabel(section, field) }} </span>
                  <q-icon
                    name="info"
                    size="xs"
                    class="info text-grey-6 q-ml-xs"
                    @click="onShowTerm(section, field)"
                  />
                </q-item-label>
                <range-panel
                  :urn="toUrn(section, field)"
                  :property="field"
                  :low="getFieldValues(field)[0]"
                  :std="getFieldValues(field)[1]"
                  :high="getFieldValues(field)[2]"
                  style="width: 100%"
                  class="q-my-sm"
                />
                <q-separator v-if="hasFieldValue(field)" color="primary" class="q-mt-sm" />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </template>
    <term-dialog :model-value="showTerm" :term="term" @update:model-value="showTerm = $event" />
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import type { Term } from 'src/components/models';
import RangePanel from 'src/components/RangePanel.vue';
import TermDialog from 'src/components/TermDialog.vue';

interface Props {
  document: Document;
}

const props = defineProps<Props>();
const taxonomyStore = useTaxonomyStore();

const { t, locale } = useI18n();

const showTerm = ref(false);
const term = ref<Term | null>(null);

const physicsTaxo = computed(() => taxonomyStore.getTaxonomy('physical-characteristics'));
const sections = computed(() => physicsTaxo.value?.children?.map((child) => child.id) ?? []);

const fields = computed(() => {
  const result: Record<string, string[]> = {};
  physicsTaxo.value?.children?.forEach((section) => {
    if (section.children) {
      result[section.id] = section.children.map((child) => child.id);
    }
  });
  return result;
});

function toUrn(section: string, field: string) {
  return taxonomyStore.toUrn('physical-characteristics', `${section}.${field}`);
}

function hasValues(section: string) {
  return physicsTaxo.value?.children
    ?.find((child) => child.id === section)
    ?.children?.some((child) => hasFieldValue(child.id));
}

function hasFieldValue(field: string) {
  return getFieldValues(field).some((value) => value);
}

function getSectionLabel(section: string) {
  const sectionNode = physicsTaxo.value?.children?.find((child) => child.id === section);
  if (!sectionNode) return section;
  const names = sectionNode.names;
  return names?.[locale.value] || t(section);
}

function getSectionDescription(section: string) {
  const sectionNode = physicsTaxo.value?.children?.find((child) => child.id === section);
  if (!sectionNode) return '';
  const descriptions = sectionNode.descriptions;
  return descriptions?.[locale.value] || '';
}

function getFieldNode(section: string, field: string) {
  const sectionNode = physicsTaxo.value?.children?.find((child) => child.id === section);
  return sectionNode?.children?.find((child) => child.id === field);
}

function getFieldLabel(section: string, field: string) {
  const fieldNode = getFieldNode(section, field);
  if (!fieldNode) return field;
  const names = fieldNode?.names;
  return names?.[locale.value] || t(field);
}

function getFieldValues(field: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = props.document as { [key: string]: any };
  return [doc[`${field}_low`], doc[field], doc[`${field}_high`]];
}

function onShowTerm(section: string, field: string) {
  const fieldNode = getFieldNode(section, field);
  if (!fieldNode) return;
  term.value = {
    urn: taxonomyStore.toUrn('physical-characteristics', `${section}.${field}`),
  } as Term;
  showTerm.value = true;
}
</script>

<style scoped>
.masonry {
  column-count: 2;
  column-gap: 1rem;
}
.item {
  break-inside: avoid;
  margin-bottom: 1rem;
}
@media (max-width: 1024px) {
  .masonry {
    column-count: 1;
  }
}
.info {
  cursor: help;
}
</style>
