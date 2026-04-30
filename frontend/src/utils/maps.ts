import { type StyleSpecification, addProtocol } from 'maplibre-gl';
import type { ThemeDefinition } from 'maplibregl-theme-switcher';
import { Protocol } from 'pmtiles';
import { t } from 'src/boot/i18n';
import { baseUrl, cdnUrl } from 'src/boot/api';

const protocol = new Protocol();
addProtocol('pmtiles', protocol.tile);

const mapsUrl = `${cdnUrl}/arema/maps/2026-04-27T12:46`;

export const style: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 20,
    },
    hartgestein: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Hartgestein.pmtiles`,
    },
    hartgestein_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/HartgesteinFR.pmtiles`,
    },
    kalkstein: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Kalkstein.pmtiles`,
    },
    kalkstein_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/KalksteinFR.pmtiles`,
    },
    konglomerat: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Konglomerat.pmtiles`,
    },
    sandstein: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Sandstein.pmtiles`,
    },
    sandstein_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/SandsteinFR.pmtiles`,
    },
    vulkanisch: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Vulkanisch.pmtiles`,
    },
    vulkanisch_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/VulkanischFR.pmtiles`,
    },
    stroh: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Stroh_2025.pmtiles`,
    },
    stroh_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/PailleFR_2024.pmtiles`,
    },
    hemp: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Hanf_2025.pmtiles`,
    },
    hemp_fr: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/ChanvreFR_2024.pmtiles`,
    },
    corn: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Mais_2025.pmtiles`,
    },
    sheep: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Schafe_4326_2026-04-13.pmtiles`,
    },
    woods: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=1,255&nodata=255&colormap_name=algae&bidx=1&url=${mapsUrl}/raster/Wald_nodata_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    woods_fr: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=1,255&nodata=255&colormap_name=algae&bidx=1&url=${mapsUrl}/raster/Foret_FR_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    ramming_earth: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=0,254&colormap_name=reds_r&bidx=1&url=${mapsUrl}/raster/Stampflehm_2056_30-60_Clay_CEC_v10_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    adobe_earth: {
      type: 'raster',
      tiles: [
        `${baseUrl}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.webp?rescale=0,254&colormap_name=rdpu_r&bidx=1&url=${mapsUrl}/raster/Torchis_2056_30-60_Clay_CEC_v2_4326_cog.tif`,
      ],
      tileSize: 256,
    },
    reynoutria_japonica: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Reynoutria_Japonica_2026_2025.pmtiles`,
    },
    demolition: {
      type: 'vector',
      url: `pmtiles://${mapsUrl}/geojson/Abriss_4326_2025.pmtiles`,
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
      'source-layer': 'Hartgestein',
      paint: {
        'fill-color': 'rgb(25, 118, 210)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'hartgestein-fr',
      type: 'fill',
      source: 'hartgestein_fr',
      'source-layer': 'HartgesteinFR',
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
      'source-layer': 'Kalkstein',
      paint: {
        'fill-color': 'rgb(84, 110, 122)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'kalkstein-fr',
      type: 'fill',
      source: 'kalkstein_fr',
      'source-layer': 'KalksteinFR',
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
      'source-layer': 'Konglomerat',
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
      'source-layer': 'Sandstein',
      paint: {
        'fill-color': 'rgb(251, 192, 45)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'sandstein-fr',
      type: 'fill',
      source: 'sandstein_fr',
      'source-layer': 'SandsteinFR',
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
      'source-layer': 'Vulkanisch',
      paint: {
        'fill-color': 'rgb(216, 27, 96)',
        'fill-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'vulkanisch-fr',
      type: 'fill',
      source: 'vulkanisch_fr',
      'source-layer': 'VulkanischFR',
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
      'source-layer': 'Stroh_2025',
      paint: {
        'circle-color': 'rgb(255, 145, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1,
          1,
          10,
          2,
          16,
          [
            'interpolate',
            ['linear'],
            ['get', 'flaeche_ha'],
            0.005,
            1,
            0.01,
            2,
            0.1,
            5,
            1,
            10,
            2,
            20,
            3,
            30,
          ],
        ],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'stroh-fr',
      type: 'circle',
      source: 'stroh_fr',
      'source-layer': 'PailleFR_2024',
      paint: {
        'circle-color': 'rgb(255, 145, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1,
          1,
          10,
          2,
          16,
          [
            'interpolate',
            ['linear'],
            ['get', 'flaeche_ha'],
            0.005,
            1,
            0.01,
            2,
            0.1,
            5,
            1,
            10,
            2,
            20,
            3,
            30,
          ],
        ],
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'hemp',
      type: 'circle',
      source: 'hemp',
      'source-layer': 'Hanf_2025',
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
          [
            'interpolate',
            ['linear'],
            ['get', 'flaeche_ha'],
            0.005,
            1,
            0.01,
            2,
            0.1,
            5,
            1,
            10,
            2,
            20,
            3,
            30,
          ],
        ],
        'circle-stroke-color': 'rgb(25, 204, 2)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'hemp-fr',
      type: 'circle',
      source: 'hemp_fr',
      'source-layer': 'ChanvreFR_2024',
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
          [
            'interpolate',
            ['linear'],
            ['get', 'flaeche_ha'],
            0.005,
            1,
            0.01,
            2,
            0.1,
            5,
            1,
            10,
            2,
            20,
            3,
            30,
          ],
        ],
        'circle-stroke-color': 'rgb(25, 204, 2)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'corn',
      type: 'circle',
      source: 'corn',
      'source-layer': 'Mais_2025',
      paint: {
        'circle-color': 'rgb(255, 251, 0)',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          2,
          16,
          [
            'interpolate',
            ['linear'],
            ['coalesce', ['get', 'flaeche_ha'], ['get', 'sf_adm_de'], 0],
            0.005,
            1,
            0.01,
            2,
            0.1,
            5,
            1,
            10,
            2,
            20,
            3,
            30,
          ],
        ],
        'circle-stroke-color': 'rgb(231, 197, 2)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'sheep',
      type: 'circle',
      source: 'sheep',
      'source-layer': 'Schafe_4326_20260413',
      paint: {
        'circle-color': '#08519c',
        'circle-opacity': 0.5,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          2,
          10,
          ['interpolate', ['linear'], ['get', 'count'], 1, 5, 500, 20],
        ],
        'circle-stroke-color': 'rgb(37, 14, 240)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'reynoutria_japonica',
      type: 'circle',
      source: 'reynoutria_japonica',
      'source-layer': 'Reynoutria_Japonica_2026_2025',
      paint: {
        'circle-color': 'rgb(255, 0, 234)',
        'circle-opacity': 0.5,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 5, 10, 5, 16, 10],
        'circle-stroke-color': 'rgb(214, 2, 197)',
        'circle-stroke-width': 0.2,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'demolition',
      type: 'circle',
      source: 'demolition',
      'source-layer': 'Abriss_4326_2025',
      paint: {
        'circle-color': '#08519c',
        'circle-opacity': 0.5,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 5, 16, ['get', 'surface_area']],
        'circle-stroke-color': 'rgb(37, 14, 240)',
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
      id: 'woods-fr',
      type: 'raster',
      source: 'woods_fr',
      paint: {
        'raster-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'ramming_earth',
      type: 'raster',
      source: 'ramming_earth',
      paint: {
        'raster-opacity': 0.5,
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'adobe_earth',
      type: 'raster',
      source: 'adobe_earth',
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
