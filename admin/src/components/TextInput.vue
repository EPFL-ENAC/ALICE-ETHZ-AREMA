<template>
  <div>
    <q-card flat>
      <q-tabs v-model="tab" dense align="left" class="bg-grey-1 text-grey-6" active-color="grey-8">
        <q-tab name="write" :label="label" no-caps />
        <q-tab name="preview" :label="t('preview')" no-caps />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="write" class="q-pa-none">
          <div class="row">
            <div class="col-9">
              <q-input
                filled
                autogrow
                v-model="text"
                type="textarea"
                @update:model-value="onUpdate"
                :disable="props.disable"
                style="min-height: 200px"
              />
            </div>
            <div class="col-3 q-pa-sm">
              <div class="text-bold q-pl-md">{{ t('instructions') }}</div>
              <div v-if="helpContent" style="font-size: smaller; overflow: auto">
                <q-markdown :src="helpContent" no-heading-anchor-links />
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="preview">
          <q-markdown :src="text" no-heading-anchor-links />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <div v-if="hint" class="q-pt-xs text-help">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | undefined;
  label?: string;
  hint?: string;
  help?: string;
  disable?: boolean | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const text = ref(props.modelValue);
const tab = ref('write');
const helpContent = ref('');

onMounted(() => {
  if (props.help) {
    void fetch(`/admin/help/en/${props.help}.md`).then((response) => {
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
</script>
