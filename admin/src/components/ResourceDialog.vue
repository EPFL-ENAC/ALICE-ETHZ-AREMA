<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-xl">
      <q-card-actions>
        <div class="text-h6 q-ml-sm">{{ t(readOnly ? 'view' : editMode ? 'edit' : 'add') }}</div>
        <q-space />
        <q-btn flat icon="close" color="primary" v-close-popup />
      </q-card-actions>
      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="t('general') + ' *'" />
          <q-tab name="multimedia" :label="t('multimedia') + ' *'" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  :disable="readOnly"
                  filled
                  v-model="selected.name"
                  :label="t('name') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-6">
                <taxonomy-select
                  :disable="readOnly"
                  v-model="selected.type"
                  entity-type="natural-resource"
                  path="type"
                  :label="t('type') + ' *'"
                />
              </div>
            </div>
            <text-input
              :disable="readOnly"
              v-model="selected.description"
              :label="t('description')"
              help="resource-description"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.article_top"
              :label="t('article_top')"
              help="resource-article-top"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.article_bottom"
              :label="t('article_bottom')"
              help="resource-article-bottom"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.side_note"
              :label="t('side_note')"
              help="resource-side-note"
              class="q-mb-md"
            />
            <text-input
              :disable="readOnly"
              v-model="selected.external_links"
              :label="t('external_links')"
              help="resource-links"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input :disable="readOnly" v-if="selected.files" v-model="selected.files" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn
          v-if="readOnly"
          flat
          :label="t('close')"
          color="secondary"
          @click="onCancel"
          v-close-popup
        />
        <q-btn
          v-if="!readOnly"
          flat
          :label="t('cancel')"
          color="secondary"
          @click="onCancel"
          :disable="saving"
          v-close-popup
        />
        <q-btn
          v-if="!readOnly"
          :label="t('save')"
          color="primary"
          @click="onSave"
          :disable="!isValid || saving"
          :loading="saving"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { NaturalResource } from 'src/models';
import { notifyError } from 'src/utils/notify';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';
import TextInput from 'src/components/TextInput.vue';

interface DialogProps {
  modelValue: boolean;
  item: NaturalResource;
  readOnly?: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();

const filesStore = useFilesStore();
const services = useServices();
const service = services.make('natural-resource');

const showDialog = ref(props.modelValue);
const selected = ref<NaturalResource>({
  name: '',
  type: '',
  files: [],
} as NaturalResource);
const editMode = ref(false);
const tab = ref('general');
const saving = ref(false);

const isValid = computed(() => {
  return (
    selected.value.name &&
    selected.value.type &&
    selected.value.files !== undefined &&
    selected.value.files.length >= 1
  );
});

onMounted(() => {
  init(props.modelValue);
});

watch(
  () => props.modelValue,
  (value) => init(value),
  { immediate: true },
);

function init(value: boolean) {
  tab.value = 'general';
  if (value) {
    // deep copy
    selected.value = JSON.parse(JSON.stringify(props.item));
    editMode.value = selected.value.id !== undefined;
    tab.value = 'general';
  }
  if (selected.value.files === undefined) {
    selected.value.files = [];
  }
  showDialog.value = value;
}

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function onCancel() {
  filesStore.clearFilesToDelete();
}

function onSave() {
  if (selected.value === undefined) return;
  saving.value = true;
  if (selected.value.id) {
    service
      .update(selected.value.id, selected.value)
      .then(() => {
        void filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      })
      .finally(() => {
        saving.value = false;
      });
  } else {
    service
      .create(selected.value)
      .then(() => {
        void filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      })
      .finally(() => {
        saving.value = false;
      });
  }
}
</script>
