import type { MigrationFunction } from "contentful-migration";

export const description = "Add tag field link to content type tag";

export const up: MigrationFunction = (migration) => {
  const promo = migration.editContentType("promo");
  promo
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const promo = migration.editContentType("promo");
  promo.deleteField("tag");
};
