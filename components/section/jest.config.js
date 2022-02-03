"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/section/src"],
  collectCoverageFrom: ["<rootDir>/components/section/src/**/*.{ts,tsx,js}"]
};
