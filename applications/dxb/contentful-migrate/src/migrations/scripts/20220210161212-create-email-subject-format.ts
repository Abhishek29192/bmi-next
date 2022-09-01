import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add email subject format";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form
    .createField("emailSubjectFormat")
    .name("Email Subject Format")
    .type("Symbol");

  form.changeFieldControl("emailSubjectFormat", "builtin", "singleLine", {
    helpText:
      "Add a reference subject line for the internal recipient (BMI) of the form enquiry."
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.editContentType("form").deleteField("emailSubjectFormat");
