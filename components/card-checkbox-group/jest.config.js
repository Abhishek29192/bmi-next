"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/card-checkbox-group/src"],
  collectCoverageFrom: [
    "<rootDir>/components/card-checkbox-group/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "93",
      branches: "58",
      functions: "92",
      lines: "93"
    }
  }
};
