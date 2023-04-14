"use strict";

const sharedConfig = require("../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  testEnvironment: "node",
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/redirects-editor/src"],
  collectCoverageFrom: ["<rootDir>/applications/dxb/redirects-editor/src/**"]
};
