# Contributing

## Workspaces

This project uses yarn workspaces, to see a full list of commands, please refer
to [workspace](https://classic.yarnpkg.com/en/docs/cli/workspace)
and [workspaces](https://classic.yarnpkg.com/en/docs/cli/workspaces) commands documentation.

Dependencies should be installed for individual workspace using [yarn](https://yarnpkg.com/) commands at the root of the
monorepo, e.g.

```shell
$ yarn workspace @bmi-digital/components/button add react
```

Development dependencies should be instead installed at root level, e.g.

```shell
$ yarn add --dev -W jest
```

You can also install inter-dependencies between the monorepo packages, e.g.

```shell
$ yarn workspace @bmi-digital/components/button add @bmi-digital/components/icon@0.0.0
```

## Commit messages

The commit message must follow
the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)
. These guidelines are enforced by a git hook using [Husky](https://github.com/typicode/husky).

## Git Workflow

- feature branch for individual code contributions

- `master` represents the current development environment

- release candidates(rc) tags for Q/A releases

- Tagged releases represents the current stable version

## Testing

Testing will include Automated tests, manual testing and content-types testing.

End-2-End testing will cover a miniumum of 80% across the codebase.

### Jest

Common Jest configuration exists in [jest/src](jest/src).

Each component will have its own test file within the `__tests__` folder and with the `.test.tsx` suffix. To run the
test, run this command in the root of the project:

```shell
yarn coverage:jest
```

When creating tests use `it()` blocks with the name of the code and its code. Wrap in a `describe` block for grouping
and use the `expect()` global function for making assertions.

The message within the `it()` should start with an imperative mood verb (e.g. "renders correctly", "triggers an onClick
event", etc).

To test our components, we use [@testing-library/react](https://github.com/testing-library/react-testing-library),
please refer to their documentation.

An example of a test

```tsx
import React from "react";
import Button from "../";
import {render} from "@testing-library/react";

describe("Button component", () => {
  it("renders correctly", () => {
    const {container} = render(<Button label={"Hello World"}/>);
    expect(container).toMatchSnapshot();
  });
});
```

### Linting

This project uses [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to perform static checks on all the
code.

## TypeScript

We use [TypeScript](https://www.typescriptlang.org/) to simplify JavaScript allowing to be read and to debug easier.

We use [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) repository that holds declaration files (
\*.d.ts).

To add your own custom type follow
these [steps](https://github.com/DefinitelyTyped/DefinitelyTyped#how-can-i-contribute) and make a pull request in
DefinitelyTyped, adding a `@types` folder where needed.

## Code Editor

Our preference is VSCode and there are a couple of settings to support it. On top of that, this repo also sets some
linting rule using `.editorconfig`.

### VSCode Recommended extensions

We recommend some extensions that will help your coding experience. To view them, filter extensions by `@recommended`.

## git hooks

To ensure that no broken or unformatted code gets committed or pushed, we use git hooks,
via [husky](https://github.com/typicode/husky)

- `pre-message` will check commit message has followed
  the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)
  conventions

- `pre-commit` will run linting and formatting

- `pre-push` will run automated tests

## Release

We use [Semantic Release](https://github.com/semantic-release/semantic-release) to automatically generate our release
notes (that's why it's so important to follow the [commit guidelines!](#Commit messages)). The process runs
automatically for the `production`, `pre-production` and `master` (alpha) branches, using GitLab's CI pipelines.

## Assets

SVGs have their `viewBox` set correctly and the `width`s set to `auto` in order to allow
for [better scaling](https://css-tricks.com/scale-svg/#option-3-use-inline-svg-and-the-latest-blink-firefox-browsers).
