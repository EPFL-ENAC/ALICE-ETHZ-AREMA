<script setup lang='ts'>
import MapLibreMap from '~/components/MapLibreMap.vue'
import { ref } from 'vue'

const mapLibreMap = ref<InstanceType<typeof MapLibreMap>>()

const selectedFeatures = ref([])
</script>

<template>
  <v-row>
    <v-col cols='3'>
      <v-row>
        <v-col>
          <v-card>
            <v-card-item>
              <v-card-title class='text-capitalize'>
                {{ $t('tool', 2) }}
              </v-card-title>
            </v-card-item>
            <v-card-text v-if='selectedFeatures.length'>
              <v-table density='compact'>
                <thead>
                  <tr>
                    <th>Geometry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(feature, index) in selectedFeatures" :key="feature.id">
                    <td class="text-left"><pre>{{ feature.geometry }}</pre></td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click='mapLibreMap?.drawPolygon()'
              >
                {{ $t('draw.polygon') }}
              </v-btn>
              <v-btn
                v-if='selectedFeatures.length'
                @click='mapLibreMap?.drawTrash()'
              >
                {{ $t('draw.trash') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols='9'>
      <MapLibreMap
        ref='mapLibreMap'
        :center='[8, 46.8]'
        style-spec='https://api.maptiler.com/maps/basic/style.json?key=kramlD0izE1YxWEKKCus'
        :zoom='7.5'
        @update:selected-features='selectedFeatures = $event'
      />
    </v-col>
  </v-row>
</template>
