"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-functions-deployer/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-functions-deployer/src/**/*.{ts,tsx,js}"
  ]
};
