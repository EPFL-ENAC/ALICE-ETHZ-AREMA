<template>
  <div class="container">
    <q-btn
      :label="$t('resources')"
      icon="layers"
      color="white"
      text-color="grey-10"
      no-caps
      class="layers bg-white"
      size="12px"
    >
      <q-menu>
        <q-list>
          <q-item
            dense
            unelevated
            clickable
            v-for="key in Object.keys(showMap)"
            :key="key"
            @click="
              showMap[key] = !showMap[key];
              onShowMap(key);
            "
          >
            <q-item-section>
              <q-item-label>{{ t(`${key}_map`) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="showMap[key]"
                :color="mapColors[key]"
                keep-color
                @update:model-value="onShowMap(key)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <div id="map-results" :style="`--t-width: ${width}; --t-height: ${height}`" class="mapview" />
  </div>
</template>

<script setup lang="ts">
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibregl-theme-switcher/styles.css';
import { style } from '../utils/maps';
import { type FeatureCollection, Point } from 'geojson';
import {
  AttributionControl,
  //FullscreenControl,
  GeolocateControl,
  Map,
  MapMouseEvent,
  NavigationControl,
  ScaleControl,
  Popup,
  GeoJSONSource,
  Feature,
} from 'maplibre-gl';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

interface Props {
  features?: FeatureCollection;
  centre?: [number, number];
  zoom?: number;
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  centre: () => [8, 46.8],
  zoom: 6,
  aspectRatio: undefined,
  minZoom: undefined,
  maxZoom: undefined,
  width: '100%',
  height: '800px',
});

const emit = defineEmits(['map:loaded', 'map:click', 'map:box']);

let map = shallowRef<Map>();
const mapLoaded = ref(false);
const showMap = ref<{ [key: string]: boolean }>({
  stroh: false,
  hemp: false,
  corn: false,
  woods: false,
  sheep: false,
  reynoutria_japonica: false,
  demolition: false,
  rammed_earth: false,
  adobe_earth: false,
  hartgestein: false,
  kalkstein: false,
  konglomerat: false,
  sandstein: false,
  vulkanisch: false,
});
const mapColors: { [key: string]: string } = {
  stroh: 'orange-13',
  hemp: 'green-13',
  corn: 'yellow-13',
  woods: 'green-9',
  sheep: 'blue-6',
  reynoutria_japonica: 'purple-6',
  demolition: 'blue-8',
  rammed_earth: 'red-9',
  adobe_earth: 'purple-9',
  hartgestein: 'blue-8',
  kalkstein: 'blue-grey-7',
  konglomerat: 'light-green-9',
  sandstein: 'yellow-8',
  vulkanisch: 'pink-7',
};

// track which were the layers added, to be able to remove them
const layerIds: string[] = [];

const EntityTypeSymbols: { [key: string]: { image: string } } = {
  building: { image: 'building-regular-32.png' }, // 'building-solid.png'
  professional: { image: 'compass-drafting-solid-32.png' }, // 'helmet-safety-solid.svg'
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = undefined;
  }
});

function initMap() {
  if (map.value) {
    return;
  }
  map.value = new Map({
    container: 'map-results',
    center: [props.centre[0], props.centre[1]],
    style: style,
    trackResize: true,
    zoom: props.zoom,
    attributionControl: false,
  });
  // disable map rotation using right click + drag
  map.value.dragRotate.disable();
  // disable map rotation using keyboard
  map.value.keyboard.disable();
  // disable map rotation using touch rotation gesture
  map.value.touchZoomRotate.disableRotation();
  map.value.addControl(new NavigationControl({}));
  map.value.addControl(new GeolocateControl({}));
  map.value.addControl(new ScaleControl({}));
  //map.value.addControl(new FullscreenControl({}));
  map.value.addControl(
    new AttributionControl({
      compact: false,
      customAttribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://sc.ibi.ethz.ch/en/" target="_blank">IBI SC</a>, <a href="https://www.epfl.ch/labs/alice/" target="_blank">ENAC ALICE</a>',
    }),
  );

  map.value.on('load', () => {
    Object.keys(EntityTypeSymbols).forEach((entityType) => {
      map.value?.loadImage(`/symbols/${EntityTypeSymbols[entityType].image}`).then((image) => {
        if (image?.data) {
          map.value?.addImage(entityType, image.data);
        }
      });
    });
    displayFeatures();
    emit('map:loaded', map.value);
    mapLoaded.value = true;
  });
}

