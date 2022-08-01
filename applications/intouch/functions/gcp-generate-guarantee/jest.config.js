"use strict";

const sharedConfig = require("../../../../jest.config");

module.exports = {
  ...sharedConfig,
  rootDir: "../../../../",
  roots: [
    "<rootDir>/applications/intouch/functions/gcp-generate-guarantee/src"
  ],
  setupFiles: [],
  setupFilesAfterEnv: []
};
