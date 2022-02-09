"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/company-details/src"],
  collectCoverageFrom: [
    "<rootDir>/components/company-details/src/**/*.{ts,tsx,js}"
  ]
};
