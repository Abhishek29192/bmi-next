"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/libraries/functions-secret-client/src"],
  collectCoverageFrom: [
    "<rootDir>/libraries/functions-secret-client/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
