#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const wsName = process.argv[2];
const componentsDir = process.cwd() + "/components";

if (!wsName) {
  console.error("Please provide a name for the component folder.");
  process.exit(1);
}

if (!wsName.match(/[a-z-]/)) {
  console.error(
    "The component folder name should only contain lowercase letters and hyphens."
  );
  process.exit(1);
}
const componentName = wsName
  .split("-")
  .map((str) => str[0].toUpperCase() + str.slice(1))
  .join("");

const componentPath = componentsDir + "/" + wsName;

if (fs.existsSync(componentPath)) {
  console.error("This component folder already exists");
  process.exit(1);
}

const indexContent = `import ${componentName} from "./${componentName}";

export default ${componentName};`;

const packageContent = `{
  "name": "@bmi/${wsName}",
  "private": true,
  "version": "0.0.0",
  "dependencies": {
    "@material-ui/core": "^4.10.1",
    "react": "^16.13.1"
  },
  "devDependencies": {
    "@types/material-ui": "^0.21.7"
  }
}
`;

const tsconfigContent = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist"
  }
}
`;

const componentContent = `import React from "react";

const ${componentName} = () => {
  return null;
};

export default ${componentName};
`;

const testContent = `import React from "react";
import ${componentName} from "../";
import { render } from "@testing-library/react";

describe("${componentName} component", () => {
  it("renders correctly", () => {
    const { container } = render(<${componentName} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
`;

const readmeContent = `This component wraps the Material-UI button component

## Default

\`\`\`jsx
<Button variant="contained">contained</Button>
\`\`\`
`;

const handleError = (err) => {
  console.log("handling");
  if (err) {
    throw new Error(err);
  }
};

fs.mkdirSync(
  `${componentPath}/src/__tests__`,
  { recursive: true },
  handleError
);

Promise.all([
  writeFile(`${componentPath}/package.json`, packageContent, handleError),
  writeFile(`${componentPath}/tsconfig.json`, tsconfigContent, handleError),
  writeFile(`${componentPath}/src/index.ts`, indexContent, handleError),
  writeFile(
    `${componentPath}/src/__tests__/${componentName}.test.tsx`,
    testContent,
    handleError
  ),
  writeFile(
    `${componentPath}/src/${componentName}.tsx`,
    componentContent,
    handleError
  ),
  writeFile(`${componentPath}/README.md`, readmeContent, handleError)
]).then(() =>
  console.log(
    `All files have been created in "./components/${wsName}". Remember to run "yarn" to install dependencies.`
  )
);
