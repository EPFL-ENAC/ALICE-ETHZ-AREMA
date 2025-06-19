<template>
  <div>
    <q-card bordered flat>
      <q-tabs v-model="tab" dense align="left" class="bg-grey-1 text-grey-6" active-color="grey-8">
        <q-tab name="write" :label="$t('write')" no-caps />
        <q-tab name="preview" :label="$t('preview')" no-caps />
        <q-tab v-if="helpContent" name="help" :label="$t('help')" no-caps />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="write" class="q-pa-none">
          <q-input filled v-model="text" type="textarea" :label="label" @update:model-value="onUpdate" />
        </q-tab-panel>
        <q-tab-panel name="preview">
          <q-markdown :src="text" no-heading-anchor-links />
        </q-tab-panel>
        <q-tab-panel v-if="helpContent" name="help">
          <q-markdown :src="helpContent" no-heading-anchor-links />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <div v-if="hint" class="q-pt-xs text-help">{{ hint }}</div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'TextInput',
});
</script>
<script setup lang="ts">
interface Props {
  modelValue: string | undefined;
  label?: string;
  hint?: string;
  help?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const text = ref(props.modelValue);
const tab = ref('write');
const helpContent = ref('');

onMounted(() => {
  if (props.help) {
    fetch(`/admin/help/en/${props.help}.md`).then((response) => {
      response.text().then((text) => {
        helpContent.value = text;
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
