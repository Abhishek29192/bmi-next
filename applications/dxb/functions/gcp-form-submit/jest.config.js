"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-form-submit/src"],
  coverageThreshold: {
    global: {
      statements: "97",
      branches: "96",
      functions: "100",
      lines: "97"
    }
  }
};
