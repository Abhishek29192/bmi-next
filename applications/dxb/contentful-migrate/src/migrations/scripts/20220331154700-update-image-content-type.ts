import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Changed required status of image field";

export const up: MigrationFunction = (migration: Migration) => {
  const image = migration.editContentType("image");
  image.editField("image").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const image = migration.editContentType("image");
  image.editField("image").required(false);
};
