"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/product-overview-pane/src"],
  collectCoverageFrom: [
    "<rootDir>/components/product-overview-pane/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "92",
      branches: "66",
      functions: "88",
      lines: "92"
    }
  }
};
