"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/applications/intouch/frontend"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "56",
      branches: "23",
      functions: "29",
      lines: "55"
    }
  },
  coveragePathIgnorePatterns: [
    ...sharedConfig.coveragePathIgnorePatterns,
    ".next/",
    ".storybook/"
  ]
};
