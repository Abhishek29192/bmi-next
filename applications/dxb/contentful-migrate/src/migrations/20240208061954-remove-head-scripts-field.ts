import type { MigrationFunction } from "contentful-migration";

export const description = "Remove script from the site";

export const up: MigrationFunction = async (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("headScripts");
};

export const down: MigrationFunction = async (migration) => {
  const site = migration.editContentType("site");

  site.createField("headScripts").name("Head scripts tags").type("Text");

  site.changeFieldControl("headScripts", "builtin", "multipleLine", {
    helpText: "This field is to inject custom <script> content into <head>"
  });
};
