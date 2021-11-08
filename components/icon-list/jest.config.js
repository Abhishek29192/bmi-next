"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/icon-list/src"],
  collectCoverageFrom: ["<rootDir>/components/icon-list/src/**/*.{ts,tsx,js}"]
};
