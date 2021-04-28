"use strict";

const defaultOptions = require("./default-options");

exports.onRouteUpdate = ({ location }, pluginOptions) => {
  const { productionOnly } = Object.assign({}, defaultOptions, pluginOptions);

  if ((productionOnly && process.env.NODE_ENV !== "production") || !location) {
    return;
  }
};
