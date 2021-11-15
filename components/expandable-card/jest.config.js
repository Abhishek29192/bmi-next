"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/expandable-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/expandable-card/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "94",
      branches: "86",
      functions: "84",
      lines: "95"
    }
  }
};
