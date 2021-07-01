"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/dxb/head/src"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "58",
      branches: "34",
      functions: "43",
      lines: "58"
    }
  }
};
