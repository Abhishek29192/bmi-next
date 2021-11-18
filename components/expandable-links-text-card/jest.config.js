"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/expandable-links-text-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/expandable-links-text-card/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "86"
    }
  }
};
