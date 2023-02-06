"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/es-pim-products-ingest/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/es-pim-products-ingest/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
