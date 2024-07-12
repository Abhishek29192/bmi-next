import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add display name to Account Links Contentful entries";

export const up: MigrationFunction = async (migration) => {
  const accountLink = migration.editContentType("accountLink");

  accountLink.displayField("name").description("").name("Account Link");
};

export const down: MigrationFunction = async (migration) => {
  const accountLink = migration.editContentType("accountLink");

  accountLink.name("Account Link");
};
