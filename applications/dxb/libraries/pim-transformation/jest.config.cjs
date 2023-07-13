"use strict";

const sharedConfig = require("../../../../jest.config.cjs");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/fetch-retry/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/fetch-retry/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
