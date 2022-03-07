"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-plugin-firestore"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-firestore/**/*.{ts,tsx,js}",
    "!**/jest.config.js"
  ]
};
