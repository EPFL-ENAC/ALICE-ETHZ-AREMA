<template>
  <div>
    <div class="row q-col-gutter-lg">
      <div class="col">
        <q-select
          filled
          v-model="entity.technical_construction_id"
          :options="technicalConstructionsOptions"
          map-options
          emit-value
          clearable
          :label="$t('technical_construction')"
          :hint="$t('building_element_technical_construction_used_hint')"
        />
      </div>
      <div class="col">
        <q-select
          filled
          v-model="entity.professional_ids"
          :options="professionalsOptions"
          map-options
          emit-value
          multiple
          use-chips
          :label="$t('professionals')"
          :hint="$t('building_element_professionals_hint')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'BuildingElementForm',
});
</script>
<script setup lang="ts">
import { BuildingElement } from 'src/models';
import { Option } from './models';

interface Props {
  modelValue: BuildingElement;
  technicalConstructionsOptions: Option[];
  professionalsOptions: Option[];
}

const props = defineProps<Props>();

const entity = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    entity.value = value;
  },
);
</script>
