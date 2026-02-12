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
          '--cursor-be1': beColors['be1']?.cursor,
          '--stroke-be2': beColors['be2']?.stroke,
          '--fill-be2': beColors['be2']?.fill,
          '--cursor-be2': beColors['be2']?.cursor,
          '--stroke-be3': beColors['be3']?.stroke,
          '--fill-be3': beColors['be3']?.fill,
          '--cursor-be3': beColors['be3']?.cursor,
          '--stroke-be4': beColors['be4']?.stroke,
          '--fill-be4': beColors['be4']?.fill,
          '--cursor-be4': beColors['be4']?.cursor,
          '--stroke-be5': beColors['be5']?.stroke,
          '--fill-be5': beColors['be5']?.fill,
          '--cursor-be5': beColors['be5']?.cursor,
          '--stroke-be6': beColors['be6']?.stroke,
          '--fill-be6': beColors['be6']?.fill,
          '--cursor-be6': beColors['be6']?.cursor,
          '--stroke-be7': beColors['be7']?.stroke,
          '--fill-be7': beColors['be7']?.fill,
          '--cursor-be7': beColors['be7']?.cursor,
          '--stroke-be8': beColors['be8']?.stroke,
          '--fill-be8': beColors['be8']?.fill,
          '--cursor-be8': beColors['be8']?.cursor,
          '--stroke-be9': beColors['be9']?.stroke,
          '--fill-be9': beColors['be9']?.fill,
          '--cursor-be9': beColors['be9']?.cursor,
          '--stroke-be10': beColors['be10']?.stroke,
          '--fill-be10': beColors['be10']?.fill,
          '--cursor-be10': beColors['be10']?.cursor,
          '--stroke-be11': beColors['be11']?.stroke,
          '--fill-be11': beColors['be11']?.fill,
          '--cursor-be11': beColors['be11']?.cursor,
          '--stroke-be12': beColors['be12']?.stroke,
          '--fill-be12': beColors['be12']?.fill,
          '--cursor-be12': beColors['be12']?.cursor,
          '--stroke-be13': beColors['be13']?.stroke,
          '--fill-be13': beColors['be13']?.fill,
          '--cursor-be13': beColors['be13']?.cursor,
          '--stroke-be14': beColors['be14']?.stroke,
          '--fill-be14': beColors['be14']?.fill,
          '--cursor-be14': beColors['be14']?.cursor,
          '--stroke-be15': beColors['be15']?.stroke,
          '--fill-be15': beColors['be15']?.fill,
          '--cursor-be15': beColors['be15']?.cursor,
          '--stroke-be16': beColors['be16']?.stroke,
          '--fill-be16': beColors['be16']?.fill,
          '--cursor-be16': beColors['be16']?.cursor,
          '--stroke-be17': beColors['be17']?.stroke,
          '--fill-be17': beColors['be17']?.fill,
          '--cursor-be17': beColors['be17']?.cursor,
          '--stroke-be18': beColors['be18']?.stroke,
          '--fill-be18': beColors['be18']?.fill,
          '--cursor-be18': beColors['be18']?.cursor,
          '--stroke-be19': beColors['be19']?.stroke,
          '--fill-be19': beColors['be19']?.fill,
          '--cursor-be19': beColors['be19']?.cursor,
          '--stroke-be20': beColors['be20']?.stroke,
          '--fill-be20': beColors['be20']?.fill,
          '--cursor-be20': beColors['be20']?.cursor,
          '--stroke-be21': beColors['be21']?.stroke,
          '--fill-be21': beColors['be21']?.fill,
          '--cursor-be21': beColors['be21']?.cursor,
          '--stroke-be22': beColors['be22']?.stroke,
          '--fill-be22': beColors['be22']?.fill,
          '--cursor-be22': beColors['be22']?.cursor,
        }"
      />
    </div>
    <q-menu v-model="showMenu" touch-position>
      <q-list style="min-width: 150px">
        <template v-for="(be, index) in hoveredBuildingElements" :key="index">
          <q-item
            clickable
            target="_blank"
            :to="`/_/technical-construction:${be.technical_construction_id}`"
          >
            <q-item-section>
              <q-item-label>{{
                getRelationDocument('technical-construction', be.technical_construction_id)?.name
              }}</q-item-label>
              <q-item-label class="text-hint">{{ getNodeName(be.type) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item dense v-if="hasProfessionals(be) || hasMaterials(be)" class="q-pt-none">
            <q-item-section>
              <q-item-label class="text-hint">
                <span v-if="hasProfessionals(be)">{{ t('professionals') }}</span>
                <span v-if="hasProfessionals(be) && hasMaterials(be)" class="q-mx-xs">/</span>
                <span v-if="hasMaterials(be)">{{ t('materials') }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>
          </q-item>
          <q-menu v-if="hasProfessionals(be) || hasMaterials(be)" anchor="top end" self="top start">
            <q-list style="min-width: 150px">
              <template v-for="(professional, pIndex) in be.professionals" :key="pIndex">
                <q-item
                  clickable
                  target="_blank"
                  :to="`/_/professional:${professional.professional_id}`"
                >
                  <q-item-section>
                    <q-item-label>{{
                      getRelationDocument('professional', professional.professional_id)?.name
                    }}</q-item-label>
                    <q-item-label class="text-hint">{{
                      getRelationDocumentTagTypeNames(
                        'professional',
                        professional.professional_id,
                      )?.join(', ')
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <q-separator v-if="hasProfessionals(be) && hasMaterials(be)" />
              <template v-for="(material, pIndex) in be.materials" :key="pIndex">
                <q-item
                  clickable
                  target="_blank"
                  :to="`/_/building-material:${material.building_material_id}`"
                >
                  <q-item-section>
                    <q-item-label>{{
                      getRelationDocument('building-material', material.building_material_id)?.name
                    }}</q-item-label>
                    <q-item-label class="text-hint">{{
                      getRelationDocumentTagTypeNames(
                        'building-material',
                        material.building_material_id,
                      )?.join(', ')
                    }}</q-item-label>
                    <q-item-label class="text-hint text-secondary">
                      <span v-if="material.weight" class="q-mr-sm">{{
                        t('material_weight', { weight: toLocalizedNumber(material.weight) })
                      }}</span>
                      <span v-if="material.distance">{{
                        t('material_distance', { distance: toLocalizedNumber(material.distance) })
                      }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </template>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import type { BuildingElement, Document } from 'src/models';
import Axonometry from 'src/assets/axonometry.svg';
import { toLocalizedNumber } from 'src/utils/number';

const { t } = useI18n();
const taxonomies = useTaxonomyStore();

interface Props {
  building: Document;
  relations: Document[];
}

const props = defineProps<Props>();

const DEFAULT_COLOR_STROKE = '#cdcdcd';
const DEFAULT_COLOR_FILL = '#f0f0f0';
const ACTIVE_COLOR_STROKE = 'green'; // '#acc6a2';
const ACTIVE_COLOR_FILL = '#dde9da';
const HOVER_COLOR_STROKE = 'orange'; // '#bf7437';
const HOVER_COLOR_FILL = '#e5c7af';

const beTypeHovered = ref<string>('');
const showMenu = ref(false);

const beTypes = computed(() => {
  return (
    props.building.building_elements
      ?.map((be) => be.type?.split('.').pop())
      .filter((id) => id && id.startsWith('be')) || []
  );
});
const beColors = computed(() => {
  const tested = [''];
  const colors: Record<string, { stroke: string; fill: string; cursor: string }> = {};
  for (let i = 1; i <= 22; i++) {
    const beType = `be${i}`;
    colors[beType] = {
      stroke: beTypes.value.includes(beType)
        ? beTypeHovered.value === beType
          ? HOVER_COLOR_STROKE
          : ACTIVE_COLOR_STROKE
        : tested.includes(beType)
          ? ACTIVE_COLOR_STROKE
          : DEFAULT_COLOR_STROKE,
      fill: beTypes.value.includes(beType)
        ? beTypeHovered.value === beType
          ? HOVER_COLOR_FILL
          : ACTIVE_COLOR_FILL
        : tested.includes(beType)
          ? ACTIVE_COLOR_FILL
          : DEFAULT_COLOR_FILL,
      cursor: beTypes.value.includes(beType) ? 'pointer' : 'default',
    };
  }
  return colors;
});

const hasBuildingElements = computed(
  () => props.building.building_elements && props.building.building_elements.length > 0,
);
const buildingElements = computed<BuildingElement[]>(() => {
  return props.building.building_elements?.map((be) => be) || [];
});
const hoveredBuildingElements = computed(() => {
  return beTypeHovered.value
    ? buildingElements.value.filter((be) => be.type?.endsWith(`.${beTypeHovered.value}`))
    : [];
});

function hasProfessionals(be: BuildingElement) {
  return be.professionals && be.professionals.length > 0;
}

function hasMaterials(be: BuildingElement) {
  return be.materials && be.materials.length > 0;
}

function getNodeName(tag: string | undefined) {
  if (!tag) return '';
  const node = taxonomies.getNode(tag);
  return taxonomies.getLabel(node?.names) || tag;
}

function getRelationDocument(entity_type: string, id: number | string | undefined) {
  return props.relations.find((doc) => doc.entity_type === entity_type && `${doc.id}` === `${id}`);
}

function getRelationDocumentTagTypeNames(entity_type: string, id: number | string | undefined) {
  const doc = getRelationDocument(entity_type, id);
  if (!doc) return [];
  const parent = taxonomies.toUrn(entity_type, 'type');
  return doc.tags?.filter((tag) => tag.startsWith(parent)).map((tag) => getNodeName(tag));
}

function onSvgClick(evt: MouseEvent) {
  const target = evt.target as Element | null;
  const be = target?.closest?.('[class*="-be"]') as Element | null;
  if (!be) {
    showMenu.value = false;
    return;
  }
  const beClass = Array.from(be.classList).find((c) => /be\d+$/.test(c));
  if (beClass) {
    const beId = beClass.replace('stroke-', '').replace('fill-', '').replace('el-', '');
    if (beTypes.value.includes(beId)) {
      // change to hover stroke and fill colors in beColors logic
      if (beTypeHovered.value !== beId) {
        beTypeHovered.value = beId; // only allow hovering one element at a time for now
      }
    }
  }
}
</script>

<style scoped>
:deep(.el-be1) {
  cursor: var(--cursor-be1);
}
:deep(.stroke-be1) {
  fill: var(--stroke-be1);
  cursor: var(--cursor-be1);
}
:deep(.fill-be1) {
  fill: var(--fill-be1);
  cursor: var(--cursor-be1);
}

:deep(.el-be2) {
  cursor: var(--cursor-be2);
}
:deep(.stroke-be2) {
  fill: var(--stroke-be2);
  cursor: var(--cursor-be2);
}
:deep(.fill-be2) {
  fill: var(--fill-be2);
  cursor: var(--cursor-be2);
}

:deep(.el-be3) {
  cursor: var(--cursor-be3);
}
:deep(.stroke-be3) {
  fill: var(--stroke-be3);
  cursor: var(--cursor-be3);
}
:deep(.fill-be3) {
  fill: var(--fill-be3);
  cursor: var(--cursor-be3);
}

:deep(.el-be4) {
  cursor: var(--cursor-be4);
}
:deep(.stroke-be4) {
  fill: var(--stroke-be4);
  cursor: var(--cursor-be4);
}
:deep(.fill-be4) {
  fill: var(--fill-be4);
  cursor: var(--cursor-be4);
}

:deep(.el-be5) {
  cursor: var(--cursor-be5);
}
:deep(.stroke-be5) {
  fill: var(--stroke-be5);
  cursor: var(--cursor-be5);
}
:deep(.fill-be5) {
  fill: var(--fill-be5);
  cursor: var(--cursor-be5);
}

:deep(.el-be6) {
  cursor: var(--cursor-be6);
}
:deep(.stroke-be6) {
  fill: var(--stroke-be6);
  cursor: var(--cursor-be6);
}
:deep(.fill-be6) {
  fill: var(--fill-be6);
  cursor: var(--cursor-be6);
}

:deep(.el-be7) {
  cursor: var(--cursor-be7);
}
:deep(.stroke-be7) {
  fill: var(--stroke-be7);
  cursor: var(--cursor-be7);
}
:deep(.fill-be7) {
  fill: var(--fill-be7);
  cursor: var(--cursor-be7);
}

:deep(.el-be8) {
  cursor: var(--cursor-be8);
}
:deep(.stroke-be8) {
  fill: var(--stroke-be8);
  cursor: var(--cursor-be8);
}
:deep(.fill-be8) {
  fill: var(--fill-be8);
  cursor: var(--cursor-be8);
}

:deep(.el-be9) {
  cursor: var(--cursor-be9);
}
:deep(.stroke-be9) {
  fill: var(--stroke-be9);
  cursor: var(--cursor-be9);
}
:deep(.fill-be9) {
  fill: var(--fill-be9);
  cursor: var(--cursor-be9);
}

:deep(.el-be10) {
  cursor: var(--cursor-be10);
}
:deep(.stroke-be10) {
  fill: var(--stroke-be10);
  cursor: var(--cursor-be10);
}
:deep(.fill-be10) {
  fill: var(--fill-be10);
  cursor: var(--cursor-be10);
}

:deep(.el-be11) {
  cursor: var(--cursor-be11);
}
:deep(.stroke-be11) {
  fill: var(--stroke-be11);
  cursor: var(--cursor-be11);
}
:deep(.fill-be11) {
  fill: var(--fill-be11);
  cursor: var(--cursor-be11);
}

:deep(.el-be12) {
  cursor: var(--cursor-be12);
}
:deep(.stroke-be12) {
  fill: var(--stroke-be12);
  cursor: var(--cursor-be12);
}
:deep(.fill-be12) {
  fill: var(--fill-be12);
  cursor: var(--cursor-be12);
}

:deep(.el-be13) {
  cursor: var(--cursor-be13);
}
:deep(.stroke-be13) {
  fill: var(--stroke-be13);
  cursor: var(--cursor-be13);
}
:deep(.fill-be13) {
  fill: var(--fill-be13);
  cursor: var(--cursor-be13);
}

:deep(.el-be14) {
  cursor: var(--cursor-be14);
}
:deep(.stroke-be14) {
  fill: var(--stroke-be14);
  cursor: var(--cursor-be14);
}
:deep(.fill-be14) {
  fill: var(--fill-be14);
  cursor: var(--cursor-be14);
}

:deep(.el-be15) {
  cursor: var(--cursor-be15);
}
:deep(.stroke-be15) {
  fill: var(--stroke-be15);
  cursor: var(--cursor-be15);
}
:deep(.fill-be15) {
  fill: var(--fill-be15);
  cursor: var(--cursor-be15);
}

:deep(.el-be16) {
  cursor: var(--cursor-be16);
}
:deep(.stroke-be16) {
  fill: var(--stroke-be16);
  cursor: var(--cursor-be16);
}
:deep(.fill-be16) {
  fill: var(--fill-be16);
  cursor: var(--cursor-be16);
}

:deep(.el-be17) {
  cursor: var(--cursor-be17);
}
:deep(.stroke-be17) {
  fill: var(--stroke-be17);
  cursor: var(--cursor-be17);
}
:deep(.fill-be17) {
  fill: var(--fill-be17);
  cursor: var(--cursor-be17);
}

:deep(.el-be18) {
  cursor: var(--cursor-be18);
}
:deep(.stroke-be18) {
  fill: var(--stroke-be18);
  cursor: var(--cursor-be18);
}
:deep(.fill-be18) {
  fill: var(--fill-be18);
  cursor: var(--cursor-be18);
}

:deep(.el-be19) {
  cursor: var(--cursor-be19);
}
:deep(.stroke-be19) {
  fill: var(--stroke-be19);
  cursor: var(--cursor-be19);
}
:deep(.fill-be19) {
  fill: var(--fill-be19);
  cursor: var(--cursor-be19);
}

:deep(.el-be20) {
  cursor: var(--cursor-be20);
}
:deep(.stroke-be20) {
  fill: var(--stroke-be20);
  cursor: var(--cursor-be20);
}
:deep(.fill-be20) {
  fill: var(--fill-be20);
  cursor: var(--cursor-be20);
}

:deep(.el-be21) {
  cursor: var(--cursor-be21);
}
:deep(.stroke-be21) {
  fill: var(--stroke-be21);
  cursor: var(--cursor-be21);
}
:deep(.fill-be21) {
  fill: var(--fill-be21);
  cursor: var(--cursor-be21);
}

:deep(.el-be22) {
  cursor: var(--cursor-be22);
}
:deep(.stroke-be22) {
  fill: var(--stroke-be22);
  cursor: var(--cursor-be22);
}
:deep(.fill-be22) {
  fill: var(--fill-be22);
  cursor: var(--cursor-be22);
}
</style>
