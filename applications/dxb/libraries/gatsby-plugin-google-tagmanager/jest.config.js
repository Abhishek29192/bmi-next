"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  testEnvironment: "jsdom",
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-plugin-google-tagmanager/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-google-tagmanager/src/**"
  ]
};
