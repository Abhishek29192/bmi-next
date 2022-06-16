import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add key asset types field";

const field = "keyAssetTypes";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("Key Asset Types")
    .type("Array")
    .required(false)
    .validations([{ size: { max: 3 } }])
    .items({
      type: "Symbol"
    });

  resources.changeFieldControl(field, "builtin", "tagEditor", {
    helpText: "This is the pim code of the asset type"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
