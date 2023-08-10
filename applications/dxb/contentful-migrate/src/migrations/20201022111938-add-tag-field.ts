import type { MigrationFunction } from "contentful-migration";

export const description = "Add tag field link to content type tag";

export const up: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");
  homePage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");
  homePage.deleteField("tag");
};
