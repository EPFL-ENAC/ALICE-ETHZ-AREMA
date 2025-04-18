<template>
  <div>
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <router-link to="/search" class="text-primary text-caption" style="text-decoration: none">
            <q-icon name="arrow_back" /> {{ $t('search') }}
          </router-link>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t(document.entity_type) }}
          </div>
          <div class="text-h2 q-mb-md">{{ document.name }}</div>
          <div class="q-mb-lg">
            <tags-badges :item="document" />
          </div>
          <div class="text-h5 q-mb-lg">
            <q-markdown :src="document.description" />
          </div>
          <div class="q-mb-lg">
            <physical-parameters-panel :document="document" />
          </div>
        </div>
        <div class="col-12 col-md-3"></div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <external-links-panel v-if="$q.screen.gt.sm" :document="document" />
        </div>
        <div class="col-12 col-md-6">
          <div>
            <div class="text-body1">
              <q-markdown :src="document.article_top" />
            </div>

            <div v-if="document.files?.length" class="q-mt-xl q-mb-xl">
              <q-carousel
                v-model="slide"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                control-color="secondary"
                padding
                :thumbnails="document.files?.length > 1"
                :arrows="document.files?.length > 1"
                infinite
                height="500px"
                class="bg-grey-2 text-grey-6"
              >
                <template v-for="(file, index) in document.files" :key="index">
                  <q-carousel-slide v-if="isImage(file)" :name="index" :img-src="toFileUrl(file)">
                    <div v-if="file.legend" class="absolute-bottom text-center a-legend">
                      <div class="text-caption">{{ file.legend }}</div>
                    </div>
                  </q-carousel-slide>

                  <q-carousel-slide v-else-if="isVideo(file)" :name="index">
                    <q-video :src="toFileUrl(file)" class="absolute-full" />
                    <div v-if="file.legend" class="absolute-bottom text-center a-legend">
                      <div class="text-caption">{{ file.legend }}</div>
                    </div>
                  </q-carousel-slide>

                  <q-carousel-slide v-else-if="isPDF(file)" :name="index" style="padding: 0">
                    <object type="application/pdf" :data="toFileUrl(file)" width="100%" height="100%" />
                    <div v-if="file.legend" class="absolute-bottom text-center a-legend">
                      <div class="text-caption">{{ file.legend }}</div>
                    </div>
                  </q-carousel-slide>

                  <q-carousel-slide v-else :name="index" class="column no-wrap flex-center">
                    <div class="text-uppercase">{{ $t('download') }}</div>
                    <q-btn flat color="secondary" @click="onDownload(file)">
                      <q-icon :name="isPDF(file) ? 'picture_as_pdf' : 'file_download'" size="100px" />
                    </q-btn>
                    <div v-if="file.legend" class="absolute-bottom text-center a-legend">
                      <div class="text-caption">{{ file.legend }}</div>
                    </div>
                  </q-carousel-slide>
                </template>
              </q-carousel>
            </div>
            <div class="text-body1">
              <q-markdown :src="document.article_bottom" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <q-markdown v-if="document.side_note" :src="document.side_note" class="text-primary text-caption" />
          <external-links-panel v-if="$q.screen.lt.md" :document="document" />
        </div>
        <div class="col-12 col-md-1"></div>
      </div>

      <div v-if="document.address" class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t('address') }}
          </div>
          <div class="row q-gutter-md">
            <template v-for="addr in [document.address, ...(document.addresses || [])]" :key="addr">
              <q-card flat class="q-mb-md" style="min-width: 200px">
                <q-card-section>
                  <template v-for="(tk, idx) in addr.split(',')" :key="idx">
                    <div :class="idx === 0 ? 'text-primary' : ''">{{ tk }}</div>
                  </template>
                </q-card-section>
              </q-card>
            </template>
          </div>
        </div>
        <div class="col-12 col-md-3"></div>
      </div>

      <div v-if="relationSummaries.length" class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t('relates_to') }}
          </div>
          <div class="row q-gutter-md">
            <template v-for="relation in relationSummaries" :key="`${relation.entity_type}:${relation.id}`">
              <q-card flat class="q-mb-md cursor-pointer" @click="onDocument(relation)" style="min-width: 200px">
                <q-card-section>
                  <div class="text-primary">{{ $t(relation.entity_type) }}</div>
                  <div class="text-bold">{{ relation.name }}</div>
                </q-card-section>
              </q-card>
            </template>
          </div>
        </div>
        <div class="col-12 col-md-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import TagsBadges from 'src/components/TagsBadges.vue';
import PhysicalParametersPanel from 'src/components/PhysicalParametersPanel.vue';
import ExternalLinksPanel from 'src/components/ExternalLinksPanel.vue';
import { Document, FileItem } from 'src/models';
import { toFileUrl, isImage, isVideo, isPDF } from 'src/utils/files';

const searchService = useSearchService();
const router = useRouter();
const $q = useQuasar();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const slide = ref(0);
const relationSummaries = ref<Document[]>([]);

onMounted(init);

watch(() => props.document, init);

function init() {
  slide.value = 0;
  if (!props.document) return;
  relationSummaries.value = [];
  const fields = ['id', 'entity_type', 'name', 'description'];
  searchService
    .getRelatedDocuments(toId(props.document.entity_type, props.document.id), fields)
    .then((result) => {
      relationSummaries.value = result.data || [];
    })
    .then(() => {
      // make sure relations in all directions are covered
      if (!props.document?.relates_to) return;
      const realtedIds = relationSummaries.value.map((doc) => toId(doc.entity_type, doc.id));
      Promise.all(
        props.document?.relates_to
          .filter((id) => !realtedIds.includes(id))
          .map((rel) => {
            return searchService.getDocument(rel, fields);
          }),
      ).then((docs) => {
        relationSummaries.value = relationSummaries.value.concat(docs).filter((doc) => doc !== undefined);
      });
    })
    .then(() => {
      // sort by entity type
      relationSummaries.value.sort((a, b) => a.entity_type.localeCompare(b.entity_type));
    });
}

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: toId(row.entity_type, row.id) } });
}

function toId(entity_type: string, id: number | string) {
  return `${entity_type}:${id}`;
}

function onDownload(file: FileItem) {
  window.open(toFileUrl(file), '_blank');
}
</script>
