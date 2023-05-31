<script setup lang='ts'>
import { ref } from 'vue'
import PolygonsMapInput from '~/components/PolygonsMapInput.vue'

const polygons = ref(
  {
    type: 'FeatureCollection',
    features: [
      {
        id: '4e9da6ffac5d70c8e932aae47014d91b',
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [
              [
                7.394056444832813,
                47.0414208885519
              ],
              [
                7.316371373657603,
                46.837212486329605
              ],
              [
                7.805787322061946,
                46.911560202687724
              ],
              [
                7.394056444832813,
                47.0414208885519
              ]
            ]
          ],
          type: 'Polygon'
        }
      },
      {
        id: '815837c1debbf07019a085ac2795f870',
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [
              [
                7.452320248214448,
                47.09697893594833
              ],
              [
                7.731986504445217,
                47.25276072831056
              ],
              [
                7.949504703735812,
                47.11812867397475
              ],
              [
                7.848514111208573,
                46.97255449207648
              ],
              [
                7.452320248214448,
                47.09697893594833
              ]
            ]
          ],
          type: 'Polygon'
        }
      }
    ]
  })
</script>

<template>
  <v-sheet>
    <v-row class='text-h4'>PolygonsMapInput</v-row>
    <v-row>
      <v-col cols='9'>
        <PolygonsMapInput v-model='polygons' />
      </v-col>
      <v-col cols='3'>
        <div class='text-h4'>Model</div>
        <pre>
          {{ polygons }}
        </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>
