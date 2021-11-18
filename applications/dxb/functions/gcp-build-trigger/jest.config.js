"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-build-trigger/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-build-trigger/src/**/*.{ts,tsx,js}"
  ]
};
