"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/raw-text-field/src"],
  collectCoverageFrom: [
    "<rootDir>/components/raw-text-field/src/**/*.{ts,tsx,js}"
  ]
};
