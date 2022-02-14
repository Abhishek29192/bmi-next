"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/alternative-content/src"],
  collectCoverageFrom: [
    "<rootDir>/components/alternative-content/src/**/*.{ts,tsx,js}"
  ]
};
