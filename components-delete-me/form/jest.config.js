"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/form/src"],
  collectCoverageFrom: ["<rootDir>/components/form/src/**/*.{ts,tsx,js}"]
};
