import type { MigrationFunction } from "contentful-migration";

export const description = "Made the page protection to be optional";

export const up: MigrationFunction = async (migration) => {
  const page = migration.editContentType("page");

  page.editField("isSimplePageProtected").required(false);
};

export const down: MigrationFunction = async (migration) => {
  const page = migration.editContentType("page");
  page.editField("isSimplePageProtected").required(true);
};
