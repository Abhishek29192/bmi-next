"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/functions-contentful-client/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-contentful-client/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
