"use strict";

module.exports = {
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js}",
    "!**/node_modules/**",
    "!*.config.js",
    "!.*.js",
    "!**/.*.js",
    "!coverage/**",
    "!jest/**",
    "!tmp/**"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>components"],
  testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
  moduleNameMapper: {
    "\\.module\\.s?css$": require.resolve("identity-obj-proxy"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS")
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
