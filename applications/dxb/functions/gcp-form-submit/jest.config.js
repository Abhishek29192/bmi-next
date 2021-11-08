"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-form-submit/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-form-submit/src/**/*.{ts,tsx,js}"
  ]
};
