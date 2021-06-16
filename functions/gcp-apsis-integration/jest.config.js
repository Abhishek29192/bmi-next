"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/functions/gcp-apsis-integration/src"],
  coverageThreshold: {
    global: {
      statements: "97",
      branches: "72",
      functions: "100",
      lines: "97"
    }
  }
};
