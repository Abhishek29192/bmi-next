"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/functions/gcp-pim-full-fetch-coordinator/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-pim-full-fetch-coordinator/src/**/*.{ts,tsx,js}"
  ]
};
