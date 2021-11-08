"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/youtube-video/src"],
  collectCoverageFrom: [
    "<rootDir>/components/youtube-video/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "87",
      branches: "47",
      functions: "81",
      lines: "87"
    }
  }
};
