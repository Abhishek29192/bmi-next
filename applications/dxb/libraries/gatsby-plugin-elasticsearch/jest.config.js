"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-plugin-elasticsearch"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-plugin-elasticsearch/**/*.{ts,tsx,js}",
    "!**/jest.config.js"
  ]
};
