"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/intouch/frontend"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "52",
      branches: "25",
      functions: "31",
      lines: "53"
    }
  },
  collectCoverageFrom: [
    ...sharedConfig.collectCoverageFrom,
    "!<rootDir>/.next/",
    "!<rootDir>/.storybook/"
  ],
  resolver: "@bmi/jest-node-exports-resolver"
};
