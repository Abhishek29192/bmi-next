"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/head/src"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "59",
      branches: "39",
      functions: "49",
      lines: "59"
    }
  }
};
