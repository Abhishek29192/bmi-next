"use strict";

module.exports = {
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "text-summary"],
  coveragePathIgnorePatterns: ["node_modules/", "coverage/", "coverage-ts/"],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js}",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/*.config.js",
    "!.*.js",
    "!**/.*.js",
    "!libraries/visualiser-library/src/Visualiser/Functions/(ThreeJs|ThreeJsUtils)/**",
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
    "<rootDir>/functions"
  ],
  testMatch: ["**/__tests__/*.+(test).(ts|tsx|js)"],
  testPathIgnorePatterns: ["node_modules", "dist"],
  moduleNameMapper: {
    "\\.(jpg|png)$": require.resolve("./jest/src/ImageImport.ts"),
    "\\.module\\.s?css$": require.resolve("./jest/src/CSSModuleImport.ts"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS.ts"),
    "\\.svg$": require.resolve("./jest/src/SVGImport.tsx"),
    "\\.(woff2|ttf)$": require.resolve("./jest/src/FontImport.ts"),
    "^@bmi/(?!styles)(.*)$": "<rootDir>/node_modules/@bmi/$1/src",
    "^@bmi/styles$": require.resolve("./jest/src/CSSModuleImport.ts"),
    "react-pdf-maker": "<rootDir>/node_modules/react-pdf-maker/src"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
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
