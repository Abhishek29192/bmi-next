"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/intouch/frontend"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "35",
      branches: "16",
      functions: "17",
      lines: "35"
    }
  },
  collectCoverageFrom: [
    ...sharedConfig.collectCoverageFrom,
    "!<rootDir>/.next/",
    "!<rootDir>/.storybook/"
  ]
};
