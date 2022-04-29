"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/intouch/functions/gcp-cron-rm-unverified-users/src"
  ],
  setupFiles: [],
  setupFilesAfterEnv: []
};
