<script setup lang='ts'>
import { ref } from 'vue'
import CircleMapInput from '~/components/CircleMapInput.vue'

const circle = ref({
  "id": "f3cb5b94f5ded23a10aed21038b72b29",
  "type": "Feature",
  "properties": {
    "circleRadius": 12,
    "place_id": 118162205,
    "osm_type": "way",
    "osm_id": 47359884,
    "display_name": "8, Avenue du Vieux-Moulin, Lausanne, District de Lausanne, Vaud, 1018, Switzerland",
    "place_rank": 30,
    "category": "building",
    "type": "apartments",
    "importance": 1.2600999999999998,
    "address": {
      "house_number": "8",
      "road": "Avenue du Vieux-Moulin",
      "city": "Lausanne",
      "county": "District de Lausanne",
      "state": "Vaud",
      "ISO3166-2-lvl4": "CH-VD",
      "postcode": "1018",
      "country": "Switzerland",
      "country_code": "ch"
    }
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          6.62887615,
          46.5325242
        ],
        [
          6.62887615,
          46.5325242
        ],
        [
          6.62887615,
          46.5325242
        ],
        [
          6.62887615,
          46.5325242
        ]
      ]
    ]
  }
})
</script>

<template>
  <v-sheet>
    <v-row class="text-h4">CircleMapInput</v-row>
    <v-row>
      <v-col cols='9'>
        <CircleMapInput v-model="circle" height="800px"/>
      </v-col>
      <v-col cols='3'>
        <div class="text-h4">Model</div>
        <pre class="text-left">
          {{ circle }}
        </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>
