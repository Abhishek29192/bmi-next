"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/language-selection/src"],
  collectCoverageFrom: [
    "<rootDir>/components/language-selection/src/**/*.{ts,tsx,js}"
  ]
};
