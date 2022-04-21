"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/pim-types/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/pim-types/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      statements: "30",
      functions: "18",
      lines: "30",
      branches: "60"
    }
  }
};
