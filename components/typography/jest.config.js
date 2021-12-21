"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/typography/src"],
  collectCoverageFrom: ["<rootDir>/components/typography/src/**/*.{ts,tsx,js}"]
};
