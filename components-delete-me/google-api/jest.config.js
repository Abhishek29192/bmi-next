"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/google-api/src"],
  collectCoverageFrom: ["<rootDir>/components/google-api/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "40",
      branches: "13",
      functions: "27",
      lines: "41"
    }
  }
};
