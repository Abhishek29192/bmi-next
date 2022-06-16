import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Two Column Section";

export const up: MigrationFunction = (migration: Migration) => {
  const twoColumnSection = migration
    .createContentType("twoColumnSection")
    .name("Two Column Section")
    .description("");

  twoColumnSection
    .createField("leftColumn")
    .name("Left Column")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");

  twoColumnSection
    .createField("rightColumn")
    .name("Right Column")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["imageWrapper", "titleWithContent"] }])
    .linkType("Entry");

  twoColumnSection.changeFieldControl(
    "leftColumn",
    "builtin",
    "entryLinkEditor"
  );
  twoColumnSection.changeFieldControl(
    "rightColumn",
    "builtin",
    "entryLinkEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("twoColumnSection");
