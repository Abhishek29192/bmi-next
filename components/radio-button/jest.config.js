"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/radio-button/src"],
  collectCoverageFrom: [
    "<rootDir>/components/radio-button/src/**/*.{ts,tsx,js}"
  ]
};
