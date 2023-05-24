<script setup lang='ts'>
import { round } from 'lodash'

const props = withDefaults(
  defineProps<{
    area?: number;
    totalArea?: number
  }>(),
  {
    area: 0,
    totalArea: 0,
  }
);
</script>

<template>
  <div>
    <div class='text-capitalize'>
      {{ $t('area') }} : {{ round(props.area, 2) }} [m²]
    </div>
    <div class='text-capitalize'>
      {{ $t('areaTotal') }} : {{ round(props.totalArea, 2) }} [m²]
    </div>
  </div>
</template>
