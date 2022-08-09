"use strict";

const { DuplicatesPlugin } = require("inspectpack/plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      })
    ]
  },
  output: {
    filename: "index.js",
    library: {
      type: "commonjs"
    }
  },
  target: "node",
  devtool:
    process.env.NODE_ENV === "production"
      ? "source-map"
      : "eval-cheap-module-source-map",
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static"
    }),
    new DuplicatesPlugin({
      // Emit compilation warning or error? (Default: `false`)
      emitErrors: false,
      // Display full duplicates information? (Default: `false`)
      verbose: false
    })
  ]
};
