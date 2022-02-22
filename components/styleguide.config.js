"use strict";

const path = require("path");
const fs = require("fs");

module.exports = {
  title: "BMI DXB Workbench",
  pagePerSection: true,
  ignore: ["**/__tests__/**", "**/node_modules/**"],
  exampleMode: "expand",
  defaultExample: true,
  skipComponentsWithoutExample: true,
  components: "./src/**/[A-Z]*.tsx",
  styleguideComponents: {
    Wrapper: path.join(__dirname, "./src/theme-provider")
  },
  getComponentPathLine: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");

    // NOTE: this is displayed under the component name
    return `import { ${componentName} } from "@bmi/components";`;
  },
  getExampleFilename: (componentPath) => {
    const specificComponentExampleFile = path
      .join(path.dirname(componentPath), "./README.md")
      .replace();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(specificComponentExampleFile)) {
      return specificComponentExampleFile;
    }

    const exampleFile = path.join(componentPath, "../../README.md");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(exampleFile)) {
      return exampleFile;
    }

    return null;
  },
  propsParser: require("react-docgen-typescript").withCustomConfig(
    "./tsconfig.json"
  ).parse,
  webpackConfig: require("./webpack.config.js")
};
