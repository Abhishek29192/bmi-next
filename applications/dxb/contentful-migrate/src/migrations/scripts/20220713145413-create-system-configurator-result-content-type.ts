import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create System Configurator Result content type";

export const up: MigrationFunction = (migration: Migration) => {
  const systemConfiguratorResult = migration
    .createContentType("systemConfiguratorResult")
    .name("System Configurator Result")
    .displayField("label")
    .description("");

  systemConfiguratorResult
    .createField("label")
    .name("Label")
    .type("Symbol")
    .required(true);

  systemConfiguratorResult.changeFieldControl(
    "label",
    "builtin",
    "singleLine",
    {
      helpText: "Representative name for the entry"
    }
  );

  systemConfiguratorResult
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  systemConfiguratorResult.changeFieldControl(
    "title",
    "builtin",
    "singleLine",
    {
      helpText: "Type the title"
    }
  );

  systemConfiguratorResult
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

  systemConfiguratorResult
    .createField("recommendedSystems")
    .name("Recommended System(s)")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 1 } }])
    .items({
      type: "Symbol",
      validations: []
    });

  systemConfiguratorResult.changeFieldControl(
    "recommendedSystems",
    "builtin",
    "tagEditor",
    {
      helpText: "Type the recommended PIM system code(s) and hit enter"
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("systemConfiguratorResult");
};
