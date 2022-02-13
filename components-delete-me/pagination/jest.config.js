"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/pagination/src"],
  collectCoverageFrom: ["<rootDir>/components/pagination/src/**/*.{ts,tsx,js}"]
};
