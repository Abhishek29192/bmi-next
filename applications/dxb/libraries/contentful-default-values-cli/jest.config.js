"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/contentful-default-values-cli/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/contentful-default-values-cli/src/**/*.{ts,tsx,js}"
  ]
};
