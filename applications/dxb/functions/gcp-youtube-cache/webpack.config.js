"use strict";

const path = require("path");
const sharedConfig = require("../../../../node-webpack.config");

module.exports = {
  ...sharedConfig,
  output: {
    ...sharedConfig.output,
    path: path.resolve(__dirname, "dist")
  }
};
