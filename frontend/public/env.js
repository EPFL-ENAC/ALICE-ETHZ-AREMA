// Runtime settings for local development.
// In the Docker image, this file is regenerated at startup by entrypoint.sh
// from the environment variables of the same name.
window.env = {
  // Backend base URL
  API_URL: 'http://localhost:8000',
  // Path appended to API_URL, e.g. '/api' (must match the backend PATH_PREFIX)
  API_PATH: '',
  // Umami analytics server; tracking is enabled only when both UMAMI_* are set
  UMAMI_URL: 'https://cloud.umami.is',
  // Umami website ID (empty: no tracking)
  UMAMI_WEBSITE_ID: '',
};
