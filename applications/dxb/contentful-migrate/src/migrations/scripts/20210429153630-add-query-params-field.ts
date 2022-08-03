import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "add query params field to internal links";

export const up: MigrationFunction = async (migration: Migration) => {
  const link = migration.editContentType("link");

  link.createField("queryParams").name("Query Params").type("Symbol");

  link.changeFieldControl("queryParams", "builtin", "singleLine", {
    helpText:
      "Parameter to be appended to the internal link, separate multiple strings by a comma e.g. chip=Pitched+roof,Flat+roof"
  });

  link.moveField("queryParams").afterField("linkedPage");
};

export const down: MigrationFunction = async (migration: Migration) => {
  const link = migration.editContentType("link");

  link.deleteField("queryParams");
};
