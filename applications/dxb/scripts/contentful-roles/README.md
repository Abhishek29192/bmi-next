# Create and update roles for contentful space scripts

These functions trigger contentful requests to create and update roles permissions for role types that defined in configuration file.

## Testing

### Common configurations

provide CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID to .env file

provide a list of markets for the space in contentful

```js
// configurations.ts

export const getMarketsToRun = () => [
  { name: "uk", locales: ["en-GB"] },
  { name: "finland", locales: ["fi-FI"] }
];
```

provide list of role types for the space (for now we have two roles: publisher and editor)

```js
// configurations.ts

export const roles: RolesEnum[] = [RolesEnum.publisher, RolesEnum.editor];
```

### Create role configurations

to test create roles functionality for space:

provide configuration of permissions for all role types in

```js
// configurations.ts

export const getCreateRolesRequestBody = () => {...}
```

and run

```shell
$ yarn create-roles
```

### Update role configurations

to test update roles functionality for space:

provide configuration of permissions for all role types in

```js
// configurations.ts

export const getUpdateRolesRequestBody = () => {...}
```

and run

```shell
$ yarn update-roles
```
