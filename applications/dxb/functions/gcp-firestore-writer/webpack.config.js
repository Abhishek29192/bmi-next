"use strict";

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const sharedConfig = require("../../../../functions-webpack.config");

module.exports = {
  ...sharedConfig,
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist/dist/function")
  },
  plugins: [
    ...sharedConfig.plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "../../../../node_modules/@google-cloud/firestore/build/protos/protos.json",
          to: path.resolve(__dirname, "dist/protos/protos.json")
        }
      ]
    }),
    new GeneratePackageJsonPlugin({
      name: "gcp-firestore-writer",
      version: "0.0.0",
      main: "./dist/function/index.js"
    })
  ]
};
