"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/anchor-link/src"],
  collectCoverageFrom: ["<rootDir>/components/anchor-link/src/**/*.{ts,tsx,js}"]
};
