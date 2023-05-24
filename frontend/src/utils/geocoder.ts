import { LngLatBounds } from 'maplibre-gl'

const nouakchottBounds = new LngLatBounds([-16.2, 17.886], [-15.781, 18.393])
const [[x1, y1], [x2, y2]] = nouakchottBounds.toArray()

/**
 * https://maplibre.org/maplibre-gl-js-docs/example/geocoder/
 */
export const geocoderApi = {
  forwardGeocode: async (config: { query: string }) => {
    const features = []
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1&viewbox=${x1},${y1},${x2},${y2}&bounded=1`
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
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
        }
        features.push(point)
      }
    }
    catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }
    return {
      features,
    };
  },
};
