/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SERVER_URL: string;
  readonly VITE_POLYGON_KEY: string;
  readonly VITE_FINNHUB_KEY: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
