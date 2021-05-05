// TODO: Remove this before merge
/* eslint-disable no-undef */
"use strict";

const defaultOptions = require("./default-options");

const updatePageTracking = (pluginOptions) => {
  const { productionOnly } = Object.assign({}, defaultOptions, pluginOptions);

  if (
    (productionOnly && process.env.NODE_ENV !== "production") ||
    !window.ldanalytics
  ) {
    return;
  }

  // wrap inside a timeout to make sure react-helmet is done with it's changes (https://github.com/gatsbyjs/gatsby/issues/9139)
  // react-helmet is using requestAnimationFrame (https://github.com/nfl/react-helmet/blob/5.2.0/src/HelmetUtils.js#L296-L299)
  const trackPageView = () => {
    window["ldanalytics"].push(function (_) {
      _.pageVisit();
    });
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(trackPageView);
    });
  } else {
    // simulate 2 requestAnimationFrame calls
    setTimeout(trackPageView, 32);
  }
};

exports.onInitialClientRender = (_, pluginOptions) =>
  updatePageTracking(pluginOptions);
exports.onRouteUpdate = (_, pluginOptions) => updatePageTracking(pluginOptions);
