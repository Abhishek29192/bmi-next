"use strict";

const path = require("path");
const sharedConfig = require("../../../../node-webpack.config.js");

module.exports = {
  ...sharedConfig,
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist")
  }
};
