"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/explore-bar/src"],
  collectCoverageFrom: ["<rootDir>/components/explore-bar/src/**/*.{ts,tsx,js}"]
};
