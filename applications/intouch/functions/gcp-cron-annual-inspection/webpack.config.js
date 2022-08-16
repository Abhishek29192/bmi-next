"use strict";

const path = require("path");
const sharedConfig = require("../../../../node-webpack.config");

module.exports = {
  ...sharedConfig,
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    ...sharedConfig.plugins.filter((name) => name !== sharedConfig.plugins[0])
  ]
};
