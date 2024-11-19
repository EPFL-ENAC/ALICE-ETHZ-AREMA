<template>
  <div>
    <q-list bordered separator v-if="files.length" class="q-mb-md">
      <template v-for="(file, idx) in files" :key="file.ref.path">
        <q-item>
          <q-item-section>
            <a
              :href="`${baseUrl}/files/${file.ref.alt_path ? file.ref.alt_path : file.ref.path}`"
              target="_blank"
              class="epfl q-mb-md"
            >
              {{ file.ref.alt_name ? file.ref.alt_name : file.ref.name }}
              <q-icon name="visibility" />
            </a>
            <q-input filled v-model="file.legend" :label="$t('legend')" />
          </q-item-section>
          <q-item-section avatar v-if="isImage(file.ref)">
            <q-img
              :src="`${baseUrl}/files/${file.ref.path}`"
              width="200px"
              fit="scale-down"
            />
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              icon="delete"
              rounded
              dense
              flat
              color="negative"
              size="12px"
              @click="onDeleteFile(file, idx)"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-file
      filled
      v-model="localFile"
      :label="$t('upload_file')"
      :hint="$t('upload_file_hint')"
      accept=".jpg, .jpeg, .png, .pdf, .mp4"
      :disable="uploading"
      :loading="uploading"
      @update:model-value="onLocalFileSelected"
    />
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

const files = ref(props.modelValue);
const localFile = ref<FileObject>();
const uploading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    files.value = val;
  },
);

function isImage(file: FileRef) {
  return ['.png', '.jpg', '.jpeg', '.webp'].find((suffix) =>
    file.name.toLowerCase().endsWith(suffix),
  );
}

function onDeleteFile(file: FileItem, idx: number) {
  filesStore.addFileToDelete(file.ref);
  files.value.splice(idx, 1);
}

function onLocalFileSelected() {
  if (!localFile.value) {
    return;
  }
  uploading.value = true;
  filesStore
    .uploadTmpFile(localFile.value)
    .then((fileRef: FileRef) => {
      files.value.push({ ref: fileRef });
      localFile.value = undefined;
    })
    .finally(() => {
      uploading.value = false;
    });
}
</script>
