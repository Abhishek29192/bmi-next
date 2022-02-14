"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/slide-controls/src"],
  collectCoverageFrom: [
    "<rootDir>/components/slide-controls/src/**/*.{ts,tsx,js}"
  ]
};
