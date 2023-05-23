"use strict";

const sharedConfig = require("../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  testEnvironment: "node",
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/contentful-migrate/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/contentful-migrate/src/**",
    "!<rootDir>/applications/dxb/contentful-migrate/src/migrations/**",
    "!<rootDir>/applications/dxb/contentful-migrate/src/variables/**"
  ],
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
  },
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "94"
    }
  }
};
