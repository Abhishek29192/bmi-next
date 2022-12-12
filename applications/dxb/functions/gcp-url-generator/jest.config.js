"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/gcp-url-generator/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-firestore-writer/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node"
};
