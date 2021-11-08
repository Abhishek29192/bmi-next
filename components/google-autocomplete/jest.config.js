"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/google-autocomplete/src"],
  collectCoverageFrom: [
    "<rootDir>/components/google-autocomplete/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "67",
      branches: "36",
      functions: "41",
      lines: "68"
    }
  }
};
