"use strict";

const path = require("path");
const { withConfigs, styles } = require("@bmi/webpack");
const withFonts = require("next-fonts");

module.exports = withFonts({
  i18n: {
    localeDetection: false,
    locales: ["en", "de"],
    defaultLocale: "en",
    domains: [
      {
        domain: "localhost",
        defaultLocale: "en"
      },
      {
        domain: "bmitest.local",
        defaultLocale: "de"
      }
    ]
  },
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

    // workaround for fs issues in translation config
    if (!isServer) {
      config.node = {
        fs: "empty"
      };
    }

    return withConfigs(config, [
      styles({
        dev,
        isServer
      })
    ]);
  }
});
