"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/radio-pane/src"],
  collectCoverageFrom: ["<rootDir>/components/radio-pane/src/**/*.{ts,tsx,js}"]
};
