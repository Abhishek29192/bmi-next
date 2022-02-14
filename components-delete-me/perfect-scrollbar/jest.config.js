"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/perfect-scrollbar/src"],
  collectCoverageFrom: [
    "<rootDir>/components/perfect-scrollbar/src/**/*.{ts,tsx,js}"
  ]
};
