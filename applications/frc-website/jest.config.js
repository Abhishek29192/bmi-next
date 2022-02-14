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
      statements: "33",
      branches: "18",
      functions: "24",
      lines: "34"
    }
  },
  resolver: "@bmi/jest-node-exports-resolver"
};
