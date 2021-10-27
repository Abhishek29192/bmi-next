"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/libraries/netlify-plugin-filter-tag-event"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/netlify-plugin-filter-tag-event/**/*.{ts,tsx,js}",
    "!**/*.config.js"
  ]
};
