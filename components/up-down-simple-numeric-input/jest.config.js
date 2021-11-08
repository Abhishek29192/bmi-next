"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/up-down-simple-numeric-input/src"],
  collectCoverageFrom: [
    "<rootDir>/components/up-down-simple-numeric-input/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "77",
      branches: "87",
      functions: "42",
      lines: "84"
    }
  }
};
