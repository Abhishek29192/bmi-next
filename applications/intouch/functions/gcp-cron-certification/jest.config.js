"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/intouch/functions/gcp-cron-certification/src"
  ],
  setupFiles: [],
  setupFilesAfterEnv: [
    "<rootDir>/applications/intouch/functions/gcp-cron-certification/__mocks__/index.ts"
  ]
};
