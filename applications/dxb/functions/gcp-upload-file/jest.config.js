"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-upload-file/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-upload-file/src/**/*.{ts,tsx,js}"
  ]
};
