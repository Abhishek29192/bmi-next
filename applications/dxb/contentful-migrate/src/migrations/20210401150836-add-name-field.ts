import {
  internalName,
  optionalTitle
} from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add required name field";

export const up: MigrationFunction = (migration) => {
  const documentDownloadSection = migration.editContentType(
    "documentDownloadSection"
  );

  documentDownloadSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  documentDownloadSection.displayField("name");
  documentDownloadSection.moveField("name").beforeField("title");
  documentDownloadSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  documentDownloadSection.editField("title").required(false);
  documentDownloadSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "documentDownloadSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration) => {
  const documentDownloadSection = migration.editContentType(
    "documentDownloadSection"
  );

  documentDownloadSection.displayField("title");
  documentDownloadSection.editField("title").required(true);
  documentDownloadSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  documentDownloadSection.deleteField("name");
};
