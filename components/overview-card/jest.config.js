"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/overview-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/overview-card/src/**/*.{ts,tsx,js}"
  ]
};
