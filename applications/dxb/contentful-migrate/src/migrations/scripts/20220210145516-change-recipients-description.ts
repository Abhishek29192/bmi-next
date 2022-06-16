import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Edit the recipients field for form";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText:
      'Enter a valid BMI email address. You can provide multiple emails using comma "," as a separator'
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText: "Enter a valid BMI email address."
  });
};
