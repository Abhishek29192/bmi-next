import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add tag field link to content type";

export const up: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("tag");
};
