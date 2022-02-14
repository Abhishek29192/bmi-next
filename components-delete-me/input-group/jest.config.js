"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/input-group/src"],
  collectCoverageFrom: ["<rootDir>/components/input-group/src/**/*.{ts,tsx,js}"]
};
