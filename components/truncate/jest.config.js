"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/truncate/src"],
  collectCoverageFrom: ["<rootDir>/components/truncate/src/**/*.{ts,tsx,js}"]
};
