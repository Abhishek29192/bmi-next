"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-download-zip/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-download-zip/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "97",
      branches: "96",
      functions: "90",
      lines: "97"
    }
  }
};
