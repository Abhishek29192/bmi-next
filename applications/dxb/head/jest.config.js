"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/head/src"],
  collectCoverageFrom: ["<rootDir>/applications/dxb/head/src/**/*.{ts,tsx,js}"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "80",
      branches: "71",
      functions: "77",
      lines: "80"
    }
  },
  resolver: "jest-node-exports-resolver"
};
