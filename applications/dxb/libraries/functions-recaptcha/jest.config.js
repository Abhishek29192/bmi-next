"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/functions-recaptcha/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-recaptcha/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
