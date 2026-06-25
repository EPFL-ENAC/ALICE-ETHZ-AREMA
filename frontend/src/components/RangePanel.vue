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
            :style="`width: ${(Math.abs((range.max || 0) - (range.min || 0)) / (rangeLength || 1)) * (100 - 2 * endsPct)}%`"
          ></div>
        </template>
      </div>
      <div
        :title="`${t('low')}: ${props.low || '-'} / ${t('standard')}: ${props.std || '-'} / ${t('high')}: ${props.high || '-'}`"
      >
        <div style="margin-top: -8px; position: relative; height: 10px">
          <div
            v-if="barSpan !== null"
            :style="`left: ${barSpan.left}%; width: ${barSpan.width}%`"
            class="value-bar"
          ></div>
        </div>
        <div style="margin-top: -11px; position: relative; height: 14px">
          <div
            v-if="props.low !== null && lowPct !== null"
            :style="`left: ${lowPct}%`"
            class="bar"
            :title="`${t('low')}: ${props.low}`"
          ></div>
          <div
            v-if="props.std !== null && stdPct !== null"
            :style="`left: ${stdPct}%`"
            class="circle"
            :title="`${t('standard')}: ${props.std}`"
          ></div>
          <div
            v-if="props.high !== null && highPct !== null"
            :style="`left: ${highPct}%`"
            class="bar"
            :title="`${t('high')}: ${props.high}`"
          ></div>
        </div>
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
  if (!node.value?.ranges) return null;
  return node.value.ranges
    .filter((range) => range.min !== undefined && range.max !== undefined)
    .map((range) => Math.abs((range.max || 0) - (range.min || 0)))
    .reduce((acc, val) => acc + val, 0);
});
const rangeMin = computed(() => {
  if (!node.value?.ranges) return null;
  return Math.min(
    ...node.value.ranges
      .filter((range) => range.min !== undefined && range.min !== null)
      .map((range) => range.min as number),
  );
});
const lowValue = computed(() => {
  // handle null values by excluding them from the min calculation
  let min: number | null = null;
  if (props.low !== undefined && props.low !== null) {
    min = Number(props.low);
  } else if (props.std !== undefined && props.std !== null) {
    min = Number(props.std);
  } else if (props.high !== undefined && props.high !== null) {
    min = Number(props.high);
  }
  return min;
});

// position of the low, std and high values in the range bar,
// taking into account margins between range segments
const lowPct = computed(() => {
  if (
    props.low === null ||
    props.low === undefined ||
    lowValue.value === null ||
    rangeLength.value === null
  )
    return null;
  if (lowValue.value < rangeMin.value!) {
    return (endsPct * lowValue.value) / rangeMin.value!;
  }
  return endsPct + ((lowValue.value - rangeMin.value!) / rangeLength.value) * (100 - 2 * endsPct);
});
const stdPct = computed(() => {
  if (props.std === null || props.std === undefined || rangeLength.value === null) return null;
  let rval = null;
  if (Number(props.std) < rangeMin.value!) {
    rval = (endsPct * Number(props.std)) / rangeMin.value!;
  } else {
    rval =
      endsPct + ((Number(props.std) - rangeMin.value!) / rangeLength.value) * (100 - 2 * endsPct);
  }
  return Math.min(100, rval);
});
const highPct = computed(() => {
  if (props.high === null || props.high === undefined || rangeLength.value === null) return null;
  let rval = null;
  if (Number(props.high) < rangeMin.value!) {
    rval = (endsPct * Number(props.high)) / rangeMin.value!;
  } else {
    rval =
      endsPct + ((Number(props.high) - rangeMin.value!) / rangeLength.value) * (100 - 2 * endsPct);
  }
  return Math.min(100, rval);
});

const barSpan = computed(() => {
  const left = lowPct.value ?? stdPct.value ?? highPct.value;
  const right = highPct.value ?? stdPct.value ?? lowPct.value;
  if (left === null || right === null) return null;
  return { left, width: right - left };
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
.value-bar {
  position: absolute;
  height: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--q-primary);
  opacity: 0.6;
}
.bar {
  position: absolute;
  width: 4px;
  height: 12px;
  background: var(--q-primary);
  transform: translateX(-50%);
}
.circle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--q-primary);
  border-radius: 50%;
  transform: translateX(-50%);
}
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
