import type { MigrationFunction } from "contentful-migration";

export const description = "Create System Configurator Section content type";

export const up: MigrationFunction = (migration) => {
  const systemConfiguratorSection = migration
    .createContentType("systemConfiguratorSection")
    .name("System Configurator Section")
    .displayField("label")
    .description("");

  systemConfiguratorSection
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  systemConfiguratorSection.changeFieldControl(
    "label",
    "builtin",
    "singleLine",
    {
      helpText: "Representative name for the entry"
    }
  );

  systemConfiguratorSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  systemConfiguratorSection.changeFieldControl(
    "title",
    "builtin",
    "singleLine",
    {
      helpText: "Type the title"
    }
  );

  systemConfiguratorSection
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

  systemConfiguratorSection
    .createField("question")
    .name("Question")
    .type("Link")
    .required(true)
    .validations([
      {
        linkContentType: [
          "systemConfiguratorQuestion",
          "systemConfiguratorBlock"
        ]
      }
    ])
    .linkType("Entry");

  systemConfiguratorSection.changeFieldControl(
    "question",
    "builtin",
    "entryCardEditor",
    {
      helpText: "Can only select question type entry"
    }
  );
};

export const down: MigrationFunction = (migration) => {
  migration.deleteContentType("systemConfiguratorSection");
};
