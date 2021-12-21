"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/tooltip/src"],
  collectCoverageFrom: ["<rootDir>/components/tooltip/src/**/*.{ts,tsx,js}"]
};
