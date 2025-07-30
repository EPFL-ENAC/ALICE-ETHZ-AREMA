<template>
  <div v-if="option.series" :style="`height: ${height}px; width: ${width}px;`">
    <div class="text-center q-mt-sm text-bold">
      {{ t(fieldTitle) }}
    </div>
    <e-charts
      ref="chart"
      autoresize
      :init-options="initOptions"
      :option="option"
      :update-options="updateOptions"
      :loading="loading"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'FieldFrequenciesChart',
});
</script>
<script setup lang="ts">
import ECharts from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';
import { initOptions, updateOptions } from './commons';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import type { GroupByResult } from 'src/models';

const statsStore = useStatsStore();
use([SVGRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

interface FieldFrequenciesChartProps {
  type: string;
  height?: number;
  width?: number;
}
const props = withDefaults(defineProps<FieldFrequenciesChartProps>(), {
  height: 300,
  width: 400,
});

const { t } = useI18n();

// ["","","","","#cbe839","#ff9b21","#d6390f","#900c00"]
const allColors: Record<string, string> = {
  draft: '#4076f5',
  'in-review': '#26d0cd',
  'to-publish': '#5ffc73',
  'to-unpublish': '#cbe839',
  'to-delete': '#ff9b21',
  locked: '#d6390f',
  null: '#23171b',
  None: '#23171b',
};

const chart = shallowRef(null);
const option = ref<EChartsOption>({});
const loading = ref(false);

const frequencies = computed(() => {
  return statsStore.frequencies === null
    ? ({} as GroupByResult)
    : statsStore.frequencies[props.type];
});

const fieldTitle = computed(() => {
  return props.type.replace(/-/g, '_') + 's';
});

watch(
  () => props.type,
  () => {
    initChartOptions();
  },
);

watch(
  () => statsStore.frequencies,
  () => {
    if (statsStore.frequencies && statsStore.frequencies[props.type]) {
      initChartOptions();
    } else {
      option.value = {};
    }
  },
  { immediate: true },
);

onMounted(() => {
  initChartOptions();
});

function keyLabel(key: string) {
  if (key === 'null' || key === 'None') {
    return 'N/A';
  }
  if (statsStore.groupBy === 'state') {
    return t(`states.${key}`);
  }
  return key;
}

function initChartOptions() {
  option.value = {};
  if (!props.type || !frequencies.value || Object.keys(frequencies.value).length === 0) {
    return;
  }
  loading.value = true;

  const dataset = frequencies.value.counts.map((item) => ({
    key: item.value || 'null',
    name: keyLabel(item.value || 'null'),
    value: item.count,
  }));

  const colors = dataset.map((item) => allColors[item.key] || '#cccccc');

  const newOption: EChartsOption = {
    animation: false,
    height: props.height,
    tooltip: {
      trigger: 'item',
      formatter: '<b>{b}</b><br/>{c} ({d}%)',
    },
    legend: {
      show: false,
      bottom: '0',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['20%', '50%'],
        avoidLabelOverlap: true,
        color: colors,
        label: {
          margin: 0,
          fontWeight: 'bold',
        },
        data: dataset,
      },
    ],
  };
  option.value = newOption;
  loading.value = false;
}
</script>
