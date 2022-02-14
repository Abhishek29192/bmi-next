"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/carousel/src"],
  collectCoverageFrom: ["<rootDir>/components/carousel/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "77",
      branches: "69",
      functions: "75",
      lines: "77"
    }
  }
};
