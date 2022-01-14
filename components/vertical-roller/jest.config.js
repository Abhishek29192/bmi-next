"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/vertical-roller/src"],
  collectCoverageFrom: [
    "<rootDir>/components/vertical-roller/src/**/*.{ts,tsx,js}"
  ]
};
