"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/two-pane-carousel/src"],
  collectCoverageFrom: [
    "<rootDir>/components/two-pane-carousel/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "92",
      branches: "90",
      functions: "73",
      lines: "95"
    }
  }
};
