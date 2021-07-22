# Migrate

This package uses the [`contentful-migration`](https://github.com/contentful/contentful-migration) lib to create content types and migrations with code.

## Setup

Create an `.env.*` file for your environment and enter the appropriate Contentful values.

### Initialise

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the current state of each managed content type.

```bash
yarn migrate init
```

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
yarn migrate create <migration-file-name> -c <contentType>
```

### Migrate

#### Up

Run latest migrations that have not been updated

```bash
yarn migrate up <options>
```

Run all changes

```bash
yarn migrate up -a
```

Run a specific content type

```bash
yarn migrate up -c contentTypeName
```

#### Down

Roll back a migration

```bash
yarn migrate down <filename> <options>
```

#### Options

|     |                                              |                                                                            |
| --- | -------------------------------------------- | -------------------------------------------------------------------------- |
| -e  | --environment-id <contentful environment id> | id of the environment within the space (defaults to 'master')              |
| -c  | --content-type <content-type>                | one or more content type names to process                                  |
| -a  | --all                                        | processes migrations for all content types                                 |
| -d  | --dry-run                                    | only shows the plan, don't write anything to contentful. defaults to false |

### Create roles

Custom roles with permissions can be added to a Contentful space by running the following script.

```bash
yarn createRoles
```

The only way to migrate users is via the Content Management API (read [here](https://www.contentfulcommunity.com/t/migration-of-custom-roles-and-users-from-one-space-to-other/789)).

The custom roles with permissions need to be specified in a JSON file, at the following path: `{PROJECT_RELATIVE_PATH}/roles.json`.

[This documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/roles) shows some of the accepted key value pairs for roles & permissions.

### Mock Data

#### Upload

In case you want to upload some mock data (content + assets) from your local machine into Contentful, you can run

```bash
yarn content-upload
```

Make sure you have set up the environment variables into `.env.development`.

#### Download

To download assets and content from Contentful into your local repo, you can run this command.

```bash
yarn content-download
```

Make sure you have set up the environment variables into `.env.development`.
