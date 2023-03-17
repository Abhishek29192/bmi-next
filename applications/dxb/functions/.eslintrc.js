"use strict";

module.exports = {
  extends: "../../../.eslintrc.js",
  env: {
    node: true
  },
  rules: {
    "testing-library/no-await-sync-query": "off"
  }
};
