<template>
  <div>
    <div v-if="node?.ranges">
      <div class="row no-wrap">
        <template v-for="(range, index) in node.ranges" :key="index">
          <div
            v-if="range.min === undefined"
            class="text-white range range-low"
            :title="`${t(range.id)} (${getRangeLabel(range)})`"
            :style="`width: ${endsPct}%`"
          ></div>
          <div
            v-else-if="range.max === undefined"
            class="text-white range range-high"
            :title="`${t(range.id)} (${getRangeLabel(range)})`"
            :style="`width: ${endsPct}%`"
          ></div>
          <div
            v-else
            class="text-white range range-part"
            :title="`${t(range.id)} (${getRangeLabel(range)})`"
            :style="`width: ${(Math.abs((range.max || 0) - (range.min || 0)) / rangeLength) * (100 - 2 * endsPct)}%`"
          ></div>
        </template>
      </div>
      <div
        class="row no-wrap"
        style="margin-top: -8px"
        :title="`${t('low')}: ${low || '-'} / ${t('standard')}: ${std || '-'} / ${t('high')}: ${high || '-'}`"
      >
        <div :style="`width: ${valueParts.veryLowMarginPct}%`"></div>
        <div
          v-if="valueParts.veryLowPct > 0"
          class="values"
          :style="`width: ${valueParts.veryLowPct}%`"
        ></div>
        <div :style="`width: ${valueParts.midMarginPct}%`"></div>
        <div class="values" :style="`width: ${valueParts.midPct}%`"></div>
        <div class="values" :style="`width: ${valueParts.veryHighPct}%`"></div>
      </div>
    </div>
    <div v-else-if="node?.enum" class="row no-wrap">
      <template v-for="(val, index) in node.enum" :key="index">
        <div
          class="text-white enum enum-part text-center"
          :class="getEnumClass(val)"
          :title="val"
          :style="`width: ${(1 / node.enum.length) * 100}%`"
        >
          {{ val }}
        </div>
      </template>
    </div>
    <div v-else class="text-caption text-grey-7">
      <span>{{ t('low') }}: {{ low || '-' }}</span> /
      <span>{{ t('standard') }}: {{ std || '-' }}</span> /
      <span>{{ t('high') }}: {{ high || '-' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ValueRange } from 'src/models';

const { t } = useI18n();
const taxonomyStore = useTaxonomyStore();

interface Props {
  urn: string;
  property: string;
  low?: number | string | null;
  std?: number | string | null;
  high?: number | string | null;
}

const props = defineProps<Props>();

const endsPct = 10;
const node = computed(() => taxonomyStore.getNode(props.urn));
const rangeLength = computed(() => {
  if (!node.value?.ranges) return 0;
  return node.value.ranges
    .filter((range) => range.min !== undefined && range.max !== undefined)
    .map((range) => Math.abs((range.max || 0) - (range.min || 0)))
    .reduce((acc, val) => acc + val, 0);
});
const rangeMin = computed(() => {
  if (!node.value?.ranges) return 0;
  return Math.min(
    ...node.value.ranges
      .filter((range) => range.min !== undefined)
      .map((range) => range.min as number),
  );
});
const rangeMax = computed(() => {
  if (!node.value?.ranges) return 0;
  return Math.max(
    ...node.value.ranges
      .filter((range) => range.max !== undefined)
      .map((range) => range.max as number),
  );
});
const lowValue = computed(() => {
  return Math.min(props.low as number, props.std as number, props.high as number);
});
const highValue = computed(() => {
  return Math.max(props.low as number, props.std as number, props.high as number);
});
const valueParts = computed(() => {
  if (rangeLength.value === 0)
    return { veryLowMarginPct: endsPct, veryLowPct: 0, midMarginPct: 0, midPct: 0, veryHighPct: 0 };

  let lowVal = lowValue.value;
  let veryLowMarginPct = endsPct;
  let veryLowPct = 0;
  if (lowValue.value < rangeMin.value) {
    veryLowPct = (endsPct * (rangeMin.value - lowValue.value)) / rangeMin.value;
    veryLowMarginPct = endsPct - veryLowPct;
    lowVal = rangeMin.value;
  }

  const pctFacto = (100 - 2 * endsPct) / rangeLength.value;
  const midMarginPct = pctFacto * (lowVal - rangeMin.value);
  let midPct = pctFacto * (highValue.value - lowVal);
  let veryHighPct = 0;
  if (highValue.value > rangeMax.value) {
    midPct = pctFacto * (rangeMax.value - lowVal);
    veryHighPct = (endsPct * (highValue.value - rangeMax.value)) / rangeMax.value;
  }
  return { veryLowMarginPct, veryLowPct, midMarginPct, midPct, veryHighPct };
});

function getRangeLabel(range: ValueRange) {
  if (range.min === undefined && range.max === undefined) {
    return '';
  }
  if (range.min === undefined) {
    return `<${range.max}`;
  }
  if (range.max === undefined) {
    return `>${range.min}`;
  }
  return `${range.min} - ${range.max}`;
}

function getEnumClass(value: string | number) {
  if (!node.value?.enum) return '';
  if (props.low === value) return 'enum-low';
  if (props.std === value) return 'enum-std';
  if (props.high === value) return 'enum-high';
  const idx = node.value.enum.indexOf(value as string);
  const idxLow = node.value.enum.indexOf(props.low as string);
  const idxStd = node.value.enum.indexOf(props.std as string);
  const idxHigh = node.value.enum.indexOf(props.high as string);
  if (idx === -1) return '';
  if (idx > idxLow && (idx < idxStd || idx < idxHigh)) return 'enum-mid';
  return '';
}
</script>

<style scoped>
.range {
  height: 18px;
  background-color: var(--q-secondary);
}
.range-part {
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
}
.range-low {
  border-right: 2px solid #ccc;
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--q-secondary) 40%, transparent),
    color-mix(in srgb, var(--q-secondary) 100%, transparent)
  );
}
.range-high {
  border-left: 2px solid #ccc;
  background: linear-gradient(
    to left,
    color-mix(in srgb, var(--q-secondary) 40%, transparent),
    color-mix(in srgb, var(--q-secondary) 100%, transparent)
  );
}
.values {
  height: 8px;
  background-color: var(--q-primary);
}
.enum {
  height: 18px;
  background-color: var(--q-secondary);
}
.enum-part {
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
}
.enum-low {
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--q-primary) 30%, transparent),
    color-mix(in srgb, var(--q-primary) 60%, transparent)
  );
}
.enum-std {
  background-color: var(--q-primary);
  opacity: 0.8;
}
.enum-high {
  background: linear-gradient(
    to left,
    color-mix(in srgb, var(--q-primary) 30%, transparent),
    color-mix(in srgb, var(--q-primary) 60%, transparent)
  );
}
.enum-mid {
  background-color: var(--q-primary);
  opacity: 0.6;
}
</style>
