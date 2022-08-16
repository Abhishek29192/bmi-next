import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add website as label field";

export const up: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("websiteLinkAsLabel")
    .name("Display website link as label")
    .type("Boolean");

  roofer.changeFieldControl("websiteLinkAsLabel", "builtin", "boolean", {
    helpText:
      "Use a micro copy instead of an URL when displaying the website link."
  });

  roofer.moveField("websiteLinkAsLabel").afterField("website");
};

export const down: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("websiteLinkAsLabel");
};
