"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/equal-heights/src"],
  collectCoverageFrom: [
    "<rootDir>/components/equal-heights/src/**/*.{ts,tsx,js}"
  ]
};
