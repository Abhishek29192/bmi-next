"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/toggle-card/src"],
  collectCoverageFrom: ["<rootDir>/components/toggle-card/src/**/*.{ts,tsx,js}"]
};
