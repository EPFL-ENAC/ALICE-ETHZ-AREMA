import type { StyleSpecification } from 'maplibre-gl';

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
