<template>
  <div class="masonry">
    <template v-for="section in sections" :key="section">
      <div class="col-12 col-lg-6" v-if="hasValues(section)">
        <div class="text-h6" :title="getSectionDescription(section)">
          {{ getSectionLabel(section) }}
        </div>
        <q-list dense class="q-mb-md">
          <template v-for="field in fields[section]" :key="field">
            <q-item v-if="hasFieldValue(field)" class="q-pa-none" style="padding: 0 !important">
              <q-item-section :title="getFieldDescription(section, field)">
                <q-item-label>
                  <span> {{ getFieldLabel(section, field) }} </span>
                  <span
                    v-if="getFieldSymbol(section, field) || getFieldUnit(section, field)"
                    class="text-secondary q-mx-xs"
                    >-</span
                  >
                  <span v-if="getFieldSymbol(section, field)" class="text-bold q-mx-xs">{{
                    getFieldSymbol(section, field)
                  }}</span>
                  <span v-if="getFieldUnit(section, field)"
                    >[{{ getFieldUnit(section, field) }}]</span
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="hasFieldValue(field)" class="q-pa-none" style="padding: 0 !important">
              <q-item-section>
                <range-panel
                  :urn="toUrn(section, field)"
                  :property="field"
                  :low="getFieldValues(field)[0]"
                  :std="getFieldValues(field)[1]"
                  :high="getFieldValues(field)[2]"
                  style="width: 100%"
                  class="q-mb-sm"
                />
              </q-item-section>
            </q-item>
            <q-separator v-if="hasFieldValue(field)" color="primary" />
          </template>
        </q-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import RangePanel from 'src/components/RangePanel.vue';

interface Props {
  document: Document;
}

const props = defineProps<Props>();
const taxonomyStore = useTaxonomyStore();

const { t, locale } = useI18n();

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

function getFieldDescription(section: string, field: string) {
  const fieldNode = getFieldNode(section, field);
  if (!fieldNode) return '';
  const descriptions = fieldNode.descriptions;
  return descriptions?.[locale.value] || '';
}

function getFieldNodeAttributes(section: string, field: string) {
  const fieldNode = getFieldNode(section, field);
  return fieldNode?.attributes || {};
}

function getFieldSymbol(section: string, field: string) {
  const attributes = getFieldNodeAttributes(section, field);
  return attributes['symbol'] || '';
}

function getFieldUnit(section: string, field: string) {
  const attributes = getFieldNodeAttributes(section, field);
  return attributes['unit'] || '';
}

function getFieldValues(field: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = props.document as { [key: string]: any };
  return [doc[`${field}_low`], doc[field], doc[`${field}_high`]];
}
</script>

<style scoped>
.masonry {
  column-count: 2;
  column-gap: 1rem;
}
@media (max-width: 1024px) {
  .masonry {
    column-count: 1;
  }
}
</style>
