/* eslint-disable import/no-extraneous-dependencies */

"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const webpackConfiguration = require("../webpack.config");

module.exports = merge(webpackConfiguration, {
  mode: "production",

  output: {
    ...webpackConfiguration.output,
    path: path.resolve(__dirname, "../dist/prod/"),
    publicPath:
      "https://storage.googleapis.com/bmi-p-intouch-gcs-publicstorage-euw3-prod/auth0"
  },

  /* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
  devtool: false,

  /* Optimization configuration */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
      new CssMinimizerPlugin()
    ]
  },

  /* Performance treshold configuration values */
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },

  module: {
    rules: [
      {
        test: /.*\.html$/,
        loader: "raw-loader"
      },
      {
        test: /.*\.html$/,
        loader: "string-replace-loader",
        options: {
          multiple: [
            {
              search: "@@non_roof_img@@",
              replace:
                "https://storage.googleapis.com/bmi-p-intouch-gcs-publicstorage-euw3-prod/auth0/images/bmi_non_roofpro_intouch.jpg"
            },
            {
              search: "@@roof_imf@@",
              replace:
                "https://storage.googleapis.com/bmi-p-intouch-gcs-publicstorage-euw3-prod/auth0/images/bmi_roofpro_intouch.jpg"
            },
            {
              search: /@@base_url@@/g,
              replace: "https://{market}.intouch.bmigroup.com"
            }
          ]
        }
      }
    ]
  },

  /* Additional plugins configuration */
  plugins: []
});
