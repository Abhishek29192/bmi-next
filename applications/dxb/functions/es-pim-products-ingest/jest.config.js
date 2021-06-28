"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/es-pim-products-ingest/src"],
  coverageThreshold: {
    global: {
      statements: "98",
      branches: "86",
      functions: "98",
      lines: "97"
    }
  }
};
