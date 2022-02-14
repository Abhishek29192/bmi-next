"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/container/src"],
  collectCoverageFrom: ["<rootDir>/components/container/src/**/*.{ts,tsx,js}"]
};
