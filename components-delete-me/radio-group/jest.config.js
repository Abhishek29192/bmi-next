"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/radio-group/src"],
  collectCoverageFrom: ["<rootDir>/components/radio-group/src/**/*.{ts,tsx,js}"]
};
