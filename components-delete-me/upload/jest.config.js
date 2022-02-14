"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/upload/src"],
  collectCoverageFrom: ["<rootDir>/components/upload/src/**/*.{ts,tsx,js}"]
};
