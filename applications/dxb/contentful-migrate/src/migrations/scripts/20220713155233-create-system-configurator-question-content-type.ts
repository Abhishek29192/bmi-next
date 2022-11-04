import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create System Configurator Question content type";

export const up: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorQuestion = migration
    .createContentType("systemConfiguratorQuestion")
    .name("System Configurator Question")
    .displayField("label")
    .description("");

  systemConfiguratorQuestion
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  systemConfiguratorQuestion.changeFieldControl(
    "label",
    "builtin",
    "singleLine",
    {
      helpText: "Representative name for the entry"
    }
  );

  systemConfiguratorQuestion
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  systemConfiguratorQuestion.changeFieldControl(
    "title",
    "builtin",
    "singleLine",
    {
      helpText: "Type the title"
    }
  );

  systemConfiguratorQuestion
    .createField("description")
    .name("Description")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes: [
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "embedded-asset-block"
        ],
        message: "Type the description (does not accepts no table or links)"
      }
    ]);

  systemConfiguratorQuestion
    .createField("answers")
    .name("Answer(s)")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 1 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["systemConfiguratorAnswer"]
        }
      ],
      linkType: "Entry"
    });

  systemConfiguratorQuestion.changeFieldControl(
    "answers",
    "builtin",
    "entryCardsEditor",
    {
      helpText: "Can only select answer type entries"
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("systemConfiguratorQuestion");
};
