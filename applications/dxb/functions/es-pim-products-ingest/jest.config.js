"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/es-pim-products-ingest/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/es-pim-products-ingest/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "95"
    }
  }
};
