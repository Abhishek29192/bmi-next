"use strict";

const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-source-firestore"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-source-firestore/**/*.{ts,tsx,js}",
    "!**/jest.config.js",
    "!**/.eslintrc.js"
  ]
};
