import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import {
  internalName,
  optionalTitle
} from "../../variables/helpText/20210421160910";

export const description = "Add required name field";

export const up: MigrationFunction = (migration: Migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  titleWithContent.displayField("name");
  titleWithContent.moveField("name").beforeField("title");
  titleWithContent.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  titleWithContent.editField("title").required(false);
  titleWithContent.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "titleWithContent",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent.displayField("title");
  titleWithContent.editField("title").required(true);
  titleWithContent.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  titleWithContent.deleteField("name");
};
