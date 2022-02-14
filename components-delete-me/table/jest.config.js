"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/table/src"],
  collectCoverageFrom: ["<rootDir>/components/table/src/**/*.{ts,tsx,js}"]
};
