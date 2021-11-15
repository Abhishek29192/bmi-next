"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/button/src"],
  collectCoverageFrom: ["<rootDir>/components/button/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "82"
    }
  }
};
