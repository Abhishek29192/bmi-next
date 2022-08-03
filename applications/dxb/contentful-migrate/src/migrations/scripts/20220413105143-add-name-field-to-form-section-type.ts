import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description = "Add name field for form section";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.createField("name").name("Name").type("Symbol").required(true);
  form.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  form.displayField("name");
  form.moveField("name").beforeField("title");

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
  const form = migration.editContentType("form");
  form.deleteField("name");
  form.displayField("title");
};
