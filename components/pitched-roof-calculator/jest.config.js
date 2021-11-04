"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/pitched-roof-calculator/src"],
  collectCoverageFrom: [
    "<rootDir>/components/pitched-roof-calculator/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "84",
      branches: "69",
      functions: "79",
      lines: "84"
    }
  }
};
