"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-pim-message-handler/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-pim-message-handler/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
