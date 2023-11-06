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
  coverageThreshold: {
    global: {
      ...sharedConfig.coverageThreshold.global,
      statements: 10.0,
      branches: 3.0,
      functions: 10.0,
      lines: 10.0
    }
  }
};
