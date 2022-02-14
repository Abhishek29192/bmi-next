"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/filters/src"],
  collectCoverageFrom: ["<rootDir>/components/filters/src/**/*.{ts,tsx,js}"]
};
