<template>
  <div class="container">
    <q-btn
      :label="$t('resource_potentials')"
      icon="layers"
      color="white"
      text-color="grey-10"
      no-caps
      class="layers bg-white"
      size="12px"
    >
      <q-menu>
        <q-list>
          <template v-for="node in mapMenu" :key="node.id">
            <q-item
              dense
              unelevated
              clickable
              v-if="!node.children"
              @click="
                showMap[node.id] = !showMap[node.id];
                onShowMap(node.id);
              "
            >
              <q-item-section>
                <q-item-label>{{ t(`maps.${node.id}`) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="showMap[node.id]"
                  :color="mapColors[node.id]"
                  keep-color
                  @update:model-value="onShowMap(node.id)"
                />
              </q-item-section>
            </q-item>
            <q-item v-else clickable>
              <q-item-section>{{ $t(`maps.${node.id}`) }}</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item
                    dense
                    unelevated
                    clickable
                    v-for="child in node.children"
                    :key="child.id"
                    @click="
                      showMap[child.id] = !showMap[child.id];
                      onShowMap(child.id);
                    "
                  >
                    <q-item-section>
                      <q-item-label>{{ t(`maps.${child.id}`) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="showMap[child.id]"
                        :color="mapColors[child.id]"
                        keep-color
                        @update:model-value="onShowMap(child.id)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
    <div id="map-results" :style="`--t-width: ${width}; --t-height: ${height}`" class="mapview" />
    <div v-if="hasLegend" class="colors q-mr-sm bg-white rounded-borders shadow-1 q-pa-xs">
      <template v-for="map in Object.keys(showMap)" :key="map">
        <q-icon v-if="showMap[map]" name="circle" :color="mapColors[map]" size="1.2rem" class="q-mr-xs" />
        <span v-if="showMap[map]" class="text-secondary text-caption on-left">
          {{ $t(`maps.${map}`) }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
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
  //ScaleControl,
  Popup,
  GeoJSONSource,
  Feature,
  Marker,
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
  bbox?: [[number, number], [number, number]];
  mark?: [number, number];
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

interface MapNode {
  id: string;
  children?: MapNode[];
}

const color = '#dd4b39'; // accent color
const el = document.createElement('div');
el.innerHTML = `
  <svg width="30" height="41" viewBox="0 0 27 41" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(3, 29)" fill="#000">
        <ellipse cx="10.5" cy="5.25" rx="10.5" ry="5.25" opacity="0.2" />
      </g>
      <g fill="${color}"> <!-- Marker body color -->
        <path d="M13.5,0 C6.044,0 0,6.044 0,13.5 C0,23.625 13.5,40.5 13.5,40.5 C13.5,40.5 27,23.625 27,13.5 C27,6.044 20.956,0 13.5,0 Z" />
      </g>
      <circle cx="13.5" cy="13.5" r="5.5" fill="white" />
    </g>
  </svg>
`;
const marker = new Marker({ element: el }).setLngLat([0, 0]);

let map = shallowRef<Map>();
const mapLoaded = ref(false);
const mapMenu = ref<MapNode[]>([
  {
    id: 'earth',
    children: [{ id: 'ramming_earth' }, { id: 'adobe_earth' }],
  },
  {
    id: 'rock',
    children: [
      { id: 'hartgestein' },
      { id: 'kalkstein' },
      { id: 'konglomerat' },
      { id: 'sandstein' },
      { id: 'vulkanisch' },
    ],
  },
  { id: 'stroh' },
  { id: 'hemp' },
  { id: 'woods' },
  {
    id: 'other_fibers',
    children: [{ id: 'corn' }, { id: 'sheep' }, { id: 'reynoutria_japonica' }],
  },
  { id: 'demolition' },
]);
const showMap = ref<{ [key: string]: boolean }>({
  ramming_earth: false,
  adobe_earth: false,
  hartgestein: false,
  kalkstein: false,
  konglomerat: false,
  sandstein: false,
  vulkanisch: false,
  stroh: false,
  hemp: false,
  woods: false,
  corn: false,
  sheep: false,
  reynoutria_japonica: false,
  demolition: false,
});
const mapColors: { [key: string]: string } = {
  ramming_earth: 'red-9',
  adobe_earth: 'purple-9',
  hartgestein: 'blue-8',
  kalkstein: 'blue-grey-7',
  konglomerat: 'light-green-9',
  sandstein: 'yellow-8',
  vulkanisch: 'pink-7',
  stroh: 'orange-13',
  hemp: 'green-13',
  woods: 'green-9',
  corn: 'yellow-13',
  sheep: 'blue-6',
  reynoutria_japonica: 'purple-6',
  demolition: 'blue-8',
};

const hasLegend = computed(() => {
  return Object.keys(showMap.value).some((m) => showMap.value[m]);
});

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
  //map.value.addControl(new ScaleControl({}));
  //map.value.addControl(new FullscreenControl({}));
  map.value.addControl(
    new AttributionControl({
      compact: true,
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
    if (props.bbox && props.bbox.length === 2 && map.value) {
      // if bbox is set (from a previous search), apply it
      map.value.fitBounds(props.bbox, {
        padding: 0,
        duration: 0,
        linear: true,
      });
    }
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

watch(
  () => props.mark,
  () => {
    marker.remove();
    if (mapLoaded.value && props.mark) {
      marker.setLngLat(props.mark).addTo(map.value!);
    }
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
    //map.value.on('mouseover', 'entities-unclustered-point', showPopup);
    map.value.on('click', 'entities-unclustered-point', showPopup);

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

function showPopup(e: MapMouseEvent) {
  if (!map.value) {
    return;
  }
  const features = map.value.queryRenderedFeatures(e.point, {
    layers: ['entities-unclustered-point'],
  });
  const clickedFeature = features ? features[0] : null;
  if (!clickedFeature) {
    return;
  }
  // filter props.features to points with nearest coordinates
  const clickedCoordinates = (clickedFeature.geometry as Point).coordinates;
  const sameLocationFeatures =
    props.features?.features.filter((f) => {
      if (f.geometry.type !== 'Point') {
        return false;
      }
      const coordinates = (f.geometry as Point).coordinates;
      const distance = Math.hypot(coordinates[0] - clickedCoordinates[0], coordinates[1] - clickedCoordinates[1]); // Rough Euclidean
      if (distance < 0.0001) {
        return true;
      }
      return false;
    }) || [];
  if (sameLocationFeatures.length === 0) {
    // if no features found nearby the clicked location, just show the clicked feature
    sameLocationFeatures.push(clickedFeature);
  }

  const makeFeatureContainer = (feature: Feature) => {
    const divContainer = document.createElement('div');
    divContainer.onclick = () => onDocument(feature);
    divContainer.classList.add('cursor-pointer');
    divContainer.style.minWidth = '200px';
    const entyTypeContainer = document.createElement('div');
    entyTypeContainer.classList.add('text-primary', 'text-uppercase');
    entyTypeContainer.textContent = t(feature.properties?.entity_type);
    divContainer.appendChild(entyTypeContainer);
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('text-h6');
    nameContainer.textContent = feature.properties?.name;
    divContainer.appendChild(nameContainer);
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('fade-text', 'marked');
    descriptionContainer.innerHTML = marked.parse(
      feature.properties?.description ? feature.properties?.description : '',
    );
    divContainer.appendChild(descriptionContainer);
    return divContainer;
  };

  const featuresContainer = document.createElement('div');

  sameLocationFeatures.forEach((feature, i) => {
    const divContainer = makeFeatureContainer(feature);
    featuresContainer.appendChild(divContainer);
    if (i < sameLocationFeatures.length - 1) {
      const separator = document.createElement('hr');
      featuresContainer.appendChild(separator);
    }
  });

  new Popup()
    .setLngLat(clickedCoordinates as [number, number])
    .setDOMContent(featuresContainer)
    .addTo(map.value);
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
.colors {
  position: absolute;
  z-index: 10;
  bottom: 10px;
  left: 10px;
}
.mapview {
  position: relative;
  z-index: 1;
  width: var(--t-width);
  height: var(--t-height);
}
</style>
