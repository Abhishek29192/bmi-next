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
      statements: "36",
      branches: "20",
      functions: "27",
      lines: "36"
    }
  },
  resolver: "jest-node-exports-resolver"
};
