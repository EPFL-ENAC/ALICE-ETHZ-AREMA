import { StyleSpecification } from 'maplibre-gl';
import { ThemeDefinition } from 'maplibregl-theme-switcher';
import { t } from 'src/boot/i18n';
import { baseUrl, cdnUrl } from 'src/boot/api';

const mapsUrl = `${cdnUrl}/arema/maps/2025-03-31T13:35`;

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
      data: `${mapsUrl}/geojson/Hartgestein.geojson`,
    },
    kalkstein: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Kalkstein.geojson`,
    },
    konglomerat: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Konglomerat.geojson`,
    },
    sandstein: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Sandstein.geojson`,
    },
    vulkanisch: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Vulkanisch.geojson`,
    },
    stroh: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Stroh_2024.geojson`,
    },
    hemp: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Hanf_2024.geojson`,
    },
    corn: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Mais_2024.geojson`,
    },
    woods: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=1,255&nodata=255&colormap_name=algae&bidx=1&url=${mapsUrl}/raster/Wald_nodata_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    rammed_earth: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=1,2&colormap_name=reds_r&bidx=1&url=${mapsUrl}/raster/Lehm_2056_30-60_Clay_CEC_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    reynoutria_japonica: {
      type: 'geojson',
      data: `${mapsUrl}/geojson/Reynoutria%20Japonica_2025_2024.geojson`,
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
      minzoom: 7,
      paint: {
        'circle-color': 'rgb(255, 145, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          1,
          16,
          ['interpolate', ['linear'], ['get', 'flaeche_m2'], 1, 1, 100, 2, 1000, 5, 10000, 10, 20000, 20, 30000, 30],
        ],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'stroh-heat',
      type: 'heatmap',
      source: 'stroh',
      maxzoom: 20,
      paint: {
        // Increase the heatmap weight based on frequency and property flaeche_m2
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'flaeche_m2'],
          0,
          0,
          100,
          0.0001,
          10000,
          0.001,
          20000,
          0.002,
          30000,
          0.003,
        ],
        // Increase the heatmap color weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0, 9, 3, 16, 10],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparency color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(255, 255, 255, 0)',
          0.2,
          'rgb(253, 232, 220)',
          0.4,
          'rgb(253, 210, 183)',
          0.6,
          'rgb(252, 174, 129)',
          0.8,
          'rgb(252, 124, 73)',
          1,
          'rgb(179, 80, 0)',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 16, 0],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'hemp',
      type: 'circle',
      source: 'hemp',
      minzoom: 7,
      paint: {
        'circle-color': 'rgb(30, 255, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          5,
          16,
          ['interpolate', ['linear'], ['get', 'flaeche_m2'], 1, 1, 100, 2, 1000, 5, 10000, 10, 20000, 20, 30000, 30],
        ],
        'circle-stroke-color': 'rgb(25, 204, 2)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'hemp-heat',
      type: 'heatmap',
      source: 'hemp',
      maxzoom: 20,
      paint: {
        // Increase the heatmap weight based on frequency and property flaeche_m2
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'flaeche_m2'],
          0,
          0,
          100,
          0.1,
          10000,
          1,
          20000,
          2,
          30000,
          3,
        ],
        // Increase the heatmap color weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0, 9, 3, 16, 10],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparency color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(255, 255, 255, 0)',
          0.2,
          'rgb(247, 255, 199)',
          0.4,
          'rgb(150, 255, 183)',
          0.6,
          'rgb(174, 255, 129)',
          0.8,
          'rgb(70, 255, 110)',
          1,
          'rgb(0, 255, 13)',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 16, 0],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'corn',
      type: 'circle',
      source: 'corn',
      minzoom: 7,
      paint: {
        'circle-color': 'rgb(255, 251, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          1,
          16,
          ['interpolate', ['linear'], ['get', 'flaeche_m2'], 1, 1, 100, 2, 1000, 5, 10000, 10, 20000, 20, 30000, 30],
        ],
        'circle-stroke-color': 'rgb(231, 227, 2)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'corn-heat',
      type: 'heatmap',
      source: 'corn',
      maxzoom: 20,
      paint: {
        // Increase the heatmap weight based on frequency and property flaeche_m2
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'flaeche_m2'],
          0,
          0,
          100,
          0.0001,
          10000,
          0.001,
          20000,
          0.002,
          30000,
          0.003,
        ],
        // Increase the heatmap color weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0, 9, 3, 16, 10],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparency color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(255, 255, 255, 0)',
          0.2,
          'rgb(247, 255, 199)',
          0.4,
          'rgb(150, 255, 183)',
          0.6,
          'rgb(174, 255, 129)',
          0.8,
          'rgb(222, 255, 70)',
          1,
          'rgb(255, 255, 0)',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 16, 0],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'reynoutria_japonica',
      type: 'circle',
      source: 'reynoutria_japonica',
      minzoom: 1,
      paint: {
        'circle-color': 'rgb(255, 0, 234)',
        'circle-opacity': 0.5,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 1, 10, 2, 16, 5],
        'circle-stroke-color': 'rgb(214, 2, 197)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'woods',
      type: 'raster',
      source: 'woods',
      paint: {
        'raster-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'rammed_earth',
      type: 'raster',
      source: 'rammed_earth',
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
