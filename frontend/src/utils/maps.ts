import { StyleSpecification } from 'maplibre-gl';
import { ThemeDefinition } from 'maplibregl-theme-switcher';
import { t } from 'src/boot/i18n';
import { cdnUrl } from 'src/boot/api';

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
    hartgestein: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Hartgestein.geojson`,
    },
    kalkstein: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Kalkstein.geojson`,
    },
    konglomerat: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Konglomerat.geojson`,
    },
    sandstein: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Sandstein.geojson`,
    },
    vulkanisch: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Vulkanisch.geojson`,
    },
    stroh: {
      type: 'geojson',
      data: `${cdnUrl}/arema/maps/2025-02-24T14:56/geojson/Stroh.geojson`,
    },
  },
  glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'light',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -0.9,
        'raster-brightness-min': 0.2,
      },
    },
    {
      id: 'hartgestein',
      type: 'fill',
      source: 'hartgestein',
      paint: {
        'fill-color': 'rgb(25, 118, 210)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'kalkstein',
      type: 'fill',
      source: 'kalkstein',
      paint: {
        'fill-color': 'rgb(84, 110, 122)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'konglomerat',
      type: 'fill',
      source: 'konglomerat',
      paint: {
        'fill-color': 'rgb(85, 139, 47)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'sandstein',
      type: 'fill',
      source: 'sandstein',
      paint: {
        'fill-color': 'rgb(251, 192, 45)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'vulkanisch',
      type: 'fill',
      source: 'vulkanisch',
      paint: {
        'fill-color': 'rgb(216, 27, 96)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'stroh',
      type: 'circle',
      source: 'stroh',
      paint: {
        'circle-color': 'rgb(255, 145, 0)',
        'circle-opacity': 0.5,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 1, 16, 2],
      },
      layout: {
        visibility: 'none',
      },
    },
  ],
};

export const themes: ThemeDefinition[] = [
  {
    id: 'light',
    label: t('light'),
  },
];
