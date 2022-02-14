"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/thumbnail/src"],
  collectCoverageFrom: ["<rootDir>/components/thumbnail/src/**/*.{ts,tsx,js}"]
};
