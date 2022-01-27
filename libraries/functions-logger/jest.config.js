"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/libraries/functions-logger/src"],
  collectCoverageFrom: [
    "<rootDir>/libraries/functions-logger/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
