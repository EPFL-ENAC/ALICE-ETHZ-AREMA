import { StyleSpecification } from 'maplibre-gl';
import { ThemeDefinition } from 'maplibregl-theme-switcher';
import { t } from 'src/boot/i18n';
import { baseUrl, cdnUrl } from 'src/boot/api';

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
    straw: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WorldMercatorWGS84Quad/{z}/{x}/{y}.webp?rescale=-210,2910&colormap_name=oranges&url=${cdnUrl}/arema/maps/2025-02-12T17:08/raster/HeatmapR1000mPixHB10000_4326_cog.tif`,
      ],
      tileSize: 256,
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
      id: 'straw',
      type: 'raster',
      source: 'straw',
      paint: {
        'raster-opacity': 0.5,
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
