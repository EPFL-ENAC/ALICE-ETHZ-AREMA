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
                :disable="props.disable"
                :style="{ minHeight: props.minHeight || '200px' }"
              />
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
          <q-card ref="previewCard" v-tippy flat bordered class="q-pa-md" style="border-top: none">
            <q-markdown :plugins="[tooltipMarkdown]" :src="text" no-heading-anchor-links />
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
import { tooltipMarkdown } from 'src/utils/tooltip';
import type { QCard } from 'quasar';

interface Props {
  modelValue: string | undefined;
  original?: string | null | undefined;
  label?: string;
  hint?: string;
  help?: string;
  disable?: boolean | undefined;
  minHeight?: string | undefined;
  rows?: number | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string | undefined];
  'tooltip-click': [payload: { label: string; tip: string }];
}>();

const { t, locale } = useI18n();

const text = ref(props.modelValue);
const tab = ref('write');
const helpContent = ref('');
const previewCard = ref<InstanceType<typeof QCard> | null>(null);

function onTooltipClick(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('.md-tooltip');
  if (!target) return;
  const tip = target.dataset.tip ?? '';
  const label = target.textContent ?? '';
  emit('tooltip-click', { label, tip });
}

const diffsCount = computed(() => {
  return countDiffs(props.original || '', text.value);
});

watch(previewCard, (newCard, oldCard) => {
  (oldCard?.$el as HTMLElement | undefined)?.removeEventListener('click', onTooltipClick);
  (newCard?.$el as HTMLElement | undefined)?.addEventListener('click', onTooltipClick);
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

onBeforeUnmount(() => {
  (previewCard.value?.$el as HTMLElement | undefined)?.removeEventListener('click', onTooltipClick);
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
</script>
