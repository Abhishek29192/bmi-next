# Migrate

This package uses the [`contentful-migrate`](https://github.com/deluan/contentful-migrate) lib to create content types and migrations with code. All commands run through the `start` script, which is also aliased to `migrate` in the root of the monorepo.

## Setup

Create an `.env.*` file for your environment and enter the appropriate Contentful values.

### Initialise

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the current state of each managed content type.

```bash
yarn migrate init
```

The above command can also be ran with `yarn workspace @bmi/migrate start init`.

### Bootstrap

~~This command creates your migration files for content models already in your space. It gives you the option to squash any previous migration state.~~

We have bootstrapped the contentful already so please DO NOT run it again unless you test on your own contentful account. Running bootstrap again on production account will wipe out all the migration records!

```bash
yarn migrate bootstrap -a -e <contentful environment>
```

_Note: It will delete any existing migration scripts and create a consolidated one for each specified content type._

## Commands

### List

```bash
yarn migrate list -a -e <contentful environment>
```

### Create migration script template

```bash
yarn migrate create <migration file name> -c <content type>
```

### Up

Run latest migrations that have not been updated

```bash
yarn migrate up -a
```

Run a specific file

```bash
yarn migrate up create-new-type -c newType
```
