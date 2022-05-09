"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gatsby-cloud-build-proxy/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gatsby-cloud-build-proxy/src/**/*.{ts,tsx,js}"
  ]
};
