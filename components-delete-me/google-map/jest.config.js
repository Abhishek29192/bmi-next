"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/google-map/src"],
  collectCoverageFrom: ["<rootDir>/components/google-map/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "79",
      branches: "56",
      functions: "66",
      lines: "79"
    }
  }
};
