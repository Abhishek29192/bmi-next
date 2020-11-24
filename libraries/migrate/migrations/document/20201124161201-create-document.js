"use strict";

const { brands } = require("../../variables/icons/20201111103444");

module.exports.description = "Create content type for Document";

module.exports.up = (migration) => {
  const document = migration
    .createContentType("document")
    .name("Document")
    .displayField("title");

  document.createField("title").name("Title").type("Symbol").required(true);

  document
    .createField("asset")
    .name("Asset")
    .type("Link")
    .linkType("Asset")
    .required(true);

  document.createField("description").name("Description").type("RichText");

  document
    .createField("assetType")
    .name("Asset Type")
    .type("Link")
    .validations([{ linkContentType: ["assetType"] }])
    .linkType("Entry")
    .required(true);

  document
    .createField("brand")
    .name("Brand")
    .type("Symbol")
    .validations([{ in: brands }]);

  document
    .createField("image")
    .name("Image")
    .type("Link")
    .linkType("Asset")
    .validations([{ linkMimetypeGroup: ["image"] }]);

  document.changeFieldControl("brand", "builtin", "dropdown");
};

module.exports.down = (migration) => migration.deleteContentType("document");
