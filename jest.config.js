"use strict";

module.exports = {
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "text-summary", "cobertura"],
  coveragePathIgnorePatterns: [
    "node_modules/",
    "coverage/",
    "coverage-ts/",
    "dxb/migrations",
    "gatsby-config.js",
    "gatsby-node.js"
  ],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js}",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/*.config.js",
    "!.*.js",
    "!**/.*.js",
    "!coverage/**",
    "!jest/**",
    "!libraries/fetch-mocks/**",
    "!tmp/**",
    "!**/.cache/**"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: [
    "<rootDir>/components",
    "<rootDir>/applications",
    "<rootDir>/functions",
    "<rootDir>/libraries"
  ],
  testMatch: ["**/__tests__/**/*.+(test).(ts|tsx|js)"],
  testPathIgnorePatterns: ["node_modules", "dist"],
  moduleNameMapper: {
    "\\.(jpg|png)$": require.resolve("./jest/src/ImageImport.ts"),
    "\\.module\\.s?css$": require.resolve("./jest/src/CSSModuleImport.ts"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS.ts"),
    "\\.svg$": require.resolve("./jest/src/SVGImport.tsx"),
    "\\.(woff2|ttf)$": require.resolve("./jest/src/FontImport.ts"),
    "^@bmi/(?!styles)(.*)$": "<rootDir>/node_modules/@bmi/$1/src",
    "^@bmi/styles$": require.resolve("./jest/src/CSSModuleImport.ts")
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: ["node_modules/(?!(three)/)"],
  setupFiles: [
    "<rootDir>/jest/src/setEnvVars.ts",
    "<rootDir>/jest/src/setupTests.ts"
  ],
  setupFilesAfterEnv: ["jest-mock-console/dist/setupTestFramework.js"],
  coverageThreshold: {
    global: {
      statements: "100",
      branches: "100",
      functions: "100",
      lines: "100"
    }
  }
};
