"use strict";

const path = require("path");
const { withConfigs, styles } = require("@bmi/webpack");

module.exports = {
  webpack: (config, { defaultLoaders, dev, isServer }) => {
    // solution taken from https://github.com/jeantil/next-9-ts-aliases-workspaces/blob/master/packages/web-app/next.config.js
    config.module.rules.push({
      test: /\.(tsx|ts|js|mjs|jsx)$/,
      include: [path.resolve(config.context, "../../")],
      use: defaultLoaders.babel,
      exclude: (excludePath) => {
        return /node_modules/.test(excludePath);
      }
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return withConfigs(config, [
      styles({
        dev,
        isServer
      })
    ]);
  }
};
