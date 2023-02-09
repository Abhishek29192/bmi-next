"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/contentful-default-values-cli/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/contentful-default-values-cli/src/**/*.{ts,tsx,js}"
  ]
};
