"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/scripts/contentful-roles/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/scripts/contentful-roles/src/**/*.{ts,tsx,js}"
  ]
};
