"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/tooltip/src"],
  collectCoverageFrom: ["<rootDir>/components/tooltip/src/**/*.{ts,tsx,js}"],
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
