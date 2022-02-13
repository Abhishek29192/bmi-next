"use strict";

const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/components/response-message/src"],
  collectCoverageFrom: [
    "<rootDir>/components/response-message/src/**/*.{ts,tsx,js}"
  ]
};
