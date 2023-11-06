"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/functions-contentful-management-client/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-contentful-management-client/src/**/*.{ts,tsx,js}",
    "!<rootDir>/applications/dxb/libraries/functions-contentful-management-client/src/helpers/*.{ts,tsx,js}" // Only for tests in other workspaces, so no coverage in this workspace
  ],
  testEnvironment: "node"
};
