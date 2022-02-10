"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/media-gallery/src"],
  collectCoverageFrom: [
    "<rootDir>/components/media-gallery/src/**/*.{ts,tsx,js}"
  ]
};
