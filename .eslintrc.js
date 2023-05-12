"use strict";

module.exports = {
  extends: ["@bmi-digital/eslint-config", "plugin:react-hooks/recommended"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
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
