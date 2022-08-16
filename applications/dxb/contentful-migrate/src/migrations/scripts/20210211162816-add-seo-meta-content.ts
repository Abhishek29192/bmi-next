import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add SEO meta content";

export const up: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("documentLibraryPage")
    .createField("seo")
    .name("SEO")
    .type("Link")
    .validations([{ linkContentType: ["seoContent"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("documentLibraryPage").deleteField("seo");
};
