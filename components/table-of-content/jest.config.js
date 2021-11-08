"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/table-of-content/src"],
  collectCoverageFrom: [
    "<rootDir>/components/table-of-content/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "93",
      branches: "66",
      functions: "83",
      lines: "93"
    }
  }
};
