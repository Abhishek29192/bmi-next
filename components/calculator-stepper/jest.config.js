"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/calculator-stepper/src"],
  collectCoverageFrom: [
    "<rootDir>/components/calculator-stepper/src/**/*.{ts,tsx,js}"
  ]
};
