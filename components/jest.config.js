"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../",
  roots: ["<rootDir>/components"],
  coverageThreshold: {
    global: {
      statements: "23",
      branches: "11",
      functions: "15",
      lines: "48"
    }
  }
};
