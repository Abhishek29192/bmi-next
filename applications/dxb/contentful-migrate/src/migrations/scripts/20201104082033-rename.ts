import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Rename Resource content type";

export const up: MigrationFunction = (migration: Migration) => {
  migration.editContentType("resource", { name: "Micro copy" });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("resource", { name: "Resource " });
};
