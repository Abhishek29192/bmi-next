"use strict";

module.exports.description = "Create content type for Asset Type";

module.exports.up = (migration) => {
  const assetType = migration
    .createContentType("assetType")
    .name("Asset Type")
    .displayField("name");

  assetType.createField("name").name("Name").type("Symbol").required(true);

  assetType.createField("code").name("Code").type("Symbol").required(true);

  assetType.createField("description").name("Description").type("RichText");

  assetType.createField("pimCode").name("PIM Code").type("Symbol");
};

module.exports.down = (migration) => migration.deleteContentType("assetType");
