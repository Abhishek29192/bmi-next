# BMI-DXB

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Monorepo for BMI-DXB website that includes a component library and an API gateway.

## Getting Started

### Prerequities

| Dependency | Version |
| ---------- | ------- |
| Node       | >= 10   |
| Git        | >= 2.18 |
| Yarn       | >= 1.20 |

### Install

Clone the repo and run the following commands at the root of the project.

```shell
$ yarn install
```

### Work with Workspaces

This project uses yarn workspaces, to see a full list of commands, please refer to [workspace](https://classic.yarnpkg.com/en/docs/cli/workspace) and [workspaces](https://classic.yarnpkg.com/en/docs/cli/workspaces) commands documentation.

Dependencies should be installed for individual workspace using [yarn](https://yarnpkg.com/) commands at the root of the monorepo, e.g.

```shell
$ yarn workspace @bmi/button add react
```

Development dependencies should be instead installed at root level, e.g.

```shell
$ yarn add --dev -W jest
```

You can also install inter-dependencies between the monorepo packages, e.g.

```shell
$ yarn workspace @bmi/button add @bmi/icon@0.0.0
```

### Website

We use [Gatsby](https://www.gatsbyjs.org/) to generate static website and it's data comes from the `gatsby-source-contentful` plugin.

#### Configuration

Before running the website (`applications/head`), make sure you copy the `.env.example` file to `.env.development` (based on the `NODE_ENV`).

Comment out the first set of variables: `COUNTRY_CODE`, `SPACE_ID`, and `ACCESS_TOKEN`.

You can find the `SPACE_ID_n` and `ACCESS_TOKEN_n` values in Contentful API keys section.
`COUNTRY_CODE` is the locale code e.g. `en_US`.

#### Run Gatsby

To run develop

```shell
$ yarn dev
```

To build the production ready website

```shell
$ yarn start
```

### Workbench

We are using [React Stylesguidist](https://github.com/SaraVieira/react-styleguidist) to generate the workbench to build UI components quickly.

To install React Styleguidist

```shell
$ yarn workbench
```

### Creating a new component

To create a new component package, use a lowercase hyphenated name and run:

```shell
$ yarn create-component [component-name]
```

### Apollo Server

First follow the instructions on [Confluence](https://bmigroup.atlassian.net/wiki/spaces/BMIP/pages/839582011/3.3.2.3+Web+service+OCC+V2+API) to get an access token. Copy `applications/apollo-server/.env.example` to `applications/apollo-server/.env` and replace the access token.

To start the Apollo server, run:

```shell
$ yarn run-apollo
```

It will be run an express app on port `4000`.

_See more information in the [Apollo section](./applications/apollo-server/README.md)._

## Contributing

### Commit messages

The commit message must follow the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines). These guidelines are enforced by a git hook using [Husky](https://github.com/typicode/husky).

### Git Workflow

- feature branch for individual code contributions

- `master` represents the current development environment

- release candidates(rc) tags for Q/A releases

- Tagged releases represents the current stable version

### Testing

Testing will include Automated tests, manual testing and content-types testing.

End-2-End testing will cover a miniumum of 80% across the codebase.

#### Jest

Each component will have its own test file within the `__tests__` folder and with the `.test.tsx` suffix. To run the test, run this command in the root of the project:

```shell
yarn test
```

When creating tests use `it()` blocks with the name of the code and its code. Wrap in a `describe` block for grouping and use the `expect()` global function for making assertions.

The message within the `it()` should start with an imperative mood verb (e.g. "renders correctly", "triggers an onClick event", etc).

To test our components, we use [@testing-library/react](https://github.com/testing-library/react-testing-library), please refer to their documentation.

An example of a test

```tsx
import React from "react";
import Button from "../";
import { render } from "@testing-library/react";

describe("Button component", () => {
  it("renders correctly", () => {
    const { container } = render(<Button label={"Hello World"} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

#### Linting

This project uses [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to perform static checks on all the code.

### TypeScript

We use [TypeScript](https://www.typescriptlang.org/) to simplify JavaScript allowing to be read and to debug easier.

We use [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) repository that holds declaration files (\*.d.ts).

To add your own custom type follow these [steps](https://github.com/DefinitelyTyped/DefinitelyTyped#how-can-i-contribute) and make a pull request in DefinitelyTyped, adding a `@types` folder where needed.

### Code Editor

Our preference is VSCode and there are a couple of settings to support it.
On top of that, this repo also sets some linting rule using `.editorconfig`.

#### VSCode Recommended extensions

We recommend some extensions that will help your coding experience. To view them, filter extensions by `@recommended`.

### git hooks

To ensure that no broken or unformatted code gets committed or pushed, we use git hooks, via [husky](https://github.com/typicode/husky)

- `pre-message` will check commit message has followed the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) conventions

- `pre-commit` will run linting and formatting

- `pre-push` will run automated tests

## Assets

SVGs have their `viewBox` set correctly and the `width`s set to `auto` in order to allow for [better scaling](https://css-tricks.com/scale-svg/#option-3-use-inline-svg-and-the-latest-blink-firefox-browsers).
