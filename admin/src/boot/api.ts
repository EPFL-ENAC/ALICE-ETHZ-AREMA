import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import Keycloak from 'keycloak-js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const appEnv = window.env;

const keycloak = new Keycloak({
  realm: 'enacit4r',
  url: 'https://auth.epfl.ch/auth',
  clientId: appEnv.AUTH_CLIENT_ID,
});
const cdnUrl = 'https://enacit4r-cdn.epfl.ch/';
const baseUrl = `${appEnv.API_URL}${appEnv.API_PATH}`;
const api = axios.create({
  baseURL: baseUrl,
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, baseUrl, cdnUrl, keycloak };
