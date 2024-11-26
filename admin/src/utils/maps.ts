import { StyleSpecification } from 'maplibre-gl';
import { ThemeDefinition } from 'maplibregl-theme-switcher';
import { t } from '../boot/i18n';

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
      // layout: { visibility: 'none' },
    },
    {
      id: 'dark',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -1,
        'raster-brightness-max': 0.5,
      },
      layout: { visibility: 'none' },
    },
    // {
    //   id: 'swissimage',
    //   type: 'raster',
    //   source: 'swissimage',
    //   layout: { visibility: 'none' },
    // },
  ],
};

export const themes: ThemeDefinition[] = [
  // {
  //   id: 'classic',
  //   label: t('classic'),
  // },
  {
    id: 'light',
    label: t('light'),
  },
  {
    id: 'dark',
    label: t('dark'),
  },
  // {
  //   id: 'swissimage',
  //   label: t('aerial'),
  // },
];
