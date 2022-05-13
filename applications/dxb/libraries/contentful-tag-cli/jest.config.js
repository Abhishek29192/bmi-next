"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/contentful-tag-cli/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/contentful-tag-cli/src/**/*.{ts,tsx,js}"
  ]
};
