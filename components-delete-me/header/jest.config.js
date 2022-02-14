"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/header/src"],
  collectCoverageFrom: ["<rootDir>/components/header/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "91",
      branches: "81",
      functions: "94",
      lines: "91"
    }
  }
};
