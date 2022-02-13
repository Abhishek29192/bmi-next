"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/back-to-top/src"],
  collectCoverageFrom: ["<rootDir>/components/back-to-top/src/**/*.{ts,tsx,js}"]
};
