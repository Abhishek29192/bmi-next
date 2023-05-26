import type { MigrationFunction } from "contentful-migration";

export const description = "Add help text to code";

export const up: MigrationFunction = (migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([{ size: { max: 4 } }]);

  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: "This is the abbreviation for the name."
  });
};

export const down: MigrationFunction = (migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([]);
  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: ""
  });
};
