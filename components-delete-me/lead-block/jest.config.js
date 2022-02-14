"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/lead-block/src"],
  collectCoverageFrom: ["<rootDir>/components/lead-block/src/**/*.{ts,tsx,js}"]
};
