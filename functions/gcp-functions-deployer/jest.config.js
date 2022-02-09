"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../",
  roots: ["<rootDir>/functions/gcp-functions-deployer/src"],
  collectCoverageFrom: [
    "<rootDir>/functions/gcp-functions-deployer/src/**/*.{ts,tsx,js}"
  ]
};
