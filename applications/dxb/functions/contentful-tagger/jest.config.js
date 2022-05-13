"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/contentful-tagger/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/contentful-tagger/src/**/*.{ts,tsx,js}"
  ]
};
