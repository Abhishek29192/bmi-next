"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/scripts/contentful-roles/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/scripts/contentful-roles/src/**/*.{ts,tsx,js}"
  ]
};
