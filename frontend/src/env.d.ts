declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    API_URL: string | undefined;
    API_PATH: string | undefined;
    MARTIN_URL: string | undefined;
  }
}
