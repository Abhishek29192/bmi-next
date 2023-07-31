import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add name field for carousel section";

export const up: MigrationFunction = (migration) => {
  const carouselSection = migration.editContentType("carouselSection");
  carouselSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  carouselSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  carouselSection.displayField("name");
  carouselSection.moveField("name").beforeField("title");

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

export const down: MigrationFunction = (migration) => {
  const carouselSection = migration.editContentType("carouselSection");
  carouselSection.deleteField("name");
  carouselSection.displayField("title");
};
