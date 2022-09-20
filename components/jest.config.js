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
      statements: "97",
      branches: "92",
      functions: "95",
      lines: "97"
    }
  }
};
