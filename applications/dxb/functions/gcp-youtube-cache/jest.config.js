"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-youtube-cache/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-youtube-cache/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      statements: "67",
      branches: "90",
      functions: "33",
      lines: "67"
    }
  }
};
