"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/color-pair/src"],
  collectCoverageFrom: ["<rootDir>/components/color-pair/src/**/*.{ts,tsx,js}"]
};
