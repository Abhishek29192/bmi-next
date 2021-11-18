"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/chip/src"],
  collectCoverageFrom: ["<rootDir>/components/chip/src/**/*.{ts,tsx,js}"]
};
