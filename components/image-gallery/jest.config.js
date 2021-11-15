"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/image-gallery/src"],
  collectCoverageFrom: [
    "<rootDir>/components/image-gallery/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "64",
      branches: "26",
      functions: "31",
      lines: "64"
    }
  }
};
