"use strict";

const sharedConfig = require("../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/head/src"],
  collectCoverageFrom: ["<rootDir>/applications/dxb/head/src/**/*.{ts,tsx,js}"],
  setupFilesAfterEnv: [
    ...sharedConfig.setupFilesAfterEnv,
    "<rootDir>/applications/dxb/head/jest/setupTests.ts"
  ],
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "82",
      branches: "75",
      functions: "81",
      lines: "82"
    }
  },
  resolver: "jest-node-exports-resolver"
};
