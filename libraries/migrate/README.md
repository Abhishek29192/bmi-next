# Migrate

This package uses the [`contentful-migration`](https://github.com/contentful/contentful-migration) lib to create content types and migrations with code.

## Setup

Create an `.env.*` file for your environment and enter the appropriate Contentful values.

### Initialise

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the current state of each managed content type.

```bash
yarn migrate init
```

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

## Testing changes

_Only test against your own space._

After creating the relevant scripts, make sure that you run them as an incremental change ontop of the latest set of scripts (so when it is run against the real environments, we know it will work reliably) and against a completely cleared down environment (so we know it will work reliably against a brand new environment).
