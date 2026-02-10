<template>
  <div>
    <div v-if="hasBuildingElements" class="text-center">
      <Axonometry
        style="max-height: 800px"
        :style="{
          '--stroke-be1': be1ColorStroke,
          '--fill-be1': be1ColorFill,
          '--stroke-be2': be2ColorStroke,
          '--fill-be2': be2ColorFill,
          '--stroke-be3': be3ColorStroke,
          '--fill-be3': be3ColorFill,
          '--stroke-be4': be4ColorStroke,
          '--fill-be4': be4ColorFill,
          '--stroke-be5': be5ColorStroke,
          '--fill-be5': be5ColorFill,
          '--stroke-be6': be6ColorStroke,
          '--fill-be6': be6ColorFill,
          '--stroke-be7': be7ColorStroke,
          '--fill-be7': be7ColorFill,
          '--stroke-be8': be8ColorStroke,
          '--fill-be8': be8ColorFill,
          '--stroke-be9': be9ColorStroke,
          '--fill-be9': be9ColorFill,
          '--stroke-be10': be10ColorStroke,
          '--fill-be10': be10ColorFill,
          '--stroke-be11': be11ColorStroke,
          '--fill-be11': be11ColorFill,
          '--stroke-be12': be12ColorStroke,
          '--fill-be12': be12ColorFill,
          '--stroke-be13': be13ColorStroke,
          '--fill-be13': be13ColorFill,
          '--stroke-be14': be14ColorStroke,
          '--fill-be14': be14ColorFill,
          '--stroke-be15': be15ColorStroke,
          '--fill-be15': be15ColorFill,
          '--stroke-be16': be16ColorStroke,
          '--fill-be16': be16ColorFill,
          '--stroke-be17': be17ColorStroke,
          '--fill-be17': be17ColorFill,
          '--stroke-be18': be18ColorStroke,
          '--fill-be18': be18ColorFill,
          '--stroke-be19': be19ColorStroke,
          '--fill-be19': be19ColorFill,
          '--stroke-be20': be20ColorStroke,
          '--fill-be20': be20ColorFill,
          '--stroke-be21': be21ColorStroke,
          '--fill-be21': be21ColorFill,
          '--stroke-be22': be22ColorStroke,
          '--fill-be22': be22ColorFill,
        }"
      />
      <div>{{ buildingElementIds }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import Axonometry from 'src/assets/axonometry.svg';

interface Props {
  relations: Document[];
}

const TECHNICAL_CONSTRUCTION_TYPE = 'urn:arema:technical-construction:type';

const props = defineProps<Props>();

const DEFAULT_COLOR_STROKE = '#cdcdcd';
const DEFAULT_COLOR_FILL = '#f0f0f0';
const ACTIVE_COLOR_STROKE = 'green'; // '#acc6a2';
const ACTIVE_COLOR_FILL = '#dde9da';
const HOVER_COLOR_STROKE = 'orange'; // '#bf7437';
const HOVER_COLOR_FILL = '#e5c7af';

const be1ColorStroke = computed(() =>
  buildingElementIds.value.includes('be1') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be1ColorFill = computed(() =>
  buildingElementIds.value.includes('be1') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be2ColorStroke = computed(() =>
  buildingElementIds.value.includes('be2') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be2ColorFill = computed(() =>
  buildingElementIds.value.includes('be2') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be3ColorStroke = computed(() =>
  buildingElementIds.value.includes('be3') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be3ColorFill = computed(() =>
  buildingElementIds.value.includes('be3') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be4ColorStroke = computed(() =>
  buildingElementIds.value.includes('be4') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be4ColorFill = computed(() =>
  buildingElementIds.value.includes('be4') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be5ColorStroke = computed(() =>
  buildingElementIds.value.includes('be5') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be5ColorFill = computed(() =>
  buildingElementIds.value.includes('be5') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be6ColorStroke = computed(() =>
  buildingElementIds.value.includes('be6') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be6ColorFill = computed(() =>
  buildingElementIds.value.includes('be6') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be7ColorStroke = computed(() =>
  buildingElementIds.value.includes('be7') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be7ColorFill = computed(() =>
  buildingElementIds.value.includes('be7') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be8ColorStroke = computed(() =>
  buildingElementIds.value.includes('be8') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be8ColorFill = computed(() =>
  buildingElementIds.value.includes('be8') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be9ColorStroke = computed(() =>
  buildingElementIds.value.includes('be9') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be9ColorFill = computed(() =>
  buildingElementIds.value.includes('be9') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be10ColorStroke = computed(() =>
  buildingElementIds.value.includes('be10') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be10ColorFill = computed(() =>
  buildingElementIds.value.includes('be10') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be11ColorStroke = computed(() =>
  buildingElementIds.value.includes('be11') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be11ColorFill = computed(() =>
  buildingElementIds.value.includes('be11') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be12ColorStroke = computed(() =>
  buildingElementIds.value.includes('be12') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be12ColorFill = computed(() =>
  buildingElementIds.value.includes('be12') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be13ColorStroke = computed(() =>
  buildingElementIds.value.includes('be13') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be13ColorFill = computed(() =>
  buildingElementIds.value.includes('be13') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be14ColorStroke = computed(() =>
  buildingElementIds.value.includes('be14') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be14ColorFill = computed(() =>
  buildingElementIds.value.includes('be14') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be15ColorStroke = computed(() =>
  buildingElementIds.value.includes('be15') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be15ColorFill = computed(() =>
  buildingElementIds.value.includes('be15') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be16ColorStroke = computed(() =>
  buildingElementIds.value.includes('be16') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be16ColorFill = computed(() =>
  buildingElementIds.value.includes('be16') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be17ColorStroke = computed(() =>
  buildingElementIds.value.includes('be17') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be17ColorFill = computed(() =>
  buildingElementIds.value.includes('be17') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be18ColorStroke = computed(() =>
  buildingElementIds.value.includes('be18') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be18ColorFill = computed(() =>
  buildingElementIds.value.includes('be18') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be19ColorStroke = computed(() =>
  buildingElementIds.value.includes('be19') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be19ColorFill = computed(() =>
  buildingElementIds.value.includes('be19') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be20ColorStroke = computed(() =>
  buildingElementIds.value.includes('be20') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be20ColorFill = computed(() =>
  buildingElementIds.value.includes('be20') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be21ColorStroke = computed(() =>
  buildingElementIds.value.includes('be21') ? HOVER_COLOR_STROKE : ACTIVE_COLOR_STROKE,
);
const be21ColorFill = computed(() =>
  buildingElementIds.value.includes('be21') ? HOVER_COLOR_FILL : ACTIVE_COLOR_FILL,
);
const be22ColorStroke = computed(() =>
  buildingElementIds.value.includes('be22') ? HOVER_COLOR_STROKE : DEFAULT_COLOR_STROKE,
);
const be22ColorFill = computed(() =>
  buildingElementIds.value.includes('be22') ? HOVER_COLOR_FILL : DEFAULT_COLOR_FILL,
);

const buildingElements = computed<Document[]>(() => {
  return (
    props.relations.filter(
      (doc) =>
        doc.tags && doc.tags.filter((tag) => tag.startsWith(TECHNICAL_CONSTRUCTION_TYPE)).length,
    ) || []
  );
});
const hasBuildingElements = computed(() => buildingElements.value.length > 0);
const buildingElementIds = computed(() => {
  // filter tags for technical construction type, extract the id and flatten array of arrays to a single array of ids
  return buildingElements.value
    .map((doc) =>
      doc.tags
        ?.filter((tag) => tag.startsWith(TECHNICAL_CONSTRUCTION_TYPE))
        // contains the id of the building element, e.g. "urn:arema:technical-construction:type.envelope.be15" -> "be15"
        .map((tag) => tag.split('.').pop())
        .join('|'),
    )
    .join('|')
    .split('|');
});
</script>

<style scoped>
:deep(.stroke-be1) {
  fill: var(--stroke-be1);
}
:deep(.fill-be1) {
  fill: var(--fill-be1);
}

:deep(.stroke-be2) {
  fill: var(--stroke-be2);
}
:deep(.fill-be2) {
  fill: var(--fill-be2);
}

:deep(.stroke-be3) {
  fill: var(--stroke-be3);
}
:deep(.fill-be3) {
  fill: var(--fill-be3);
}

:deep(.stroke-be4) {
  fill: var(--stroke-be4);
}
:deep(.fill-be4) {
  fill: var(--fill-be4);
}

:deep(.stroke-be5) {
  fill: var(--stroke-be5);
}
:deep(.fill-be5) {
  fill: var(--fill-be5);
}

:deep(.stroke-be6) {
  fill: var(--stroke-be6);
}
:deep(.fill-be6) {
  fill: var(--fill-be6);
}

:deep(.stroke-be7) {
  fill: var(--stroke-be7);
}
:deep(.fill-be7) {
  fill: var(--fill-be7);
}

:deep(.stroke-be8) {
  fill: var(--stroke-be8);
}
:deep(.fill-be8) {
  fill: var(--fill-be8);
}

:deep(.stroke-be9) {
  fill: var(--stroke-be9);
}
:deep(.fill-be9) {
  fill: var(--fill-be9);
}

:deep(.stroke-be10) {
  fill: var(--stroke-be10);
}
:deep(.fill-be10) {
  fill: var(--fill-be10);
}

:deep(.stroke-be11) {
  fill: var(--stroke-be11);
}
:deep(.fill-be11) {
  fill: var(--fill-be11);
}

:deep(.stroke-be12) {
  fill: var(--stroke-be12);
}
:deep(.fill-be12) {
  fill: var(--fill-be12);
}

:deep(.stroke-be13) {
  fill: var(--stroke-be13);
}
:deep(.fill-be13) {
  fill: var(--fill-be13);
}

:deep(.stroke-be14) {
  fill: var(--stroke-be14);
}
:deep(.fill-be14) {
  fill: var(--fill-be14);
}

:deep(.stroke-be15) {
  fill: var(--stroke-be15);
}
:deep(.fill-be15) {
  fill: var(--fill-be15);
}

:deep(.stroke-be16) {
  fill: var(--stroke-be16);
}
:deep(.fill-be16) {
  fill: var(--fill-be16);
}

:deep(.stroke-be17) {
  fill: var(--stroke-be17);
}
:deep(.fill-be17) {
  fill: var(--fill-be17);
}

:deep(.stroke-be18) {
  fill: var(--stroke-be18);
}
:deep(.fill-be18) {
  fill: var(--fill-be18);
}

:deep(.stroke-be19) {
  fill: var(--stroke-be19);
}
:deep(.fill-be19) {
  fill: var(--fill-be19);
}

:deep(.stroke-be20) {
  fill: var(--stroke-be20);
}
:deep(.fill-be20) {
  fill: var(--fill-be20);
}

:deep(.stroke-be21) {
  fill: var(--stroke-be21);
}
:deep(.fill-be21) {
  fill: var(--fill-be21);
}

:deep(.stroke-be22) {
  fill: var(--stroke-be22);
}
:deep(.fill-be22) {
  fill: var(--fill-be22);
}
</style>
