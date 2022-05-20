"use strict";

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const { IgnorePlugin } = require("webpack");
const sharedConfig = require("../../../../functions-webpack.config");

module.exports = {
  ...sharedConfig,
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    ...sharedConfig.plugins.filter((name) => name !== sharedConfig.plugins[0]),
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "../../../../node_modules/@google-cloud/firestore/build/protos/protos.json",
          to: path.resolve(__dirname, "dist/protos/protos.json")
        }
      ]
    }),
    new GeneratePackageJsonPlugin({
      name: "gcp-intouch-cron-certification",
      version: "0.0.0",
      main: "./dist/function/index.js"
    })
  ]
};
