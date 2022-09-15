"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  testEnvironment: "node",
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/contentful-migrate/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/contentful-migrate/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    "./src/*.ts": {
      statements: "100",
      branches: "100",
      functions: "100",
      lines: "100"
    }
  }
};
