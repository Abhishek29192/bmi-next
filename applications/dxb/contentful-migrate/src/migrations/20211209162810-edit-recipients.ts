import type { MigrationFunction } from "contentful-migration";

export const description = "Edit the recipients field for form";

export const up: MigrationFunction = (migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText: "Enter a valid BMI email address."
  });
};

export const down: MigrationFunction = (migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText: ""
  });
};
