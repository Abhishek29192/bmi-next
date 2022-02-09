"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/card/src"],
  collectCoverageFrom: ["<rootDir>/components/card/src/**/*.{ts,tsx,js}"]
};
