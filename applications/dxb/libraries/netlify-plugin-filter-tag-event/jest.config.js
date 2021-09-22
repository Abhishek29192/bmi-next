"use strict";

const sharedConfig = require("../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../",
  roots: ["<rootDir>/libraries/netlify-plugin-filter-tag-event"]
};
