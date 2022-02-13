"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/table-of-content/src"],
  collectCoverageFrom: [
    "<rootDir>/components/table-of-content/src/**/*.{ts,tsx,js}"
  ]
};
