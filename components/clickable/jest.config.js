"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/clickable/src"],
  collectCoverageFrom: ["<rootDir>/components/clickable/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "92",
      branches: "85",
      lines: "92"
    }
  }
};
