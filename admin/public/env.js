// Runtime settings for local development.
// In the Docker image, this file is regenerated at startup by entrypoint.sh
// from the environment variables of the same name.
window.env = {
  // Backend base URL; also enables development mode when it contains localhost or arema-dev.epfl.ch
  API_URL: 'http://localhost:8000',
  // Path appended to API_URL, e.g. '/api' (must match the backend PATH_PREFIX)
  API_PATH: '',
  // Keycloak client ID of the admin app (realm external on enac-it-sso2.epfl.ch)
  AUTH_CLIENT_ID: 'arema-local-admin',
  // Keycloak client ID of the backend, which holds the app roles (app-administrator etc.)
  AUTH_API_CLIENT_ID: 'arema-local-api',
};
