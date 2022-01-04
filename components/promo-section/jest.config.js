"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/promo-section/src"],
  collectCoverageFrom: [
    "<rootDir>/components/promo-section/src/**/*.{ts,tsx,js}"
  ]
};
