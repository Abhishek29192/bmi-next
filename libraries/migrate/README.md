# Migrate

This package uses the [`contentful-migrate`](https://github.com/deluan/contentful-migrate) lib to create content types and migrations with code.

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

_N.B. DXB only has the `contentType` of `scripts`_

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

_N.B. DXB only has the `contentType` of `scripts`_

#### Down

Roll back a migration

```bash
yarn migrate down <filename> <options>
```

_N.B. DXB only has the `contentType` of `scripts`_

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

To be able to test the changes for some of our projects requires a P1X space environment as a community space environment will not be sufficient for number of content types that are used. Therefore, the process to test the scripts is:

1. Create a new environment in the non-market specific space
1. Test the script changes against this new environment
   1. Make sure that the changes are run as an incremental change ontop of the latest set of scripts (so when it is run against the real environments, we know it will work reliably)
   1. Make sure that the changes are run against a completely cleared down environment (so we know it will work reliably against a brand new environment).
1. Delete the environment
   1. A P1X space has a limited number of spaces, so to allow other devs to be able to complete their own work, cleanup is required

### Install Contentful CLI

```bash
yarn global add contentful-cli
```

### Login to Contentful

```bash
contentful login
```

### Create an empty test environment

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment create --space-id $CONTENTFUL_SPACE_ID --name $CONTENTFUL_ENVIRONMENT --environment-id $CONTENTFUL_ENVIRONMENT
```

### Create pre-populted test environment

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment create --space-id $CONTENTFUL_SPACE_ID --name $CONTENTFUL_ENVIRONMENT --environment-id $CONTENTFUL_ENVIRONMENT --source master
```

### Delete test environment in Sandpit space

```bash
CONTENFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=my-test-environment
contenful space environment delete --space-id $CONTENTFUL_SPACE_ID --environment-id $CONTENTFUL_ENVIRONMENT
```
