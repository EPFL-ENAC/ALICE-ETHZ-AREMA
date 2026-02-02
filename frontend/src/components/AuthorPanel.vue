<template>
  <div>
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <router-link
            to="/search"
            class="text-primary text-caption q-pa-xs"
            style="border: solid 1px"
          >
            <q-icon name="arrow_back" /> {{ t('search') }}
          </router-link>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ t(document.entity_type) }}
          </div>
          <div class="text-h2 q-mb-md">{{ document.name }}</div>
          <div class="q-mb-lg" style="font-size: 1.5rem">
            <q-markdown :src="document.description" no-heading-anchor-links />
          </div>
        </div>
        <div class="col-12 col-md-3"></div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <div class="q-mb-md">
            <div v-if="document.web" class="text-secondary text-caption">
              <q-markdown :src="toUrlMd(document.web)" no-heading-anchor-links class="q-mb-none" />
            </div>
            <div v-if="document.email" class="text-secondary text-caption">
              <q-markdown
                :src="`[${document.email}](mailto:${document.email})`"
                no-heading-anchor-links
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-1"></div>
      </div>

      <div
        v-if="relationSummaries.length || relatedResources.length"
        class="row q-col-gutter-md q-mt-md"
      >
        <div class="col-12 col-md-3"></div>
        <div class="col-12 col-md-6">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ t('contributions') }}
          </div>
          <div class="row q-gutter-md">
            <template
              v-for="entity_type in Object.keys(relationSummariesPerEntityType)"
              :key="entity_type"
            >
              <q-card flat class="q-mb-md" style="min-width: 200px">
                <q-card-section>
                  <div class="text-primary">{{ t(entity_type) }}</div>
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
                <div class="text-primary">{{ t(document.entity_type) }}</div>
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
import type { Document } from 'src/models';

const { t } = useI18n();
const searchService = useSearchService();
const router = useRouter();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const slide = ref(0);
const relationSummaries = ref<Document[]>([]);
const relatedResources = ref<Document[]>([]);
const authors = ref<Document[]>([]);

const relationSummariesPerEntityType = computed(() => {
  const relations: { [key: string]: Document[] } = {};
  relationSummaries.value.forEach((doc) => {
    const entityType = doc.entity_type;
    if (!relations[entityType]) {
      relations[entityType] = [];
    }
    relations[entityType].push(doc);
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
  authors.value = [];
  const fields = ['id', 'entity_type', 'name', 'description'];
  void searchService
    .getContributedDocuments(`${props.document.type}:${props.document.identifier}`, fields)
    .then((result) => {
      relationSummaries.value = result.data || [];
    });
}

function onDocument(row: Document) {
  void router.push({ name: 'doc', params: { id: toId(row.entity_type, row.id) } });
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
