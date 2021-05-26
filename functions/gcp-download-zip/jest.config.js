"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/functions/gcp-download-zip/src"],
  coverageThreshold: {
    global: {
      statements: "95",
      branches: "100",
      functions: "88",
      lines: "95"
    }
  }
};
