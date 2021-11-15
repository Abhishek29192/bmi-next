"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-es-proxy/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-es-proxy/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
