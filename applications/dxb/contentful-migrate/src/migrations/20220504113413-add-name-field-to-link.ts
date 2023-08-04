import { internalName } from "../variables/helpText/20210421160910.js";
import { hyphenSymbol } from "../variables/hyphenSymbol/20220504110700.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add name field for link";
const titleNotFound = "Untitled";

export const up: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");
  link.createField("name").name("Name").type("Symbol").required(true);
  link.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  link.displayField("name");
  link.moveField("name").beforeField("label");

  migration.transformEntries({
    contentType: "link",
    from: ["label"],
    to: ["name"],
    transformEntryForLocale: async ({ label }, currentLocale) => {
      if (!label || !label[currentLocale]) {
        return {
          name: titleNotFound,
          label: titleNotFound
        };
      }
      return {
        name: label[currentLocale].replace(hyphenSymbol, ""),
        label: label[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");
  link.displayField("label");
  link.deleteField("name");
};
