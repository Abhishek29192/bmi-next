"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/arrow-control/src"],
  collectCoverageFrom: [
    "<rootDir>/components/arrow-control/src/**/*.{ts,tsx,js}"
  ]
};
