"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/theme-provider/src"],
  collectCoverageFrom: [
    "<rootDir>/components/theme-provider/src/**/*.{ts,tsx,js}"
  ]
};
