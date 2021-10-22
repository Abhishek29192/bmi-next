"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/hide-print/src"],
  collectCoverageFrom: ["<rootDir>/components/hide-print/src/**/*.{ts,tsx,js}"]
};
