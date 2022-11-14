import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add CTA list";

export const up: MigrationFunction = (migration: Migration) => {
  const mediaTool = migration.editContentType("mediaTool");

  mediaTool
    .createField("cta")
    .name("CTA")
    .type("Symbol")
    .required(false)
    .validations([{ in: ["MERCHANDISE", "NONE"] }]);
  mediaTool.changeFieldControl("cta", "builtin", "radio");
};

export const down: MigrationFunction = (migration: Migration) => {
  const mediaTool = migration.editContentType("mediaTool");
  mediaTool.deleteField("cta");
};
