"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-youtube-cache/src"],
  coverageThreshold: {
    global: {
      statements: "40",
      branches: "50",
      functions: "25",
      lines: "40"
    }
  }
};
