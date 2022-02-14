"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/post-it-card/src"],
  collectCoverageFrom: [
    "<rootDir>/components/post-it-card/src/**/*.{ts,tsx,js}"
  ]
};
