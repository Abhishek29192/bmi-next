import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Delete System Configurator Block from System Configurator Answer nextStep validations after data is migrated";

export const up: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );

  systemConfiguratorAnswer.editField("nextStep", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "systemConfiguratorResult",
          "titleWithContent",
          "systemConfiguratorQuestion"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );

  systemConfiguratorAnswer.editField("nextStep", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "systemConfiguratorResult",
          "titleWithContent",
          "systemConfiguratorQuestion",
          "systemConfiguratorBlock"
        ]
      }
    ],
    linkType: "Entry"
  });
};
