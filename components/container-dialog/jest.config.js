"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/container-dialog/src"],
  collectCoverageFrom: [
    "<rootDir>/components/container-dialog/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "95",
      branches: "70",
      lines: "95"
    }
  }
};
