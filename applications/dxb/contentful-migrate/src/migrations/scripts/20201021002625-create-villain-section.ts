import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Villain Section";

export const up: MigrationFunction = (migration: Migration) => {
  const villainSection = migration
    .createContentType("villainSection")
    .name("Villain Section")
    .displayField("title")
    .description("");

  villainSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  villainSection
    .createField("promo")
    .name("Promo")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["contactUsPage", "promo", "page"] }])
    .linkType("Entry");

  villainSection
    .createField("isReversed")
    .name("Reverse Villain")
    .type("Boolean");

  villainSection.changeFieldControl("title", "builtin", "singleLine");
  villainSection.changeFieldControl("promo", "builtin", "entryLinkEditor");
  villainSection.changeFieldControl("isReversed", "builtin", "boolean");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("villainSection");
