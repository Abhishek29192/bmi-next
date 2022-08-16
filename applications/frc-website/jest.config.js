"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/applications/frc-website/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/frc-website/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "35",
      branches: "19",
      functions: "27",
      lines: "35"
    }
  },
  resolver: "jest-node-exports-resolver"
};
