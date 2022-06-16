import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Resource";

export const up: MigrationFunction = (migration: Migration) => {
  const resource = migration
    .createContentType("resource")
    .name("Resource")
    .displayField("key")
    .description("");

  resource
    .createField("key")
    .name("Key")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  resource.createField("value").name("Value").type("Symbol").required(true);

  resource.changeFieldControl("key", "builtin", "singleLine");
  resource.changeFieldControl("value", "builtin", "singleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("resource");
