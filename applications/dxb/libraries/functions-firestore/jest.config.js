"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/functions-firestore/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/functions-firestore/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "node",
  resolver: "jest-node-exports-resolver"
};
