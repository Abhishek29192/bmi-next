"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/functions/es-pim-products-ingest/src"],
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: "98",
      branches: "85",
      lines: "98"
    }
  }
};
