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
      statements: "81",
      branches: "71",
      functions: "80",
      lines: "80"
    }
  },
  resolver: "@bmi/jest-node-exports-resolver"
};
