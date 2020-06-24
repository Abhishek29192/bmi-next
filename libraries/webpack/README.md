Package that exports sharable webpack configurations.
To used them you can import the configuration and the exported utlilty `withConfigs(webpackConfig, listOfConfigs)`

Every exports an Object:

```ts
interface CustomConfiguration {
  plugins: Plugin;
  rules: ReadonlyArray<RuleSetRule>;
}
```