watch(
  () => props.features,
  () => {
    if (mapLoaded.value) displayFeatures();
  },
  { immediate: true, deep: true },
);

function displayFeatures() {
  if (!map.value) {
    return;
  }

  if (map.value.getSource('entities')) {
    // update source
    (map.value.getSource('entities') as GeoJSONSource)?.setData(
      props.features || {
        type: 'FeatureCollection',
        features: [],
      },
    );
  } else {
    // set source and add layers
    map.value.addSource('entities', {
      type: 'geojson',
      data: props.features || {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.value.addLayer({
      id: 'entities-clusters',
      type: 'circle',
      source: 'entities',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': '#ffffff',
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ddd',
      },
    });
    layerIds.push('entities-clusters');

    map.value.addLayer({
      id: 'entities-cluster-count',
      type: 'symbol',
      source: 'entities',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Regular'],
        'text-size': 20,
      },
      paint: {
        'text-color': '#000',
      },
    });
    layerIds.push('entities-cluster-count');

    map.value.addLayer({
      id: 'entities-unclustered-point',
      type: 'symbol',
      source: 'entities',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'entity_type'],
        'icon-size': 0.8,
      },
    });
    layerIds.push('entities-unclustered-point');

    // inspect a cluster on click
    map.value.on('click', 'entities-clusters', async (e) => {
      if (!map.value) {
        return;
      }
      const features = map.value.queryRenderedFeatures(e.point, {
        layers: ['entities-clusters'],
      });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await (map.value.getSource('entities') as GeoJSONSource).getClusterExpansionZoom(clusterId);
      map.value.easeTo({
        center: (features[0].geometry as Point).coordinates as [number, number],
        zoom,
      });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.value.on('click', 'entities-unclustered-point', (e: MapMouseEvent) => {
      if (!map.value) {
        return;
      }
      const feature = e.features ? e.features[0] : null;
      if (!feature) {
        return;
      }
      emit('map:click', feature, map.value);
      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      const coordinates = (feature.geometry as Point).coordinates.slice() as [number, number];
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const divContainer = document.createElement('div');
      divContainer.onclick = () => onDocument(feature);
      divContainer.classList.add('cursor-pointer');
      divContainer.style.minWidth = '200px';
      const entyTypeContainer = document.createElement('div');
      entyTypeContainer.classList.add('text-primary');
      entyTypeContainer.textContent = t(feature.properties?.entity_type);
      divContainer.appendChild(entyTypeContainer);
      const nameContainer = document.createElement('div');
      nameContainer.classList.add('text-bold');
      nameContainer.textContent = feature.properties?.name;
      divContainer.appendChild(nameContainer);
      const descriptionContainer = document.createElement('div');
      descriptionContainer.classList.add('ellipsis');
      descriptionContainer.textContent = feature.properties?.description ? feature.properties?.description : '';
      divContainer.appendChild(descriptionContainer);

      new Popup().setLngLat(coordinates).setDOMContent(divContainer).addTo(map.value);
    });

    map.value.on('mouseenter', 'entities-clusters', () => {
      if (map.value) map.value.getCanvas().style.cursor = 'pointer';
    });
    map.value.on('mouseleave', 'entities-clusters', () => {
      if (map.value) map.value.getCanvas().style.cursor = '';
    });

    map.value.on('moveend', () => {
      if (map.value) {
        const bounds = map.value.getBounds();
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();
        emit('map:box', [nw.toArray(), se.toArray()], map.value);
      }
    });
  }
}

function onDocument(feature: Feature) {
  router.push({ name: 'doc', params: { id: `${feature.properties.entity_type}:${feature.properties.id}` } });
}

function onShowMap(name: string) {
  map.value
    ?.getLayersOrder()
    .filter((layerId) => layerId.startsWith(name))
    .forEach((layerId) => {
      map.value?.setLayoutProperty(layerId, 'visibility', showMap.value[name] ? 'visible' : 'none');
    });
}
</script>

<style scoped>
.container {
  position: relative; /* Needed for absolute children */
}
.layers {
  position: absolute;
  z-index: 10;
  top: 10px;
  left: 10px;
}
.mapview {
  position: relative;
  z-index: 1;
  width: var(--t-width);
  height: var(--t-height);
}
</style>
