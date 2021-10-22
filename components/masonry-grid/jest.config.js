"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/masonry-grid/src"],
  collectCoverageFrom: [
    "<rootDir>/components/masonry-grid/src/**/*.{ts,tsx,js}"
  ]
};
