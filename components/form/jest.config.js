"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/form/src"],
  collectCoverageFrom: ["<rootDir>/components/form/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "60",
      branches: "12",
      functions: "29",
      lines: "61"
    }
  }
};
