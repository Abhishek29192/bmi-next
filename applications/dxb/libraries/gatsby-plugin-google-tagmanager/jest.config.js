"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  testEnvironment: "jsdom",
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-google-tagmanager/src"
  ],
  collectCoverageFrom: [
    ...sharedConfig.collectCoverageFrom,
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-google-tagmanager/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...extendedConfig.coverageThreshold.global,
      statements: 89.18,
      branches: 69.44,
      functions: 93.75,
      lines: 88.57
    }
  }
};
