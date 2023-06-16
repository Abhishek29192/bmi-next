"use strict";

module.exports = {
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "text-summary", "cobertura"],
  coveragePathIgnorePatterns: ["node_modules/", "coverage/", "__tests__/"],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js}",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/*.config.js",
    "!.*.js",
    "!**/.*.js",
    "!coverage/**",
    "!jest/**",
    "!tmp/**",
    "!**/.cache/**",
    "!**/dist/**"
  ],
  preset: "ts-jest",
  projects: [
    "./applications/**/jest.config.js",
    "./applications/**/jest.config.cjs"
  ],
  testMatch: ["**/__tests__/**/*.+(test).(ts|tsx|js)"],
  testPathIgnorePatterns: ["node_modules", "dist"],
  moduleNameMapper: {
    "\\.(jpg|png)$": require.resolve("./jest/src/ImageImport.ts"),
    "\\.module\\.s?css$": require.resolve("./jest/src/CSSModuleImport.ts"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS.ts"),
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.svg$": require.resolve("./jest/src/SVGImport.tsx"),
    "\\.(woff2|ttf)$": require.resolve("./jest/src/FontImport.ts"),
    "^gatsby-page-utils/(.*)$":
      "<rootDir>/node_modules/gatsby-page-utils/dist/$1" // Workaround for https://github.com/facebook/jest/issues/9771
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        isolatedModules: true
      }
    ],
    "^.+\\.(js|jsx|mjs)$": "babel-jest"
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${[
      "three",
      "lodash-es",
      "escape-string-regexp",
      "@bmi-digital/components",
      "ora",
      // Dependencies of ora start
      "chalk",
      "cli-cursor",
      "restore-cursor",
      "log-symbols",
      "is-unicode-supported",
      "strip-ansi",
      "ansi-regex",
      "is-interactive",
      "stdin-discarder",
      // Dependencies of ora end
      "semver-parser",
      "file-type",
      // Dependencies of file-type start
      "strtok3",
      "peek-readable",
      "token-types"
      // Dependencies of file-type end
    ].join("|")})/)`
  ],
  setupFiles: ["<rootDir>/jest/src/setEnvVars.ts"],
  setupFilesAfterEnv: [
    "jest-mock-console/dist/setupTestFramework.js",
    "<rootDir>/jest/src/setupTests.ts"
  ],
  coverageThreshold: {
    global: {
      statements: "100",
      branches: "100",
      functions: "100",
      lines: "100"
    }
  }
};
