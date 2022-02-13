"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/brand-intro-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/brand-intro-card/src/**/*.{ts,tsx,js}"
  ]
};
