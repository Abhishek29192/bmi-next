"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/cta-card/src"],
  collectCoverageFrom: ["<rootDir>/components/cta-card/src/**/*.{ts,tsx,js}"]
};
