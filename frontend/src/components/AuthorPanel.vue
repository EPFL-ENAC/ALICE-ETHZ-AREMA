<template>
  <div>
    <div v-if="searchService.searching">
      <q-spinner-dots />
    </div>
    <div v-else>
      <div class="container">
        <div class="nav">
          <router-link
            to="/search"
            class="text-primary text-caption q-pa-xs"
            style="border: solid 1px"
          >
            <q-icon name="arrow_back" /> {{ t('search') }}
          </router-link>
        </div>
        <div class="header">
          <div class="text-primary text-uppercase q-mb-sm">
            {{ t(document.entity_type) }}
          </div>
          <div class="text-h2 q-mb-md">{{ document.name }}</div>
          <div v-if="document.affiliation" class="q-my-lg">
            <q-chip outline color="primary" size="12px" class="q-ml-none q-mr-sm no-border-radius">
              {{ document.affiliation }}
            </q-chip>
          </div>
        </div>
        <div class="content">
          <div class="q-mb-lg" style="font-size: 1.5rem">
            <q-markdown :src="document.description" no-heading-anchor-links />
          </div>
        </div>
        <div class="side-right">
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
        <div class="footer">
          <relations-panel
            class="q-my-lg"
            :title="t('contributions')"
            :relation-summaries="relationSummaries"
            :related-resources="[]"
            :entity-type="document.entity_type"
            @document-click="onDocument"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models';
import RelationsPanel from 'src/components/RelationsPanel.vue';

const { t } = useI18n();
const searchService = useSearchService();
const router = useRouter();

interface Props {
  document: Document;
}

const props = defineProps<Props>();

const slide = ref(0);
const relationSummaries = ref<Document[]>([]);
const authors = ref<Document[]>([]);

onMounted(init);

watch(() => props.document, init);

function init() {
  slide.value = 0;
  if (!props.document) return;
  relationSummaries.value = [];
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

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 6fr 3fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nav {
  grid-column: 2 / 3;
}

.side-right {
  grid-column: 4 / 5;
}

.content,
.footer {
  grid-column: 3 / 4;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .nav,
  .content,
  .side-right,
  .footer {
    grid-column: 1 / -1;
  }
}
</style>
