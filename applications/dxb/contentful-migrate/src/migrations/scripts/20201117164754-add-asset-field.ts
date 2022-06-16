import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add asset field";

export const up: MigrationFunction = (migration: Migration) => {
  const link = migration
    .editContentType("link")
    .description("This links to a Page, Asset, or URL");
  link.createField("asset").name("Asset").type("Link").linkType("Asset");
  link.moveField("isLabelHidden").afterField("label");
  link.moveField("icon").afterField("type");
};

export const down: MigrationFunction = (migration: Migration) => {
  const link = migration
    .editContentType("link")
    .description("This links to a Page or URL");
  link.deleteField("asset");
  link.moveField("icon").afterField("linkedPage");
  link.moveField("isLabelHidden").afterField("icon");
};
