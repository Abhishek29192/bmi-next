"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/intouch/frontend"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "50",
      branches: "25",
      functions: "32",
      lines: "50"
    }
  },
  collectCoverageFrom: [
    ...sharedConfig.collectCoverageFrom,
    "!<rootDir>/.next/",
    "!<rootDir>/.storybook/"
  ]
};
