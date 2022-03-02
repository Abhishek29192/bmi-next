"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/functions/gcp-update-webtools-bucket/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-update-webtools-bucket/src/**/*.{ts,tsx,js}"
  ]
};