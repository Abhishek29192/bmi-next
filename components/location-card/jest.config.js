"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/location-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/location-card/src/**/*.{ts,tsx,js}"
  ]
};
