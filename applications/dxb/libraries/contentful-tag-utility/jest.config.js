"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/contentful-tag-utility/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/contentful-tag-utility/src/**/*.{ts,tsx,js}"
  ]
};
