import type { MigrationFunction } from "contentful-migration";

export const description =
  "Edit validations System Configurator Answer and System Configurator Block content type";

export const up: MigrationFunction = (migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );

  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const systemConfiguratorQuestion = migration.editContentType(
    "systemConfiguratorQuestion"
  );

  systemConfiguratorQuestion.editField("answers").items({
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorBlock", "systemConfiguratorAnswer"]
      }
    ],
    linkType: "Entry"
  });

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
  systemConfiguratorBlock.editField("nextStep", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "systemConfiguratorBlock",
          "systemConfiguratorResult",
          "titleWithContent",
          "systemConfiguratorQuestion",
          "systemConfiguratorAnswer"
        ]
      }
    ],
    linkType: "Entry"
  });
  systemConfiguratorBlock.editField("answers").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          "systemConfiguratorResult",
          "titleWithContent",
          "systemConfiguratorQuestion",
          "systemConfiguratorBlock",
          "systemConfiguratorAnswer"
        ]
      }
    ],
    linkType: "Entry"
  });
  systemConfiguratorBlock.editField("question").validations([
    {
      linkContentType: [
        "systemConfiguratorResult",
        "titleWithContent",
        "systemConfiguratorQuestion",
        "systemConfiguratorBlock",
        "systemConfiguratorAnswer"
      ]
    }
  ]);
};

export const down: MigrationFunction = (migration) => {
  const systemConfiguratorAnswer = migration.editContentType(
    "systemConfiguratorAnswer"
  );
  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const systemConfiguratorQuestion = migration.editContentType(
    "systemConfiguratorQuestion"
  );

  systemConfiguratorQuestion.editField("answers").items({
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["systemConfiguratorAnswer"]
        }
      ],
      linkType: "Entry"
    }
  });

  systemConfiguratorAnswer.editField("nextStep", {
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorResult", "titleWithContent"]
      }
    ],
    linkType: "Entry"
  });
  systemConfiguratorBlock.editField("nextStep", {
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorBlock", "titleWithContent"]
      }
    ],
    linkType: "Entry"
  });
  systemConfiguratorBlock.editField("answers").items({
    type: "Link",
    validations: [
      {
        linkContentType: ["systemConfiguratorBlock"]
      }
    ],
    linkType: "Entry"
  });
  systemConfiguratorBlock.editField("question").validations([
    {
      linkContentType: ["systemConfiguratorBlock"]
    }
  ]);
};
