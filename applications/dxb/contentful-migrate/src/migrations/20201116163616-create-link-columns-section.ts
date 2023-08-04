import type { MigrationFunction } from "contentful-migration";

export const description = "Create content type for Link Columns Section";

export const up: MigrationFunction = (migration) => {
  const linksColumnsSection = migration
    .createContentType("linkColumnsSection")
    .name("Link Columns Section")
    .displayField("title")
    .description("");

  linksColumnsSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  linksColumnsSection
    .createField("columns")
    .name("Columns")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["navigation"] }],
      linkType: "Entry"
    });
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("linkColumnsSection");
