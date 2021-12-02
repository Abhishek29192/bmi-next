"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-apsis-integration/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-apsis-integration/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
