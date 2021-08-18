"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/libraries/contentful-upload"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "100",
      branches: "100",
      functions: "100",
      lines: "100"
    }
  }
};
