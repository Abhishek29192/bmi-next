"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/link-card/src"],
  collectCoverageFrom: ["<rootDir>/components/link-card/src/**/*.{ts,tsx,js}"]
};
