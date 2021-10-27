"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/configurator-panel/src"],
  collectCoverageFrom: [
    "<rootDir>/components/configurator-panel/src/**/*.{ts,tsx,js}"
  ]
};
