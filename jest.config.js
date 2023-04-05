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
  projects: ["./applications/**/jest.config.js"],
  testMatch: ["**/__tests__/**/*.+(test).(ts|tsx|js)"],
  testPathIgnorePatterns: ["node_modules", "dist"],
  moduleNameMapper: {
    "\\.(jpg|png)$": require.resolve("./jest/src/ImageImport.ts"),
    "\\.module\\.s?css$": require.resolve("./jest/src/CSSModuleImport.ts"),
    "(?<!\\.module)\\.s?css$": require.resolve("./jest/src/GlobalCSS.ts"),
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.svg$": require.resolve("./jest/src/SVGImport.tsx"),
    "\\.(woff2|ttf)$": require.resolve("./jest/src/FontImport.ts"),
    "^@bmi/(?!visualiser/data)(.*)$": "<rootDir>/node_modules/@bmi/$1/src",
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
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(three|lodash-es|escape-string-regexp|@bmi-digital/components)/)"
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
