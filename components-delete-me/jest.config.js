"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../",
  roots: ["<rootDir>/components"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "71",
      branches: "54",
      functions: "67",
      lines: "72"
    }
  }
};
