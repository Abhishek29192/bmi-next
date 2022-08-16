import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Metal Flush Option";

export const up: MigrationFunction = (migration: Migration) => {
  const metalFlushOption = migration
    .createContentType("metalFlushOption")
    .name("Metal Flush Option")
    .displayField("name")
    .description("");

  metalFlushOption
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  metalFlushOption
    .createField("left")
    .name("Left")
    .type("Link")
    .validations([{ linkContentType: ["vergeMetalFlush"] }])
    .linkType("Entry");

  metalFlushOption
    .createField("right")
    .name("Right")
    .type("Link")
    .validations([{ linkContentType: ["vergeMetalFlush"] }])
    .linkType("Entry");

  metalFlushOption
    .createField("leftStart")
    .name("Left Start")
    .type("Link")
    .validations([{ linkContentType: ["vergeMetalFlush"] }])
    .linkType("Entry");

  metalFlushOption
    .createField("rightStart")
    .name("Right Start")
    .type("Link")
    .validations([{ linkContentType: ["vergeMetalFlush"] }])
    .linkType("Entry");

  metalFlushOption.changeFieldControl("name", "builtin", "singleLine");
  metalFlushOption.changeFieldControl("left", "builtin", "entryLinkEditor");
  metalFlushOption.changeFieldControl("right", "builtin", "entryLinkEditor");
  metalFlushOption.changeFieldControl(
    "leftStart",
    "builtin",
    "entryLinkEditor"
  );
  metalFlushOption.changeFieldControl(
    "rightStart",
    "builtin",
    "entryLinkEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("metalFlushOption");
