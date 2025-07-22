import type { Feature, FeatureCollection } from '@turf/turf';

const COUNTRIES = ['ch', 'fr', 'it', 'de', 'at'];

function handleNominatimResponse(geojson: FeatureCollection): Feature[] {
  const features: Feature[] = [];
  const place_names: string[] = [];
  for (const feature of geojson.features.filter((f: Feature) =>
    COUNTRIES.includes(f.properties?.address.country_code),
  )) {
    if (
      feature.properties &&
      !place_names.includes(feature.properties.display_name) &&
      feature.bbox
    ) {
      const center = [
        feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
        feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
      ];
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center,
        },
        place_name: feature.properties.display_name,
        properties: feature.properties,
        text: feature.properties.display_name,
        place_type: ['place'],
        center,
      } as Feature;
      place_names.push(feature.properties.display_name);
      features.push(point);
    }
  }
  return features;
}

let searchController: AbortController;
let reverseController: AbortController;

/**
 * Example: https://maplibre.org/maplibre-gl-js-docs/example/geocoder/
 * API: https://github.com/maplibre/maplibre-gl-geocoder/blob/main/API.md
 * Output format: https://web.archive.org/web/20210224184722/https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 */
export const geocoderApi = {
  forwardGeocode: async (config: { query: string; limit: number; countries: string[] }) => {
    let features: Feature[] = [];
    try {
      let countrycodes = COUNTRIES.join(',');
      if (config.countries && config.countries.length > 0)
        countrycodes = config.countries.join(',');
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&limit=${config.limit}&format=geojson&polygon_geojson=1&addressdetails=1&countrycodes=${countrycodes}`;
      if (searchController) searchController.abort();
      searchController = new AbortController();
      const response = await fetch(request, {
        signal: searchController.signal,
      });
      const geojson = await response.json();
      features = handleNominatimResponse(geojson);
    } catch (e: unknown) {
      console.error('Failed to forwardGeocode with error:', e);
    }
    return {
      features,
    };
  },
  reverseGeocode: async (config: { query: { lon: number; lat: number } }) => {
    let features: Feature[] = [];
    try {
      if (reverseController) reverseController.abort();
      reverseController = new AbortController();
      const request = `https://nominatim.openstreetmap.org/reverse?lat=${config.query.lat}&lon=${config.query.lon}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request, {
        signal: reverseController.signal,
      });
      const geojson = await response.json();
      features = handleNominatimResponse(geojson);
    } catch (e: unknown) {
      console.error('Failed to reverseGeocode with error:', e);
    }
    return {
      features,
    };
  },
};

export function toAddress(feature: Feature) {
  let text = '';
  if (feature.properties?.address) {
    const withHouseNumber = Object.keys(feature.properties.address).includes('house_number');
    [
      'amenity',
      'office',
      'road',
      'house_number',
      'postcode',
      'village',
      'town',
      'city',
      'country_code',
    ].forEach((key) => {
      if (feature.properties?.address[key]) {
        const val = feature.properties.address[key];
        text +=
          (['country_code'].includes(key) ? val.toUpperCase() : val) +
          (['amenity', 'office', withHouseNumber ? 'house_number' : 'road'].includes(key)
            ? ', '
            : ' ');
      }
    });
  }
  return text.trim();
}
