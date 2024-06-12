export type DataLayer = Record<string, unknown>[];

declare global {
  interface Window {
    dataLayer: DataLayer;
    [key: string]: DataLayer;
  }
}

export type GTMParams = {
  gtmIds: string[];
  dataLayer?: string[];
  dataLayerName?: string;
  auth?: string;
  preview?: string;
  includeInDevelopment?: boolean;
  enableWebVitalsTracking?: boolean;
  selfHostedOrigin?: string;
  defaultDataLayer?: { platform: string; env: string };
};

export type GAParams = {
  gaId: string;
  dataLayerName?: string;
};
