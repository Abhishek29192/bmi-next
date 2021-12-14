"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-plugin-meta-redirect"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-meta-redirect/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "94",
      branches: "100",
      functions: "100",
      lines: "94"
    }
  }
};
