"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/media/src"],
  collectCoverageFrom: ["<rootDir>/components/media/src/**/*.{ts,tsx,js}"]
};
