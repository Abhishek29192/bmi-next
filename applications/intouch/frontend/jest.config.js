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
    "<rootDir>/**/*.{ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/.next/",
    "!<rootDir>/.storybook/"
  ]
};
