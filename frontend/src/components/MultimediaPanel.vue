<template>
  <div v-if="document.files?.length">
    <div v-touch-swipe.mouse.right.left="onSwipe">
      <q-tab-panels v-model="slide" animated style="background-color: transparent">
        <q-tab-panel
          v-for="(file, index) in document.files"
          :key="index"
          :name="index"
          class="q-pa-none"
        >
          <div v-if="isImage(file)">
            <q-img
              :src="toFileUrl(file)"
              :height="$q.screen.lt.sm ? '250px' : $q.screen.lt.lg ? '350px' : '500px'"
              fit="contain"
            />
          </div>
          <div v-else-if="isVideo(file)">
            <q-video
              :src="toFileUrl(file)"
              :style="`height: ${$q.screen.lt.sm ? '250px' : $q.screen.lt.lg ? '350px' : '500px'}`"
            />
          </div>
          <div v-else-if="isPDF(file)">
            <object type="application/pdf" :data="toFileUrl(file)" width="100%" height="500px">
              <div class="q-pa-md text-center">
                <div class="text-uppercase">{{ t('download') }}</div>
                <q-btn flat color="secondary" @click="onDownload(file)">
                  <q-icon name="picture_as_pdf" size="100px" />
                </q-btn>
                <div v-if="file.ref" class="text-secondary">{{ file.ref?.name }}</div>
              </div>
            </object>
          </div>
          <div v-else class="column no-wrap flex-center">
            <div class="q-pa-md text-center">
              <div class="text-uppercase">{{ t('download') }}</div>
              <q-btn flat color="secondary" @click="onDownload(file)">
                <q-icon name="file_download" size="100px" />
              </q-btn>
              <div v-if="file.ref" class="text-secondary">{{ file.ref?.name }}</div>
            </div>
          </div>
          <div v-if="file.legend" class="text-center a-legend">
            <div class="text-caption">{{ file.legend }}</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-tabs
      v-if="document.files.length > 1"
      v-model="slide"
      class="text-primary q-mt-sm"
      active-color="secondary"
      indicator-color="secondary"
      switch-indicator
      dense
    >
      <q-tab v-for="(file, index) in document.files" :key="index" :name="index">
        <q-img v-if="isImage(file)" :src="toFileUrl(file)" height="50px" fit="scale-down" />
        <q-icon v-else-if="isVideo(file)" name="video_library" size="30px" />
        <q-icon v-else-if="isPDF(file)" name="picture_as_pdf" size="30px" />
        <q-icon v-else name="file_download" size="30px" />
      </q-tab>
    </q-tabs>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { Document, FileItem } from 'src/models';
import { toFileUrl, isImage, isVideo, isPDF } from 'src/utils/files';

const { t } = useI18n();
const $q = useQuasar();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const slide = ref(0);

function onDownload(file: FileItem) {
  window.open(toFileUrl(file), '_blank');
}

function onSwipe(event: { direction: string }) {
  if (!props.document.files || props.document.files.length <= 1) return;
  if (event.direction === 'left') {
    slide.value = Math.min(slide.value + 1, props.document.files.length - 1);
  } else if (event.direction === 'right') {
    slide.value = Math.max(slide.value - 1, 0);
  }
}
</script>
