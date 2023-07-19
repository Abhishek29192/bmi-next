"use strict";

const sharedConfig = require("../../../../jest.config.js");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.(mt|t)s$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true
      }
    ],
    "^.+\\.(js|jsx|mjs)$": "babel-jest"
  },
  roots: ["<rootDir>/applications/dxb/libraries/pim-transformation/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/pim-transformation/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
