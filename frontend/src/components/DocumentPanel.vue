<template>
  <div>
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t(document.entity_type) }}
          </div>
          <div class="text-h2 q-mb-md">{{ document.name }}</div>
          <div class="q-mb-lg">
            <tags-badges :document="document" />
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
          <div v-if="document?.external_links">
            <div class="text-primary text-caption">
              {{ $t('external_links') }}
            </div>
            <q-separator color="primary" class="q-mb-sm" />
            <q-markdown :src="document.external_links" />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div>
            <div class="text-body1">
              <q-markdown :src="document.article_top" />
            </div>
            <div v-if="document && getImageUrls().length">
              <template v-for="url in getImageUrls()" :key="url">
                <q-img :src="url" style="max-height: 100px; max-width: 100px" />
              </template>
            </div>
            <div class="text-body1">
              <q-markdown :src="document.article_bottom" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <q-markdown
            v-if="document.side_note"
            :src="document.side_note"
            class="text-primary text-caption"
          />
        </div>
        <div class="col-12 col-md-1"></div>
      </div>

      <div v-if="relationSummaries.length" class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t('references') }}
          </div>
          <div class="row q-gutter-md">
            <template
              v-for="relation in relationSummaries"
              :key="`${relation.entity_type}:${relation.id}`"
            >
              <q-card
                flat
                class="q-mb-md cursor-pointer"
                @click="onDocument(relation)"
                style="min-width: 200px"
              >
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

<script lang="ts">
export default defineComponent({
  name: 'DocumentPanel',
});
</script>
<script setup lang="ts">
import TagsBadges from 'src/components/TagsBadges.vue';
import PhysicalParametersPanel from 'src/components/PhysicalParametersPanel.vue';
import { cdnUrl } from 'src/boot/api';
import { Document } from 'src/models';

const searchService = useSearchService();
const router = useRouter();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const relationSummaries = ref<Document[]>([]);

onMounted(async () => {
  console.log('mounted');
  updateRelationSummaries();
});

watch(
  () => props.document,
  () => {
    console.log('watch');
    updateRelationSummaries();
  },
);

function getImageUrls() {
  if (!props.document) return [];
  const images = props.document.files
    ? props.document.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  return images;
}

function updateRelationSummaries() {
  if (!props.document?.relates_to) return;
  relationSummaries.value = [];
  Promise.all(
    props.document.relates_to.map((rel) => {
      return searchService.getDocument(rel, [
        'id',
        'entity_type',
        'name',
        'description',
      ]);
    }),
  ).then((docs) => {
    console.log(docs);
    relationSummaries.value = docs;
  });
}

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: `${row.entity_type}:${row.id}` } });
}
</script>
