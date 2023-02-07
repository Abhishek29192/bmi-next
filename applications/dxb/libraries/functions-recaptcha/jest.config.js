"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/functions-utils/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-utils/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
