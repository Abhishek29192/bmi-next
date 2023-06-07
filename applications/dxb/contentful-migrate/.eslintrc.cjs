"use strict";

module.exports = {
  extends: ["../../../.eslintrc.js"],
  overrides: [
    {
      files: ["**/migrations/**/*.{js,ts}"],
      rules: {
        "security/detect-object-injection": "off",
        "security/detect-non-literal-fs-filename": "off"
      }
    }
  ],
  parserOptions: {
    tsconfigRootDir: __dirname
  }
};
