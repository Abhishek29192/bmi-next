"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/card-radio-group/src"],
  collectCoverageFrom: [
    "<rootDir>/components/card-radio-group/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "66"
    }
  }
};
