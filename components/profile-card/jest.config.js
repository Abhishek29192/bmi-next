"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/profile-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/profile-card/src/**/*.{ts,tsx,js}"
  ],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      branches: "85"
    }
  }
};
