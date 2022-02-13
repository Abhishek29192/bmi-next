"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/hero/src"],
  collectCoverageFrom: ["<rootDir>/components/hero/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "87",
      branches: "94",
      functions: "55",
      lines: "93"
    }
  }
};
