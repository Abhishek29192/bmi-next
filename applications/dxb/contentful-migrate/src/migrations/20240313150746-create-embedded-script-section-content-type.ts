import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create Embedded Script Section content type";

export const up: MigrationFunction = (migration) => {
  const embeddedScriptSection = migration
    .createContentType("embeddedScriptSection")
    .name("Embedded Script Page")
    .displayField("name");

  embeddedScriptSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .localized(true)
    .required(true);
  embeddedScriptSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  embeddedScriptSection
    .createField("id")
    .name("ID")
    .type("Symbol")
    .localized(true)
    .required(true);
  embeddedScriptSection.changeFieldControl("id", "builtin", "singleLine", {
    helpText: "The ID to be given to the div that will be included in the page"
  });

  embeddedScriptSection
    .createField("url")
    .name("URL")
    .type("Symbol")
    .localized(true)
    .required(true);
  embeddedScriptSection.changeFieldControl("url", "builtin", "singleLine", {
    helpText: "The URL of where the JavaScript file is hosted"
  });
};

export const down: MigrationFunction = (migration) => {
  migration.deleteContentType("embeddedScriptSection");
};
