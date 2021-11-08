"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/spotlight-hero/src"],
  collectCoverageFrom: [
    "<rootDir>/components/spotlight-hero/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "94",
      branches: "92",
      lines: "94"
    }
  }
};
