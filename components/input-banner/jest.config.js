"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/input-banner/src"],
  collectCoverageFrom: [
    "<rootDir>/components/input-banner/src/**/*.{ts,tsx,js}"
  ]
};
