"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/product-overview-pane/src"],
  collectCoverageFrom: [
    "<rootDir>/components/product-overview-pane/src/**/*.{ts,tsx,js}"
  ]
};
