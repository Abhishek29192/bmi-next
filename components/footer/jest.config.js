"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/footer/src"],
  collectCoverageFrom: ["<rootDir>/components/footer/src/**/*.{ts,tsx,js}"]
};
