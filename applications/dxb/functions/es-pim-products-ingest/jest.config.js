"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/es-pim-products-ingest/src"],
  coverageThreshold: {
    global: {
      statements: "96",
      branches: "85",
      functions: "98",
      lines: "96"
    }
  }
};
