# BMI-DXB

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Monorepo for BMI-DXB website that includes a component library and an API gateway.

## Getting Started

### Prerequities

| Dependency | Version    |
| ---------- | ---------- |
| Node       | >= 10 < 15 |
| Git        | >= 2.18    |
| Yarn       | >= 1.20    |
|            |            |

#### **.npmrc**

Add NPM_TOKEN to .npmrc file.

You can generate one of these from your NPM account at [`https://www.npmjs.com/settings/<username>/tokens`](https://www.npmjs.com/settings/<username>/tokens) .

```
//registry.npmjs.org/:_authToken=<NPM_TOKEN>
```

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

### Setup your own Contentful account and space for local development

Create a free Contentful account and create a space and a blank environment. This will act as your local development v environment so that you don't need to make changes or run your migration directly on DXB Contentful account.

Run the following command to clone content types and content from DXB `development` environment to your own account.

`yarn global add contentful-cli`

`contentful space export --space-id <DXB SPACE ID> --environment-id development --mt <DXB MANAGEMENT TOKEN> --include-drafts --skip-roles --skip-webhooks --content-file dump.json`

`contentful space import --space-id <YOUR OWN ACC SPACE ID> --environment-id <YOUR ACC ENVIRONMENT> --mt <YOUR OWN ACC MANAGEMENT TOKEN> --content-file dump.json`

Depending on how clean the content in dxb `development` environment, you might get some warning and error messages for unresolved resources but they wouldn't stop the whole cloning process and you will still get the rest of the data in your account.

Now you will have a clone of both content types and content from DXB development environment in your own account.
When you run your newly written migration script, now you can run them in this environment for testing.

Note that in .env.\* in `libraries/migrate` you should always put `<YOUR OWN ACC SPACE ID>` and `<YOUR OWN ACC MANAGEMENT TOKEN>` instead of the DXB one otherwise you are running migration directly on DXB contentful account!

You should also put `<YOUR OWN ACC SPACE ID>` and `<YOUR OWN ACC MANAGEMENT TOKEN>` in .env.\* in `applications/head` to use content and content type from your own account.

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

### Release

We use [Semantic Release](https://github.com/semantic-release/semantic-release) to automatically generate our release notes (that's why it's so important to follow the [commit guidelines!](#Commit messages)).
The process runs automatically for the `production`, `pre-production` and `master` (alpha) branches, using GitLab's CI pipelines.

## Assets

SVGs have their `viewBox` set correctly and the `width`s set to `auto` in order to allow for [better scaling](https://css-tricks.com/scale-svg/#option-3-use-inline-svg-and-the-latest-blink-firefox-browsers).

## Migrations

To run all the latest migrations.

```shell
yarn migrate up -a
```

Pass `-d` to execute a dry run.

For more commands see the full documentation under [migrate](libraries/migrate/README.md)

## Functions

`/functions` folder contains packages which are individual Google Cloud Platform functions.
Each function should have a `dev` script which can be used to serve it on localhost using `functions-framework`.
This addmitedly makes sense for HTTP triggered functions, but it will host event triggered functions just the same, however locally the message (which should be the body of the request) is available in `context.message` rather than `event`.

Each function should also have a `deploy` script, which can be used to, you guessed it, deploy the function into Google Cloud Platform.
This requires gcloud to be configured on your machine.

https://cloud.google.com/sdk/docs/install

After installing you will need to setup using:

```shell
$ gcloud init
```

For which you will likely need the project name from GCP.

## Netlify

This project gets built using Netlify and it uses different configurations depending on the workspace.

The root configuration builds the workbench. Which means that if no `base directory` gets specified, Netlify will build styleguidist.

Builds happen on:

- `git` pushes (including tags)
- Contentful manual triggers
- Firestore pushes

When `head` gets build, extra checks (i.e. what hook is triggering the build, what tag is used, etc) are run using the `@bmi/build-contentful` package.

### Run Netlify locally

You can run [Netlify locally](https://www.netlify.com/products/dev/) using the configuration of any site associated to your account.

Install Netlify CLI locally

```shell
$ npm install netlify-cli -g
```

Then login to your account and then initialise the site.

```shell
# This will prompt the Netlify webiste, and then ask for linking a specific site.
$ netlify link
```

**Select an existing netlify site using the current git remote origin (https://gitlab.com/bmi-digital/dxb).**

Netlify will keep site information in the `.netlify` folder (git ignored).

#### Build and deploy locally

If you need to, you can build using the `netlify build` command and then deploy it.
This will use local env file and the environment variables and settings from the netlify site (including `base directory`!).

```shell
$ netlify build
```

After that's completed, you can access it locally or remotely using the `netlify dev` command.

```shell
# Local
$ netlify dev

# Remote
$ netlify dev --live
```

Once you're happy with the changes, you can

```shell
$ netlify deploy
```

Which will generate a preview link. To then promote it to production, run:

```shell
$ netlify deploy --prod
```

### Netlify Functions

#### Create function

To create a new function, run the below command. To be triggered by [specific events](https://docs.netlify.com/functions/trigger-on-events), the function needs to be named after the event.

```bash
cd path/to/functions
netlify functions:create --name [function name]
```

#### Run locally

```bash
netlify dev # to start the dev server to host the function
netlify functions:invoke --functions [path/to/functions] [function name] --payload '{}'
```
