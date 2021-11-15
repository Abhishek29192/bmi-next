"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/upload/src"],
  collectCoverageFrom: ["<rootDir>/components/upload/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "96",
      branches: "87",
      functions: "94",
      lines: "95"
    }
  }
};
