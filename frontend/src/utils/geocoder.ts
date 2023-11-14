// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleNominatimResponse(geojson: any): any[] {
  const features = [];
  const place_names: string[] = [];
  for (const feature of geojson.features.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) => f.properties.address.country_code === 'ch'
  )) {
    if (!place_names.includes(feature.properties.display_name)) {
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
      };
      place_names.push(feature.properties.display_name);
      features.push(point);
    }
  }
  return features;
}

let searchController: AbortController;

/**
 * Example: https://maplibre.org/maplibre-gl-js-docs/example/geocoder/
 * API: https://github.com/maplibre/maplibre-gl-geocoder/blob/main/API.md
 * Output format: https://web.archive.org/web/20210224184722/https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 */
export const geocoderApi = {
  forwardGeocode: async (config: {
    query: string;
    limit: number;
    countries: string[];
  }) => {
    let features = [];
    try {
      let countrycodes = 'ch';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.name !== 'AbortError')
        console.error(`Failed to forwardGeocode with error: ${e}`);
    }
    return {
      features,
    };
  },
};
