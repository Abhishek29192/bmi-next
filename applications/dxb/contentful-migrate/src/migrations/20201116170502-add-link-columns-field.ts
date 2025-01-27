import type { MigrationFunction } from "contentful-migration";

export const description = "Add link columns field to page content type";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("linkColumns")
    .name("Link Columns")
    .type("Link")
    .validations([{ linkContentType: ["linkColumnsSection"] }])
    .linkType("Entry");

  page.moveField("linkColumns").beforeField("nextBestActions");
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("linkColumns");
};
