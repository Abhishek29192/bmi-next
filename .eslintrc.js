"use strict";

module.exports = {
  extends: ["@bmi-digital/eslint-config"],
  overrides: [
    {
      files: ["**/migrate/**/migrations/**/*.js"],
      rules: {
        strict: "off"
      }
    }
  ]
};
