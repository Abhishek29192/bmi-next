"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-pim-full-fetch/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-pim-full-fetch/src/**/*.{ts,tsx,js}"
  ]
};
