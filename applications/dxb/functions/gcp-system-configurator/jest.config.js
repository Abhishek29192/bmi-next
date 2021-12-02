"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-system-configurator/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-system-configurator/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
