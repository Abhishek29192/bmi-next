"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/cms-consolidation-utility/src"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/cms-consolidation-utility/src/**/*.{ts,tsx,js}"
  ]
};
