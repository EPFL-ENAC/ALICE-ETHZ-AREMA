import { type StyleSpecification, setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// maplibre-gl >= 6 loads its web worker from a URL next to its own module, which does not
// survive Vite's dependency pre-bundling. Point it at the worker explicitly, as documented
// in https://maplibre.org/maplibre-gl-js/docs/ (Vite section). Without this, every
// worker-backed source (GeoJSON, vector tiles) silently never loads.
setWorkerUrl(maplibreWorkerUrl);

export const style: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 20,
    },
    swissimage: {
      type: 'raster',
      tiles: [
        'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/3857/{z}/{x}/{y}.jpeg',
      ],
    },
  },
  layers: [
    // {
    //   id: 'classic',
    //   type: 'raster',
    //   source: 'osm',
    // },
    {
      id: 'light',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -0.9,
        'raster-brightness-min': 0.2,
      },
    },
    // {
    //   id: 'swissimage',
    //   type: 'raster',
    //   source: 'swissimage',
    //   layout: { visibility: 'none' },
    // },
  ],
};
