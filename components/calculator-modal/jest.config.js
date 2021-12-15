"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/calculator-modal/src"],
  collectCoverageFrom: [
    "<rootDir>/components/calculator-modal/src/**/*.{ts,tsx,js}"
  ]
};
