"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/fetch-retry/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/fetch-retry/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
