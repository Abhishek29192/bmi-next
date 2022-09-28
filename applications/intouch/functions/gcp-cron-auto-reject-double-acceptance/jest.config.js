"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/intouch/functions/gcp-cron-auto-reject-double-acceptance/src"
  ],
  setupFiles: [],
  setupFilesAfterEnv: []
};
