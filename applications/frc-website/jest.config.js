"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/applications/frc-website/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/frc-website/src/**/*.{ts,tsx,js}"
  ],
  setupFilesAfterEnv: [
    ...sharedConfig.setupFilesAfterEnv,
    "<rootDir>/applications/frc-website/jest/setupTests.ts"
  ],
  testEnvironment: "jsdom",
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
