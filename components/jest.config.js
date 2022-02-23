"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../",
  roots: ["<rootDir>/components/src"],
  collectCoverageFrom: ["<rootDir>/components/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "95",
      branches: "89",
      functions: "92",
      lines: "95"
    }
  }
};
