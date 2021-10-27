"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/input-banner/src"],
  collectCoverageFrom: [
    "<rootDir>/components/input-banner/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "89",
      branches: "57",
      functions: "83",
      lines: "89"
    }
  }
};
