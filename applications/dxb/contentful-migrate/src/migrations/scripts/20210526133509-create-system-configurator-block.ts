import { getAppByNameFromSpace } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Create System Configurator Block";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const systemConfiguratorBlock = migration
    .createContentType("systemConfiguratorBlock")
    .name("System Configurator Block")
    .displayField("label")
    .description("");

  // Shared fields
  systemConfiguratorBlock
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  systemConfiguratorBlock.changeFieldControl("label", "builtin", "singleLine", {
    helpText: "Representative name for the entry"
  });

  systemConfiguratorBlock
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  systemConfiguratorBlock.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "Type the title"
  });

  systemConfiguratorBlock
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
          "blockquote"
        ],
        message: "Type the description (does not accepts no table or links)"
      }
    ]);

  systemConfiguratorBlock
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Question", "Answer", "Result", "Section"] }]);

  systemConfiguratorBlock.changeFieldControl("type", "builtin", "dropdown", {
    helpText: "Select a type"
  });

  // Section field(s)
  systemConfiguratorBlock
    .createField("question")
    .name("Question")
    .type("Link")
    .validations([{ linkContentType: ["systemConfiguratorBlock"] }])
    .linkType("Entry");

  systemConfiguratorBlock.changeFieldControl(
    "question",
    "builtin",
    "entryCardEditor",
    {
      helpText: "Can only select question type entry"
    }
  );

  // Question field(s)
  systemConfiguratorBlock
    .createField("answers")
    .name("Answer(s)")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["systemConfiguratorBlock"]
        }
      ],
      linkType: "Entry"
    });

  systemConfiguratorBlock.changeFieldControl(
    "answers",
    "builtin",
    "entryCardsEditor",
    {
      helpText: "Can only select answer type entries"
    }
  );

  // Answer field(s)
  systemConfiguratorBlock
    .createField("nextStep")
    .name("Next step (result, no result, question)")
    .type("Link")
    .validations([
      { linkContentType: ["systemConfiguratorBlock", "titleWithContent"] }
    ])
    .linkType("Entry");

  systemConfiguratorBlock.changeFieldControl(
    "nextStep",
    "builtin",
    "entryCardEditor",
    {
      helpText:
        "Select either a question, result(s) type or no results (title with content)"
    }
  );

  // Result field(s)
  systemConfiguratorBlock
    .createField("recommendedSystems")
    .name("Recommended System(s)")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });

  systemConfiguratorBlock.changeFieldControl(
    "recommendedSystems",
    "builtin",
    "tagEditor",
    {
      helpText: "Type the recommended PIM system code(s) and hit enter"
    }
  );

  const conditionalFieldsApp = await getAppByNameFromSpace(
    "Conditional fields",
    context!
  );

  if (conditionalFieldsApp) {
    const { sys } = conditionalFieldsApp;
    systemConfiguratorBlock.configureEntryEditor("app", sys.id);
  }
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("systemConfiguratorBlock");
};
