"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/tile-list/src"],
  collectCoverageFrom: ["<rootDir>/components/tile-list/src/**/*.{ts,tsx,js}"]
};
