"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/bullets/src"],
  collectCoverageFrom: ["<rootDir>/components/bullets/src/**/*.{ts,tsx,js}"]
};
