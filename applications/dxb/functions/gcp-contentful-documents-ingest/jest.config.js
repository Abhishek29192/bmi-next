"use strict";

const sharedConfig = require("../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/dxb/functions/gcp-contentful-documents-ingest/src"
  ],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/functions/gcp-contentful-documents-ingest/src/**/*.{ts,tsx,js}"
  ]
};
