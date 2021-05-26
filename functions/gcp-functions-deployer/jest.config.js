"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/functions/gcp-functions-deployer/src"],
  coverageThreshold: {
    global: {
      statements: "88",
      branches: "71",
      functions: "100",
      lines: "88"
    }
  }
};
