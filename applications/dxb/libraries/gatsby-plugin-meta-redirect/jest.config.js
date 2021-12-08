"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-plugin-meta-redirect"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-meta-redirect/**/*.{ts,tsx,js}"
  ]
};
