"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/text-field/src"],
  collectCoverageFrom: ["<rootDir>/components/text-field/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "94",
      branches: "66",
      functions: "33",
      lines: "94"
    }
  }
};
