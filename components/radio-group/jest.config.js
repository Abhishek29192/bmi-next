"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/radio-group/src"],
  collectCoverageFrom: [
    "<rootDir>/components/radio-group/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "95",
      branches: "66",
      lines: "95"
    }
  }
};
