# DXB Contentful Migrate

## Setup

Copy the `.env.example` file to `.env` and enter the appropriate values.

### Environment variables

| Variable name                        | Description                                                                                                                                                                            | Possible values                           | Default value |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------- |
| CONTENTFUL_ENVIRONMENT               | The alias \_                                                                                                                                                                           |                                           |               |
| or\_ environment name to be updated. | String name of the existing alias or environment                                                                                                                                       | `undefined`                               |               |
| DELETE_OLD_ENVIRONMENTS              | Whether to delete the old environments.                                                                                                                                                | `true` or `false`                         | `false`       |
| MANAGEMENT_ACCESS_TOKEN              | The access token for the Contentful Management API.                                                                                                                                    | String of the access token                | `undefined`   |
| MIGRATION_DRY_RUN                    | Whether this should be a dry run.                                                                                                                                                      | `true` or `false`                         | `false`       |
| NEW_ENVIRONMENT_NAME                 | The name of the new environment to create and have the alias point to. Only if this is set will it clone an existing environment. If this is set, then the `CONTENTFUL_ENVIRONMENT` \_ |                                           |               |
| must\_ be an alias.                  | String name of the environment to create                                                                                                                                               | `undefined`                               |               |
| SPACE_ID                             | The ID of the Contentful Space.                                                                                                                                                        | String of the ID for the Contentful space | `undefined`   |

## Build the scripts

As our scripts are written in TypeScript, they need to be built before they can be run.

```bash
yarn workspace @bmi/dxb-contentful-migrate build
```

## Initialise environment

The `init` command creates the content type `Migration` in your Contentful space. This will be used to keep track of the
current state of each managed content type.

_N.B. This is only needed for empty spaces, not for spaces that have already been initialized._

```bash
yarn workspace @bmi/dxb-contentful-migrate run ctf-migrate init
```

## Create migration script template

```bash
yarn workspace @bmi/dxb-contentful-migrate migrateCreate <migration-file-name-without-timestamp>
```

## Run migration scripts

If the `NEW_ENVIRONMENT_NAME` environment variable is provided, this will clone the environment
the `CONTENTFUL_ENVIRONMENT` environment variable is pointing to and call the new environment as `NEW_ENVIRONMENT_NAME`.
If the `DELETE_OLD_ENVIRONMENTS` environment variable is set, then all non-major version named environments will be
deleted and all major version named environments that are greater than the previous version _and_ that do _not_ have an
alias pointing to it.

```bash
yarn workspace @bmi/dxb-contentful-migrate prod
```

## Run migration scripts in debug mode

This is the same as `prod` but with the `--inspect` flag set.

```bash
yarn workspace @bmi/dxb-contentful-migrate debug
```

## Migrate up

This simply runs the up functions for the migration scripts.

```bash
yarn workspace @bmi/dxb-contentful-migrate up
```

## Migrate down

This simply runs the down functions for the migration scripts.

```bash
yarn workspace @bmi/dxb-contentful-migrate down <filename-to-run-down-to>
```

## Create roles

Custom roles with permissions can be added to a Contentful space by running the following script.

```bash
yarn createRoles
```

The only way to migrate users is via the Content Management API (
read [here](https://www.contentfulcommunity.com/t/migration-of-custom-roles-and-users-from-one-space-to-other/789)).

The custom roles with permissions need to be specified in a JSON file, at the following
path: `{PROJECT_RELATIVE_PATH}/roles.json`.

[This documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/roles)
shows some of the accepted key value pairs for roles & permissions.
