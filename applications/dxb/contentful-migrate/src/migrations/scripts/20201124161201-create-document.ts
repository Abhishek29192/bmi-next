import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands } from "../../variables/icons/20201111103444";

export const description = "Create content type for Document";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("document");
