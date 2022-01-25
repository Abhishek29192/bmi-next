"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/functions-logger/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-logger/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
