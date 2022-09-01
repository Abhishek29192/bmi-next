import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add help text to code";

export const up: MigrationFunction = (migration: Migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([{ size: { max: 4 } }]);

  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: "This is the abbreviation for the name."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([]);
  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: ""
  });
};
