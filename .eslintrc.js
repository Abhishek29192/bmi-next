"use strict";

module.exports = {
  extends: ["@bmi-digital/eslint-config"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "@types/**",
    "coverage/**",
    "coverage-ts/**",
    "**/public/**",
    ".yarn/**",
    ".yarn_cache"
  ],
  rules: {
    "import/extensions": [0, "never"]
  }
};
