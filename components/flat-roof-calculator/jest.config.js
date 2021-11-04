"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/flat-roof-calculator/src"],
  collectCoverageFrom: [
    "<rootDir>/components/flat-roof-calculator/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "40",
      branches: "13",
      functions: "27",
      lines: "41"
    }
  }
};
