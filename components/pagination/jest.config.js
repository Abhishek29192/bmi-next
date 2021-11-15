"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/pagination/src"],
  collectCoverageFrom: ["<rootDir>/components/pagination/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "97",
      branches: "94",
      lines: "97"
    }
  }
};
