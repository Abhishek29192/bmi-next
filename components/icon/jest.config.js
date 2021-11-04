"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/icon/src"],
  collectCoverageFrom: ["<rootDir>/components/icon/src/**/*.{ts,tsx,js}"]
};
