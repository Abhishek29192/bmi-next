"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/search/src"],
  collectCoverageFrom: ["<rootDir>/components/search/src/**/*.{ts,tsx,js}"]
};
