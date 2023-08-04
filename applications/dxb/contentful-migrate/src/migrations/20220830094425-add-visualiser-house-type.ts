import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Visualiser House Type";

export const up: MigrationFunction = (migration) => {
  const visualiserHouseType = migration
    .createContentType("visualiserHouseType")
    .name("Visualiser House Type")
    .displayField("name");

  visualiserHouseType
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  visualiserHouseType
    .createField("previewImage")
    .name("Preview image")
    .type("Link")
    .required(true)
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  visualiserHouseType
    .createField("houseModel")
    .name("3D Model (.glb)")
    .type("Link")
    .required(true)
    .validations([{ linkMimetypeGroup: ["attachment"] }])
    .linkType("Asset");
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("visualiserHouseType");
