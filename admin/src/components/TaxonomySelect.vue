<template>
  <div>
    <q-select
      filled
      :dense="dense"
      v-model="selected"
      :options="options"
      :label="label"
      @update:model-value="onSelection"
      :multiple="multiple"
      :use-chips="multiple"
      :clearable="!multiple"
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label :class="`option-${scope.opt.level}`">
              {{ scope.opt.label }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'TaxonomySelect',
});
</script>
<script setup lang="ts">
import { Option } from 'src/components/models';

interface Props {
  modelValue: string | string[] | null | undefined;
  entityType: string;
  path: string;
  label: string;
  multiple?: boolean;
  dense?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  dense: false,
});
const emit = defineEmits(['update:modelValue']);

const taxonomyStore = useTaxonomyStore();

const selected = ref(props.modelValue);
const options = ref<Option[]>([]);

onMounted(loadOptions);

watch(() => props.modelValue, loadOptions);

function loadOptions() {
  if (options.value.length > 0) {
    return;
  }
  taxonomyStore.getTaxonomyNode(props.entityType, props.path).then((node) => {
    options.value = taxonomyStore.asOptions(props.entityType, node, props.path);
  });
}

function onSelection() {
  emit('update:modelValue', selected.value);
}
</script>
