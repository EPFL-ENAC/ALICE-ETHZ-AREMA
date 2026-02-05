<template>
  <div>
    <q-select
      filled
      map-options
      emit-value
      use-chips
      multiple
      :disable="props.disable"
      v-model="selected"
      :label="t('authors')"
      :hint="t('authors_hint')"
      :options="options"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ t('no_authors_found') }}
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>
              <q-badge color="accent">{{ scope.opt.type }}</q-badge>
              <span class="on-right">{{ scope.opt.label }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import type { SubjectProfile } from 'src/models';
import type { Option } from 'src/components/models';
import { notifyError } from 'src/utils/notify';

interface Props {
  modelValue: string[] | undefined;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const services = useServices();
const service = services.make('subject-profile');

const selected = computed<string[]>({
  get() {
    return props.modelValue || [];
  },
  set(val: string[]) {
    emit('update:modelValue', val);
  },
});
const options = ref<Option[]>([]);

onMounted(() => {
  selected.value = props.modelValue || [];
  // allow selecting only published authors
  void service
    .find({
      $skip: 0,
      $limit: 1000,
      $sort: ['name', false],
      filter: {
        published_at: { $exists: true },
      },
    })
    .then((response) => {
      options.value = response.data.map((item: SubjectProfile) => ({
        label: item.name,
        type: item.type,
        value: `${item.type}:${item.identifier}`,
      }));
    })
    .catch(() => {
      notifyError(t('error_loading_authors'));
    });
});
</script>
