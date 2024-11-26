<template>
  <q-dialog v-model="showDialog" persistent @hide="onHide">
    <q-card class="dialog-lg">
      <q-card-section>
        <div class="text-h6">{{ $t(editMode ? 'edit' : 'add') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-tabs v-model="tab" dense align="left" no-caps>
          <q-tab name="general" :label="$t('general')" />
          <q-tab
            name="physical_characteristics"
            :label="$t('physical_characteristics')"
          />
          <q-tab name="multimedia" :label="$t('multimedia')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general" class="q-pl-none q-pr-none">
            <div class="row q-mb-md q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="selected.name"
                  :label="$t('name') + ' *'"
                />
              </div>
              <div class="col-12 col-sm-6">
                <taxonomy-select
                  v-model="selected.type"
                  entity-type="natural-resource"
                  path="type"
                  :label="$t('type') + ' *'"
                />
              </div>
            </div>
            <q-input
              filled
              v-model="selected.description"
              type="textarea"
              :label="$t('description')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.article_top"
              type="textarea"
              :label="$t('article_top')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.article_bottom"
              type="textarea"
              :label="$t('article_bottom')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.side_note"
              type="textarea"
              :label="$t('side_note')"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="selected.external_links"
              type="textarea"
              :label="$t('external_links')"
              class="q-mb-md"
            />
          </q-tab-panel>
          <q-tab-panel
            name="physical_characteristics"
            class="q-pl-none q-pr-none"
          >
            <physical-entity-form v-model="selected" />
          </q-tab-panel>
          <q-tab-panel name="multimedia" class="q-pl-none q-pr-none">
            <files-input v-model="selected.files" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-3">
        <q-btn
          flat
          :label="$t('cancel')"
          color="secondary"
          @click="onCancel"
          v-close-popup
        />
        <q-btn
          :label="$t('save')"
          color="primary"
          @click="onSave"
          :disable="!isValid"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export default defineComponent({
  name: 'NaturalResourceDialog',
});
</script>
<script setup lang="ts">
import { NaturalResource } from 'src/models';
import { notifyError } from 'src/utils/notify';
import PhysicalEntityForm from 'src/components/PhysicalEntityForm.vue';
import FilesInput from 'src/components/FilesInput.vue';
import TaxonomySelect from 'src/components/TaxonomySelect.vue';

interface DialogProps {
  modelValue: boolean;
  item: NaturalResource;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(['update:modelValue', 'saved']);

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

const isValid = computed(() => {
  return selected.value.name && selected.value.type;
});

watch(
  () => props.modelValue,
  (value) => {
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
  },
);

function onHide() {
  showDialog.value = false;
  emit('update:modelValue', false);
}

function onCancel() {
  filesStore.clearFilesToDelete();
}

async function onSave() {
  if (selected.value === undefined) return;
  if (selected.value.id) {
    service
      .update(selected.value.id, selected.value)
      .then(() => {
        filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  } else {
    service
      .create(selected.value)
      .then(() => {
        filesStore.deleteFiles();
        emit('saved', selected.value);
        onHide();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  }
}
</script>
