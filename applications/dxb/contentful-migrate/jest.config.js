"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  testEnvironment: "node",
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/contentful-migrate/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/contentful-migrate/src/**",
    "!<rootDir>/applications/dxb/contentful-migrate/src/migrations/**",
    "!<rootDir>/applications/dxb/contentful-migrate/src/variables/**"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "94"
    }
  }
};
