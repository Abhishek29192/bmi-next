"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/contentful-default-values/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/contentful-default-values/src/**/*.{ts,tsx,js}"
  ]
};
