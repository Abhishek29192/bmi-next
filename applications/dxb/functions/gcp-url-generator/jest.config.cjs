"use strict";

const sharedConfig = require("../../../../jest.config.js");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-url-generator/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-url-generator/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.(mt|t|cj|j)s$": [
      "ts-jest",
      {
        useESM: true
      }
    ]
  }
};
