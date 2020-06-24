"use strict";

const styles = require("./styles");

/**
 *
 * @param {Configuration} originalWebpackConfig
 * @param {ReadonlyArray<CustomConfiguration>} configurations
 *
 * @returns {Configuration}
 *
 * @see @types/webpack
 */
const withConfigs = (originalWebpackConfig, configurations) =>
  configurations.reduce(
    (webpackConfig, { plugins, rules }) => ({
      ...webpackConfig,
      plugins: (webpackConfig.plugins || []).concat(plugins),
      module: {
        ...webpackConfig.module,
        rules: ((webpackConfig.module || { rules: [] }).rules || []).concat(
          rules
        )
      }
    }),
    originalWebpackConfig
  );

module.exports = {
  withConfigs,
  styles
};
