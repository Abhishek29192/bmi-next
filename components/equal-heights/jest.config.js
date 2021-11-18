"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/equal-heights/src"],
  collectCoverageFrom: [
    "<rootDir>/components/equal-heights/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "93",
      branches: "72",
      functions: "81",
      lines: "93"
    }
  }
};
