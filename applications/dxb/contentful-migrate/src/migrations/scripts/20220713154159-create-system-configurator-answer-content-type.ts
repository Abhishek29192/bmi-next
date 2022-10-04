import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create System Configurator Answer content type";

export const up: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorAnswer = migration
    .createContentType("systemConfiguratorAnswer")
    .name("System Configurator Answer")
    .displayField("label")
    .description("");

  systemConfiguratorAnswer
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  systemConfiguratorAnswer.changeFieldControl(
    "label",
    "builtin",
    "singleLine",
    {
      helpText: "Representative name for the entry"
    }
  );

  systemConfiguratorAnswer
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  systemConfiguratorAnswer.changeFieldControl(
    "title",
    "builtin",
    "singleLine",
    {
      helpText: "Type the title"
    }
  );

  systemConfiguratorAnswer
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
          "paragraph",
          "embedded-asset-block"
        ],
        message: "Type the description (does not accepts no table or links)"
      }
    ]);

  systemConfiguratorAnswer
    .createField("nextStep")
    .name("Next step (result, no result, question)")
    .type("Link")
    .required(true)
    .validations([
      {
        linkContentType: ["systemConfiguratorResult", "titleWithContent"]
      }
    ])
    .linkType("Entry");

  systemConfiguratorAnswer.changeFieldControl(
    "nextStep",
    "builtin",
    "entryCardEditor",
    {
      helpText:
        "Select either a question, result(s) type or no results (title with content)"
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("systemConfiguratorAnswer");
};
