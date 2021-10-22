"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/media/src"],
  collectCoverageFrom: ["<rootDir>/components/media/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "52",
      branches: "20",
      functions: "25",
      lines: "52"
    }
  }
};
