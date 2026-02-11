<template>
  <div>
    <div v-if="hasBuildingElements" class="text-center">
      <Axonometry
        style="max-height: 800px"
        @mouseover="onSvgClick"
        @click="onSvgClick"
        :style="{
          '--stroke-be1': beColors['be1']?.stroke,
          '--fill-be1': beColors['be1']?.fill,
          '--stroke-be2': beColors['be2']?.stroke,
          '--fill-be2': beColors['be2']?.fill,
          '--stroke-be3': beColors['be3']?.stroke,
          '--fill-be3': beColors['be3']?.fill,
          '--stroke-be4': beColors['be4']?.stroke,
          '--fill-be4': beColors['be4']?.fill,
          '--stroke-be5': beColors['be5']?.stroke,
          '--fill-be5': beColors['be5']?.fill,
          '--stroke-be6': beColors['be6']?.stroke,
          '--fill-be6': beColors['be6']?.fill,
          '--stroke-be7': beColors['be7']?.stroke,
          '--fill-be7': beColors['be7']?.fill,
          '--stroke-be8': beColors['be8']?.stroke,
          '--fill-be8': beColors['be8']?.fill,
          '--stroke-be9': beColors['be9']?.stroke,
          '--fill-be9': beColors['be9']?.fill,
          '--stroke-be10': beColors['be10']?.stroke,
          '--fill-be10': beColors['be10']?.fill,
          '--stroke-be11': beColors['be11']?.stroke,
          '--fill-be11': beColors['be11']?.fill,
          '--stroke-be12': beColors['be12']?.stroke,
          '--fill-be12': beColors['be12']?.fill,
          '--stroke-be13': beColors['be13']?.stroke,
          '--fill-be13': beColors['be13']?.fill,
          '--stroke-be14': beColors['be14']?.stroke,
          '--fill-be14': beColors['be14']?.fill,
          '--stroke-be15': beColors['be15']?.stroke,
          '--fill-be15': beColors['be15']?.fill,
          '--stroke-be16': beColors['be16']?.stroke,
          '--fill-be16': beColors['be16']?.fill,
          '--stroke-be17': beColors['be17']?.stroke,
          '--fill-be17': beColors['be17']?.fill,
          '--stroke-be18': beColors['be18']?.stroke,
          '--fill-be18': beColors['be18']?.fill,
          '--stroke-be19': beColors['be19']?.stroke,
          '--fill-be19': beColors['be19']?.fill,
          '--stroke-be20': beColors['be20']?.stroke,
          '--fill-be20': beColors['be20']?.fill,
          '--stroke-be21': beColors['be21']?.stroke,
          '--fill-be21': beColors['be21']?.fill,
          '--stroke-be22': beColors['be22']?.stroke,
          '--fill-be22': beColors['be22']?.fill,
        }"
      />
    </div>
    <q-menu v-model="showMenu" touch-position>
      <q-list style="min-width: 100px">
        <template v-for="be in hoveredBuildingElements" :key="be.id">
          <q-item>
            <q-item-section>
              <q-item-label>{{ be.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <router-link :to="`/_/${be.entity_type}:${be.id}`">
                <q-icon name="arrow_forward" />
              </router-link>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
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

const hoveredBuildingElementId = ref<string>('');
const showMenu = ref(false);

const beColors = computed(() => {
  const colors: Record<string, { stroke: string; fill: string }> = {};
  for (let i = 1; i <= 22; i++) {
    const beId = `be${i}`;
    colors[beId] = {
      stroke: buildingElementIds.value.includes(beId)
        ? hoveredBuildingElementId.value === beId
          ? HOVER_COLOR_STROKE
          : ACTIVE_COLOR_STROKE
        : DEFAULT_COLOR_STROKE,
      fill: buildingElementIds.value.includes(beId)
        ? hoveredBuildingElementId.value === beId
          ? HOVER_COLOR_FILL
          : ACTIVE_COLOR_FILL
        : DEFAULT_COLOR_FILL,
    };
  }
  return colors;
});

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
const hoveredBuildingElements = computed(() => {
  return hoveredBuildingElementId.value
    ? buildingElements.value.filter((doc) =>
        doc.tags?.find(
          (tag) =>
            tag.startsWith(TECHNICAL_CONSTRUCTION_TYPE) &&
            tag.endsWith(`.${hoveredBuildingElementId.value}`),
        ),
      )
    : [];
});

function onSvgClick(evt: MouseEvent) {
  const target = evt.target as Element | null;
  const be = target?.closest?.('[class*="-be"]') as Element | null;
  if (!be) {
    showMenu.value = false;
    return;
  }
  const beClass = Array.from(be.classList).find((c) => /be\d+$/.test(c));
  if (beClass) {
    const beId = beClass.replace('stroke-', '').replace('fill-', '');
    if (buildingElementIds.value.includes(beId)) {
      // change to hover stroke and fill colors in beColors logic
      if (hoveredBuildingElementId.value !== beId) {
        hoveredBuildingElementId.value = beId; // only allow hovering one element at a time for now
      }
    }
  }
}
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
