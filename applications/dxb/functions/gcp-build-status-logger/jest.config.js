"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-build-status-logger/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-build-status-logger/src/**/*.{ts,tsx,js}"
  ]
};
