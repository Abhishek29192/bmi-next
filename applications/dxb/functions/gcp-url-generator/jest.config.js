"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-url-generator/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-firestore-writer/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
