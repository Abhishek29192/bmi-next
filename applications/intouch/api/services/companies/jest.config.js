"use strict";

const sharedConfig = require("../../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../../",
  roots: ["<rootDir>/applications/intouch/api/services/companies/src"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "37",
      branches: "39",
      functions: "21",
      lines: "37"
    }
  }
};
