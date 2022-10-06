import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Delete System Configurator Block from System Configurator Answer nextStep validations after data is migrated";

export const up: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );

  const systemConfiguratorQuestion = migration.editContentType(
    "systemConfiguratorQuestion"
  );

  const systemConfiguratorSection = migration.editContentType(
    "systemConfiguratorSection"
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

  systemConfiguratorQuestion.editField("answers").items({
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorAnswer"]
      }
    ],
    linkType: "Entry"
  });

  systemConfiguratorSection.editField("question", {
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorQuestion"]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );

  const systemConfiguratorQuestion = migration.editContentType(
    "systemConfiguratorQuestion"
  );

  const systemConfiguratorSection = migration.editContentType(
    "systemConfiguratorSection"
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

  systemConfiguratorQuestion.editField("answers").items({
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorBlock", "systemConfiguratorAnswer"]
      }
    ],
    linkType: "Entry"
  });

  systemConfiguratorSection.editField("question", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "systemConfiguratorQuestion",
          "systemConfiguratorBlock"
        ]
      }
    ],
    linkType: "Entry"
  });
};
