import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update title help text";

export const up: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("name").name("Label");
  promo.changeFieldControl("title", "builtin", "singleLine", {
    helpText:
      "This text will be displayed with an underline on the Hero. If you do not add a Title the label will be used as the card title of the promo."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("name").name("Name");
  promo.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This text will be displayed with an underline on the Hero"
  });
};
