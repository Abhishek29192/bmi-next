"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/breadcrumbs/src"],
  collectCoverageFrom: ["<rootDir>/components/breadcrumbs/src/**/*.{ts,tsx,js}"]
};
