"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/nba-card/src"],
  collectCoverageFrom: ["<rootDir>/components/nba-card/src/**/*.{ts,tsx,js}"]
};
