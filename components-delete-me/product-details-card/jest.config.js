"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/product-details-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/product-details-card/src/**/*.{ts,tsx,js}"
  ]
};
