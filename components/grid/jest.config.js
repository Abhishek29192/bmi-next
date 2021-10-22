"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/grid/src"],
  collectCoverageFrom: ["<rootDir>/components/grid/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "79",
      branches: "56",
      functions: "66",
      lines: "79"
    }
  }
};
