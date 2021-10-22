"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/quantity-table/src"],
  collectCoverageFrom: [
    "<rootDir>/components/quantity-table/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "85",
      functions: "63",
      lines: "85"
    }
  }
};
