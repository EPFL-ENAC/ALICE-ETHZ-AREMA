<template>
  <div>
    <q-card flat>
      <q-tabs v-model="tab" dense align="left" class="bg-grey-1 text-grey-6" active-color="grey-8">
        <q-tab name="write" :label="label" no-caps />
        <q-tab name="preview" :label="t('preview')" no-caps />
        <q-tab
          v-if="!disable"
          name="diff"
          :label="t('diff')"
          :alert="diffsCount > 0 ? 'info' : false"
          no-caps
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="write" class="q-pa-none">
          <div class="row">
            <div :class="helpContent ? 'col-9' : 'col-12'">
              <q-input
                filled
                :autogrow="rows === undefined"
                :rows="props.rows"
                v-model="text"
                type="textarea"
                @update:model-value="onUpdate"
                :disable="props.disable || decorating"
              />
              <div v-if="taxonomyType">
                <q-btn
                  flat
                  no-caps
                  size="sm"
                  color="secondary"
                  icon="menu_book"
                  :label="t('decorate')"
                  :title="t('decorate_hint')"
                  @click="onDecorate"
                  :loading="decorating"
                />
              </div>
            </div>
            <div v-if="helpContent" class="col-3 q-pa-sm">
              <div class="text-bold q-pl-md">{{ t('guidelines') }}</div>
              <div style="font-size: smaller; overflow: auto">
                <q-markdown :src="helpContent" no-heading-anchor-links />
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="preview" class="q-pa-none">
          <q-card flat bordered class="q-pa-md" style="border-top: none" @click="onTermClick">
            <q-markdown :plugins="[termMarkdown]" :src="text" no-heading-anchor-links />
          </q-card>
        </q-tab-panel>
        <q-tab-panel v-if="!disable" name="diff" class="q-pa-none">
          <q-card flat bordered class="q-pa-md" style="border-top: none">
            <diff-text :oldText="original" :newText="text" />
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <div v-if="hint && tab === 'write'" class="q-pt-xs on-right text-hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
import DiffText from 'src/components/DiffText.vue';
import { countDiffs } from 'src/utils/strings';
import { termMarkdown } from 'src/utils/md';
import { notifyInfo } from 'src/utils/notify';

const taxonomyStore = useTaxonomyStore();

interface Props {
  modelValue: string | undefined;
  original?: string | null | undefined;
  label?: string;
  hint?: string;
  help?: string;
  disable?: boolean | undefined;
  rows?: number | undefined;
  taxonomyType?: string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 10,
});
const emit = defineEmits<{
  'update:modelValue': [value: string | undefined];
  'term-click': [payload: { label: string; title: string; urn: string }];
}>();

const { t, locale } = useI18n();

const text = ref(props.modelValue);
const tab = ref('write');
const helpContent = ref('');
const decorating = ref(false);

function onTermClick(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('.md-term');
  if (!target) return;
  const urn = target.dataset.urn ?? '';
  const title = target.dataset.title ?? '';
  const label = target.textContent ?? '';
  if (urn) {
    const node = taxonomyStore.getNode(urn);
    let msg = urn;
    if (node) {
      const description = node.descriptions?.[locale.value];
      if (description) {
        msg = description;
      }
    }
    notifyInfo(msg);
  }
  emit('term-click', { label, title, urn });
}

const diffsCount = computed(() => {
  return countDiffs(props.original || '', text.value);
});

onMounted(() => {
  if (props.help) {
    void fetch(`/admin/help/${locale.value}/${props.help}.md`).then((response) => {
      void response.text().then((text) => {
        helpContent.value = text;
        tab.value = 'write';
      });
    });
  }
});

watch(
  () => props.modelValue,
  (val) => {
    text.value = val;
  },
);

function onUpdate() {
  emit('update:modelValue', text.value);
}

async function onDecorate() {
  if (!props.taxonomyType) {
    console.warn('No taxonomy type provided for decoration');
    return;
  }
  try {
    decorating.value = true;
    const decorated = await taxonomyStore.decorateText(
      props.taxonomyType,
      text.value,
      locale.value.toLowerCase(),
    );
    text.value = decorated;
    emit('update:modelValue', decorated);
  } catch (error) {
    console.error('Error decorating text:', error);
    // Optionally, you could emit an event or show a notification to the user here.
  } finally {
    decorating.value = false;
  }
}
</script>
