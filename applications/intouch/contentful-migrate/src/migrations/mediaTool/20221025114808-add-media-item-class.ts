import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add media item class field to media tool";

export const up: MigrationFunction = (migration: Migration) => {
  const mediaTool = migration.editContentType("mediaTool");

  mediaTool
    .createField("mediaItemClass")
    .name("Item Class")
    .type("Symbol")
    .required(false);

  mediaTool.changeFieldControl("mediaItemClass", "builtin", "singleLine", {
    helpText: "optanon-category-C0001 or optanon-category-C0007-0006-0005"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const mediaTool = migration.editContentType("mediaTool");

  mediaTool.deleteField("mediaItemClass");
};
