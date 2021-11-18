"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/link-card/src"],
  collectCoverageFrom: ["<rootDir>/components/link-card/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "80",
      branches: "81",
      functions: "50",
      lines: "80"
    }
  }
};
