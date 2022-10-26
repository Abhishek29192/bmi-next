import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for redirects";

export const up: MigrationFunction = (migration: Migration) => {
  const redirect = migration
    .createContentType("redirect")
    .name("Redirect")
    .displayField("from")
    .description("");

  redirect
    .createField("from")
    .name("From")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  redirect.createField("to").name("To").type("Symbol").required(true);

  redirect
    .createField("isPermanent")
    .name("Is permanent")
    .type("Boolean")
    .required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("redirect");
};
