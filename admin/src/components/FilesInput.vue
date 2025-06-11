<template>
  <div>
    <q-list bordered separator v-if="files.length" class="q-mb-md">
      <template v-for="(file, idx) in files" :key="file.ref?.path || file.url">
        <q-item>
          <q-item-section>
            <a :href="getURL(file)" target="_blank" class="epfl q-mb-md">
              {{ getLabel(file) }}
              <q-icon name="visibility" />
            </a>
            <q-input filled v-model="file.legend" :label="$t('legend')" />
          </q-item-section>
          <q-item-section avatar v-if="isImage(file)">
            <q-img :src="`${baseUrl}/files/${file.ref.path}`" width="200px" fit="scale-down" />
          </q-item-section>
          <q-item-section avatar>
            <div class="row">
              <q-btn icon="arrow_upward" rounded dense flat size="12px" @click="onUpFile(file, idx)" />
              <q-btn icon="arrow_downward" rounded dense flat size="12px" @click="onDownFile(file, idx)" />
              <q-btn icon="delete" rounded dense flat color="negative" size="12px" @click="onDeleteFile(file, idx)" />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <div class="q-gutter-sm">
      <q-radio v-model="type" val="files" :label="$t('files')" />
      <q-radio v-model="type" val="url" :label="$t('url')" />
    </div>
    <q-file
      v-if="type === 'files'"
      filled
      v-model="localFiles"
      multiple
      :label="$t('upload_files')"
      :hint="$t('upload_files_hint')"
      accept=".jpg, .jpeg, .png, .pdf, .mp4, .webp"
      :disable="uploading"
      :loading="uploading"
      @update:model-value="onLocalFilesSelected"
    />
    <q-input v-else filled v-model="selectedUrl" :label="$t('url')" :hint="$t('url_hint')" @keyup.enter="onURLAdd" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'FilesInput',
});
</script>
<script setup lang="ts">
import { FileItem, FileRef } from 'src/models';
import { FileObject } from 'src/components/models';
import { baseUrl } from 'src/boot/api';

interface Props {
  modelValue: FileItem[];
}

const props = defineProps<Props>();

const filesStore = useFilesStore();

const type = ref('files');
const files = ref(props.modelValue);
const localFiles = ref<FileObject[]>([]);
const uploading = ref(false);
const selectedUrl = ref('');

watch(
  () => props.modelValue,
  (val) => {
    files.value = val;
  },
);

function isImage(file: FileItem) {
  const name = file.url ? file.url : file.ref.name;
  return ['.png', '.jpg', '.jpeg', '.webp'].find((suffix) => name.toLowerCase().endsWith(suffix));
}

function onDeleteFile(file: FileItem, idx: number) {
  filesStore.addFileToDelete(file.ref);
  files.value.splice(idx, 1);
}

function onUpFile(file: FileItem, idx: number) {
  if (idx > 0) {
    const tmp = files.value[idx - 1];
    files.value[idx - 1] = file;
    files.value[idx] = tmp;
  }
}
function onDownFile(file: FileItem, idx: number) {
  if (idx < files.value.length - 1) {
    const tmp = files.value[idx + 1];
    files.value[idx + 1] = file;
    files.value[idx] = tmp;
  }
}

function onLocalFilesSelected() {
  if (!localFiles.value?.length) {
    return;
  }
  uploading.value = true;
  localFiles.value.forEach((file) => {
    filesStore
      .uploadTmpFile(file)
      .then((fileRef: FileRef) => {
        files.value.push({ ref: fileRef });
      })
      .finally(() => {
        uploading.value = false;
        localFiles.value = [];
      });
  });
}

function onURLAdd() {
  if (!selectedUrl.value) {
    return;
  }
  uploading.value = true;
  files.value.push({ url: selectedUrl.value });
  selectedUrl.value = '';
}

function getURL(file: FileItem) {
  if (file.url) return file.url;
  return file.ref?.alt_path ? `${baseUrl}/files/${file.ref?.alt_path}` : `${baseUrl}/files/${file.ref?.path}`;
}

function getLabel(file: FileItem) {
  if (file.url) return file.url;
  return file.ref.alt_name ? file.ref.alt_name : file.ref.name;
}
</script>
