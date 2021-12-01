"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/alert-banner/src"],
  collectCoverageFrom: [
    "<rootDir>/components/alert-banner/src/**/*.{ts,tsx,js}"
  ]
};
