"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/roller-selector/src"],
  collectCoverageFrom: [
    "<rootDir>/components/roller-selector/src/**/*.{ts,tsx,js}"
  ]
};
