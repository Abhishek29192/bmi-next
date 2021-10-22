"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/autocomplete/src"],
  collectCoverageFrom: [
    "<rootDir>/components/autocomplete/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "80",
      branches: "33",
      functions: "50",
      lines: "80"
    }
  }
};
