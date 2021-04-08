"use strict";

module.exports = {
  rules: {
    strict: ["off"],
    "no-unused-vars": ["off"]
  },
  globals: {
    auth0: "readonly",
    configuration: "readonly",
    UnauthorizedError: "readonly"
  }
};
