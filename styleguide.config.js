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
  components: "./components/**/src/[A-Z]*.tsx",
  styleguideComponents: {
    Wrapper: path.join(__dirname, "components/theme-provider/src")
  },
  getComponentPathLine: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");
    const parts = componentPath.replace("components/", "").split("/");
    const importPath = `"@bmi/${parts[0].toLowerCase()}/${parts
      .slice(1)
      .join("/")}"`;

    // NOTE: this is displayed under the component name
    return `import ${componentName} from ${importPath};`;
  },
  getExampleFilename: (componentPath) => {
    const componentName = path.basename(componentPath, ".tsx");
    const specificComponentExampleFile = path
      .join(componentPath, `../../${componentName}.md`)
      .replace();

    if (fs.existsSync(specificComponentExampleFile)) {
      return specificComponentExampleFile;
    }

    const exampleFile = path.join(componentPath, "../../README.md");

    if (fs.existsSync(exampleFile)) {
      return exampleFile;
    }

    return null;
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "ts-loader"
        }
      ]
    }
  }
};
