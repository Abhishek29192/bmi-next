import { Configuration, RuleSetRule, Plugin } from "webpack";

interface CustomConfiguration {
  plugins: Plugin;
  rules: ReadonlyArray<RuleSetRule>;
}

export function withConfigs(
  originalWebpackConfig: Configuration,
  configurations: ReadonlyArray<CustomConfiguration>
): void;
