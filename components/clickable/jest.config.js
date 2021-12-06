"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/clickable/src"],
  collectCoverageFrom: ["<rootDir>/components/clickable/src/**/*.{ts,tsx,js}"]
};
