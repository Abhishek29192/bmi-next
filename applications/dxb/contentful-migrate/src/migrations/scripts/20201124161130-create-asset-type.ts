import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content type for Asset Type";

export const up: MigrationFunction = (migration: Migration) => {
  const assetType = migration
    .createContentType("assetType")
    .name("Asset Type")
    .displayField("name");

  assetType.createField("name").name("Name").type("Symbol").required(true);

  assetType.createField("code").name("Code").type("Symbol").required(true);

  assetType.createField("description").name("Description").type("RichText");

  assetType.createField("pimCode").name("PIM Code").type("Symbol");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("assetType");
