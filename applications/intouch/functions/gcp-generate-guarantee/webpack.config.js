"use strict";

const path = require("path");
const sharedConfig = require("../../../../node-webpack.config");

module.exports = {
  ...sharedConfig,
  module: {
    ...sharedConfig.module,
    rules: [
      {
        test: /\.ts(x)?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    ...sharedConfig.resolve,
    extensions: [...sharedConfig.resolve.extensions, ".tsx"]
  },
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    ...sharedConfig.plugins.filter((name) => name !== sharedConfig.plugins[0])
  ]
};
