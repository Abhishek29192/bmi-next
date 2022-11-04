import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add news item class field to Market Content";

export const up: MigrationFunction = (migration: Migration) => {
  const marketContent = migration.editContentType("marketContent");

  marketContent
    .createField("newsItemClass")
    .name("News Item Class")
    .type("Symbol")
    .required(true);

  marketContent.moveField("newsItemClass").afterField("newsItemCta");

  marketContent.changeFieldControl("newsItemClass", "builtin", "singleLine", {
    helpText: "optanon-category-C0001 or optanon-category-C0007-0006-0005"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const marketContent = migration.editContentType("marketContent");

  marketContent.deleteField("newsItemClass");
};
