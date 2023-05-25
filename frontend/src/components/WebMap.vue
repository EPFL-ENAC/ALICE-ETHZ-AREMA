<script setup lang='ts'>
import MapLibreMap from '~/components/MapLibreMap.vue'
import { ref } from 'vue'

const mapLibreMap = ref<InstanceType<typeof MapLibreMap>>()

const selectedFeatures = ref([])

</script>

<template>
  <v-row>
    <v-col cols='12'>
      <v-btn
        @click='mapLibreMap?.drawPolygon()'
      >
        {{ $t('draw.polygon') }}
      </v-btn>
      <v-btn
        @click='mapLibreMap?.drawCircle()'
      >
        {{ $t('draw.circle') }}
      </v-btn>
      <v-btn
        v-if='selectedFeatures.length'
        @click='mapLibreMap?.drawTrash()'
      >
        {{ $t('draw.trash') }}
      </v-btn>
      <MapLibreMap
        ref='mapLibreMap'
        :center='[8, 46.8]'
        style-spec='https://api.maptiler.com/maps/basic/style.json?key=kramlD0izE1YxWEKKCus'
        :zoom='7.5'
        @update:selected-features='selectedFeatures = $event'
      />
      <v-table density='compact' v-if='selectedFeatures.length'>
        <thead>
          <tr>
            <th>Features</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(feature, index) in selectedFeatures" :key="feature.id">
            <td class="text-left"><pre>{{ feature }}</pre></td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>
