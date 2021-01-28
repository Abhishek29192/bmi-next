"use strict";

module.exports = {
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js}",
    "!**/node_modules/**",
    "!**/*.config.js",
    "!.*.js",
    "!**/.*.js",
    "!coverage/**",
    "!jest/**",
    "!tmp/**",
    "!**/.cache/**"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: [
    "<rootDir>/components",
    "<rootDir>/applications/head/src/components",
    "<rootDir>/functions/gcp-upload-file"
  ],
  testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
  moduleNameMapper: {
    "\\.(jpg|png)$": require.resolve("./jest/src/ImageImport.ts"),
    "\\.module\\.s?css$": require.resolve("identity-obj-proxy"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS.ts"),
    "\\.svg$": require.resolve("./jest/src/SVGImport.tsx"),
    "\\.woff2$": require.resolve("./jest/src/FontImport.ts"),
    "^@bmi/(?!styles)(.*)$": "<rootDir>/node_modules/@bmi/$1/src",
    "^@bmi/styles$": require.resolve("./jest/src/CSSModuleImport.ts")
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFiles: ["<rootDir>/jest/src/setEnvVars.ts"],
  setupFilesAfterEnv: ["jest-mock-console/dist/setupTestFramework.js"]
};
