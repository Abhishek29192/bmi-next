"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/visualiser/src"],
  collectCoverageFrom: ["<rootDir>/components/visualiser/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "0",
      branches: "0",
      functions: "0",
      lines: "0"
    }
  }
};
