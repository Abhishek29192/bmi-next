"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/show-more/src"],
  collectCoverageFrom: ["<rootDir>/components/show-more/src/**/*.{ts,tsx,js}"]
};
