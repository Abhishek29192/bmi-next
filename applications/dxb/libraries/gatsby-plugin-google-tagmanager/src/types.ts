import type { PluginOptions } from "gatsby";

export type Options = PluginOptions & {
  ids: string[];
  includeInDevelopment: boolean;
  defaultDataLayer: { platform: "gatsby"; env: string };
  gtmAuth?: string;
  gtmPreview?: string;
  dataLayerName?: string;
  routeChangeEventName?: string;
  enableWebVitalsTracking: boolean;
  selfHostedOrigin: string;
};

export type DataLayer = Record<string, unknown>[];

declare global {
  interface Window {
    dataLayer: DataLayer;
    [key: string]: DataLayer;
  }
}
