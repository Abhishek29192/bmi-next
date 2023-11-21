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
      statements: 19.41,
      branches: 2.5,
      functions: 26.08,
      lines: 20
    }
  }
};
