"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/autocomplete/src"],
  collectCoverageFrom: [
    "<rootDir>/components/autocomplete/src/**/*.{ts,tsx,js}"
  ]
};
