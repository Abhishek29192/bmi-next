"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/card-input/src"],
  collectCoverageFrom: ["<rootDir>/components/card-input/src/**/*.{ts,tsx,js}"]
};
