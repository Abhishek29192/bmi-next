"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/card/src"],
  collectCoverageFrom: ["<rootDir>/components/card/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "87",
      branches: "41",
      functions: "45",
      lines: "87"
    }
  }
};
