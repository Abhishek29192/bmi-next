"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/thumb-scroller-button/src"],
  collectCoverageFrom: [
    "<rootDir>/components/thumb-scroller-button/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "50"
    }
  }
};
