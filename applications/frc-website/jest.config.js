"use strict";

const sharedConfig = require("../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
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
      statements: 32.74,
      branches: 19.69,
      functions: 24.83,
      lines: 33.49
    }
  }
};
