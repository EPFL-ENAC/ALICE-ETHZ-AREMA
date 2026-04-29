<template>
  <pre class="diff-block" v-html="diffText"></pre>
</template>

<script setup lang="ts">
import { markdownDiff } from 'src/utils/strings';
interface Props {
  oldText: string | null | undefined;
  newText: string | null | undefined;
}

const props = defineProps<Props>();
const diffText = computed(() => {
  return markdownDiff(props.oldText, props.newText);
});
</script>

<style lang="scss" scoped>
.diff-block {
  white-space: pre-wrap;
  margin: 0;
}
</style>
