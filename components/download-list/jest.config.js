"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/download-list/src"],
  collectCoverageFrom: [
    "<rootDir>/components/download-list/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "87",
      functions: "77"
    }
  }
};
