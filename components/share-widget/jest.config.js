"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/share-widget/src"],
  collectCoverageFrom: [
    "<rootDir>/components/share-widget/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "47",
      branches: "46",
      functions: "46",
      lines: "47"
    }
  }
};
