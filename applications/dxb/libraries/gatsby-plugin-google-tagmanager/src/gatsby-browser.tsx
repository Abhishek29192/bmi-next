import type { GatsbyBrowser } from "gatsby";
import type { DataLayer, Options } from "./types";

const listOfMetricsSend = new Set();

const debounce = (fn: TimerHandler, timeout: number) => {
  let timer: number | null = null;

  return function (...args: unknown[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout, ...args);
  };
};

type Data = {
  name: string;
  value: number;
  id: unknown;
};

const sendWebVitals = async (dataLayerName = "dataLayer") => {
  const win = window;

  function sendData(data: Data) {
    if (listOfMetricsSend.has(data.name)) {
      return;
    }
    listOfMetricsSend.add(data.name);

    // eslint-disable-next-line security/detect-object-injection
    sendToGTM(data, win[dataLayerName]);
  }

  const { onLCP, onFID, onCLS } = await import("web-vitals");
  const debouncedCLS = debounce(sendData, 3000);
  // we don't need to debounce FID - we send it when it happens
  const debouncedFID = sendData;
  // LCP can occur multiple times so we debounce it
  const debouncedLCP = debounce(sendData, 3000);
  // With the true flag, we measure all previous occurences too, in case we start listening to late.
  onCLS(debouncedCLS, { reportAllChanges: true });
  onFID(debouncedFID, { reportAllChanges: true });
  onLCP(debouncedLCP, { reportAllChanges: true });
};

const sendToGTM = ({ name, value, id }: Data, dataLayer: DataLayer) => {
  dataLayer.push({
    event: "core-web-vitals",
    webVitalsMeasurement: {
      name: name,
      // The `id` value will be unique to the current page load. When sending
      // multiple values from the same page (e.g. for CLS), Google Analytics can
      // compute a total by grouping on this ID (note: requires `eventLabel` to
      // be a dimension in your report).
      id,
      // Google Analytics metrics must be integers, so the value is rounded.
      // For CLS the value is first multiplied by 1000 for greater precision
      // (note: increase the multiplier for greater precision if needed).
      value: Math.round(name === "CLS" ? value * 1000 : value)
    }
  });
};

export const onRouteUpdate: GatsbyBrowser["onRouteUpdate"] = (
  _,
  pluginOptions: Options
) => {
  if (
    process.env.NODE_ENV === "production" ||
    pluginOptions.includeInDevelopment
  ) {
    // wrap inside a timeout to ensure the title has properly been changed
    setTimeout(() => {
      const data = pluginOptions.dataLayerName
        ? window[pluginOptions.dataLayerName]
        : window.dataLayer;
      const eventName = pluginOptions.routeChangeEventName
        ? pluginOptions.routeChangeEventName
        : "gatsby-route-change";

      data.push({ event: eventName });
    }, 50);
  }
};

export const onInitialClientRender: GatsbyBrowser["onInitialClientRender"] = (
  _,
  pluginOptions: Options
) => {
  // we only load the polyfill in production so we can't enable it in development
  if (
    process.env.NODE_ENV === "production" &&
    pluginOptions.enableWebVitalsTracking
  ) {
    sendWebVitals(pluginOptions.dataLayerName);
  }
};
