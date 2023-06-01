import type { MigrationFunction } from "contentful-migration";

export const description = "Add SEO meta content";

export const up: MigrationFunction = (migration) => {
  migration
    .editContentType("teamPage")
    .createField("seo")
    .name("SEO")
    .type("Link")
    .validations([{ linkContentType: ["seoContent"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  migration.editContentType("teamPage").deleteField("seo");
};
