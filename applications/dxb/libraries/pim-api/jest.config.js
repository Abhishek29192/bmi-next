"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/pim-api/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/pim-api/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
