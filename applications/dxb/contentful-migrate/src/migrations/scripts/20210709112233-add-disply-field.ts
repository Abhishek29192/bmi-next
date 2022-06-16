import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add display type field to support Merhants and Branchs";

export const up: MigrationFunction = (migration: Migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Roofer", "Branch", "Merchant"] }]);

  serviceLocatorSection.moveField("type").beforeField("title");

  migration.transformEntries({
    contentType: "serviceLocatorSection",
    from: [],
    to: ["type"],
    transformEntryForLocale: () => {
      // All entries before this migration are of type "Roofer"
      return { type: "Roofer" };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection.deleteField("type");
};
