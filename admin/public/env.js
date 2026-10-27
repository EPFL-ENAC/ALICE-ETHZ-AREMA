// Runtime settings for local development.
// In the Docker image, this file is regenerated at startup by entrypoint.sh
// from the environment variables of the same name.
window.env = {
  // Backend base URL; also enables development mode when it contains localhost or arema-dev.epfl.ch
  API_URL: 'http://localhost:8000',
  // Path appended to API_URL, e.g. '/api' (must match the backend PATH_PREFIX)
  API_PATH: '',
  // Keycloak client ID of the admin app (realm AREMA on enac-it-sso.epfl.ch)
  AUTH_CLIENT_ID: 'local-admin',
};
