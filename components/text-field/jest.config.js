"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/text-field/src"],
  collectCoverageFrom: ["<rootDir>/components/text-field/src/**/*.{ts,tsx,js}"]
};
