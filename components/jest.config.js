"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../",
  roots: ["<rootDir>/components"],
  coverageThreshold: {
    global: {
      statements: "19",
      branches: "7",
      functions: "9",
      lines: "35"
    }
  }
};
