import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const appEnv = window.env;

const cdnUrl = 'https://enacit4r-cdn.epfl.ch';
const baseUrl = `${appEnv.API_URL}${appEnv.API_PATH}`;
const api = axios.create({
  baseURL: baseUrl,
});

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  const umamiWebsiteId = appEnv.UMAMI_WEBSITE_ID;
  const umamiUrl = appEnv.UMAMI_URL;

  if (umamiWebsiteId && umamiUrl) {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    script.setAttribute('data-website-id', umamiWebsiteId);
    script.src = `${umamiUrl}/script.js`;
    document.head.appendChild(script);

    // Optional: Wait until script is loaded before tracking
    script.onload = () => {
      router.afterEach(() => {
        window.umami?.track();
      });
    };
  } else {
    console.warn('[Umami] Missing env vars: UMAMI_URL or UMAMI_WEBSITE_ID');
  }
});

export { api, baseUrl, cdnUrl };
