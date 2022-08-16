import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description = "Add name field for product lister page";

export const up: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  productListerPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  productListerPage.displayField("name");
  productListerPage.moveField("name").beforeField("title");

  migration.transformEntries({
    contentType: "page",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]).replace(/\|/gi, "")
    }),
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("name");
  productListerPage.displayField("title");
};
