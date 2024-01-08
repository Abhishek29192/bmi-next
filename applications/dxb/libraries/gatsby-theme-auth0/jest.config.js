const sharedConfig = require("../../../../jest.config");

// eslint-disable-next-line no-unused-vars
const { projects, ...extendedConfig } = sharedConfig;

module.exports = {
  ...extendedConfig,
  rootDir: "../../../../",
  roots: ["<rootDir>/applications/dxb/libraries/gatsby-theme-auth0"],
  collectCoverageFrom: [
    "<rootDir>/applications/dxb/libraries/gatsby-theme-auth0/src/**/*.{ts,tsx,js}"
  ],
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: 28.03,
      branches: 14.28,
      functions: 30.76,
      lines: 28.84
    }
  }
};
