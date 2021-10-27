"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/geolocation-button/src"],
  collectCoverageFrom: [
    "<rootDir>/components/geolocation-button/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "65",
      branches: "40",
      functions: "50",
      lines: "65"
    }
  }
};
