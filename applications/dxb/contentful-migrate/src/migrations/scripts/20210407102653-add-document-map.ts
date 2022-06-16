import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add a document name map field";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("productDocumentNameMap")
    .name("Product documents name map")
    .type("Symbol")
    .validations([{ in: ["Document name", "Product name + asset type"] }]);

  resources.changeFieldControl(
    "productDocumentNameMap",
    "builtin",
    "dropdown",
    {
      helpText:
        'Define how PIM documents\' names will be displayed. Defaults to "Document name".'
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("productDocumentNameMap");
};
