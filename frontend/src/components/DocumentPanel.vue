<template>
  <div>
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <router-link to="/search" class="text-primary text-caption q-pa-xs" style="border: solid 1px">
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
            <q-markdown :src="document.description" no-heading-anchor-links />
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
          <div v-if="document.article_top" class="text-body1">
            <q-markdown :src="document.article_top" no-heading-anchor-links />
          </div>
          <multimedia-panel :document="document" class="q-mt-lg q-mb-lg" />
          <div v-if="document.article_bottom" class="text-body1">
            <q-markdown :src="document.article_bottom" no-heading-anchor-links />
          </div>
        </div>
        <div class="col-12 col-md-2">
          <div class="q-mb-md">
            <div v-if="document.client" class="text-secondary text-caption">
              {{ $t('client', { client: document.client }) }}
            </div>
            <div v-if="document.gross_internal_area" class="text-secondary text-caption">
              {{ $t('gross_internal_area', { area: document.gross_internal_area }) }}
            </div>
            <div v-if="document.year" class="text-secondary text-caption">
              {{ $t('year', { year: document.year }) }}
            </div>
            <div v-if="document.web" class="text-secondary text-caption">
              <q-markdown :src="toUrlMd(document.web)" no-heading-anchor-links class="q-mb-none" />
            </div>
            <div v-if="document.tel" class="text-secondary text-caption">
              {{ $t('tel', { tel: document.tel }) }}
            </div>
            <div v-if="document.email" class="text-secondary text-caption">
              <q-markdown :src="`[${document.email}](mailto:${document.email})`" no-heading-anchor-links />
            </div>
          </div>
          <q-markdown
            v-if="document.side_note"
            :src="document.side_note"
            class="text-primary text-caption"
            no-heading-anchor-links
          />
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

      <div v-if="relationSummaries.length || relatedResources.length" class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ $t('relates_to') }}
          </div>
          <div class="row q-gutter-md">
            <template v-for="entity_type in Object.keys(relationSummariesPerEntityType)" :key="entity_type">
              <q-card flat class="q-mb-md" style="min-width: 200px">
                <q-card-section>
                  <div class="text-primary">{{ $t(entity_type) }}</div>
                  <ul class="q-mt-xs q-mb-none q-pl-md">
                    <li
                      v-for="doc in relationSummariesPerEntityType[entity_type]"
                      :key="doc.id"
                      class="text-bold cursor-pointer"
                      @click="onDocument(doc)"
                    >
                      {{ doc.name }}
                    </li>
                  </ul>
                </q-card-section>
              </q-card>
            </template>
            <q-card v-if="relatedResources.length" flat class="q-mb-md" style="min-width: 200px">
              <q-card-section>
                <div class="text-primary">{{ $t(document.entity_type) }}</div>
                <ul class="q-mt-xs q-mb-none q-pl-md">
                  <li
                    v-for="doc in relatedResources"
                    :key="doc.id"
                    class="text-bold cursor-pointer"
                    @click="onDocument(doc)"
                  >
                    {{ doc.name }}
                  </li>
                </ul>
              </q-card-section>
            </q-card>
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
import MultimediaPanel from 'src/components/MultimediaPanel.vue';
import ExternalLinksPanel from 'src/components/ExternalLinksPanel.vue';
import { Document } from 'src/models';

const searchService = useSearchService();
const router = useRouter();
const $q = useQuasar();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const slide = ref(0);
const relationSummaries = ref<Document[]>([]);
const relatedResources = ref<Document[]>([]);

const relationSummariesPerEntityType = computed(() => {
  const relations: { [key: string]: Document[] } = {};
  relationSummaries.value.forEach((doc) => {
    if (!relations[doc.entity_type]) {
      relations[doc.entity_type] = [];
    }
    relations[doc.entity_type].push(doc);
  });
  return relations;
});

onMounted(init);

watch(() => props.document, init);

function init() {
  slide.value = 0;
  if (!props.document) return;
  relationSummaries.value = [];
  relatedResources.value = [];
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
      return Promise.all(
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
  if (props.document.entity_type === 'natural-resource') {
    searchService.getDocumentsFromTags(props.document.tags, fields).then((result) => {
      console.log('Related documents from tags:', result);
      relatedResources.value = result.data?.filter((doc) => doc.id !== props.document.id) || [];
    });
  }
}

function onDocument(row: Document) {
  router.push({ name: 'doc', params: { id: toId(row.entity_type, row.id) } });
}

function toId(entity_type: string, id: number | string) {
  return `${entity_type}:${id}`;
}

function toUrlMd(url: string) {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return `[${url.replace(/^https?:\/\//, '')}](${url})`;
}
</script>
