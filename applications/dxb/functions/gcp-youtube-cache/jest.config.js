"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-youtube-cache/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-youtube-cache/src/**/*.{ts,tsx,js}"
  ]
};
