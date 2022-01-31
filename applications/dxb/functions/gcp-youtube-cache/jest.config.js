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
      statements: "62",
      branches: "88",
      functions: "33",
      lines: "62"
    }
  }
};
