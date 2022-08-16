import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Form Section";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration
    .createContentType("form")
    .name("Form Section")
    .displayField("title")
    .description("");

  form.createField("title").name("Title").type("Symbol").localized(true);

  form.createField("showTitle").name("Show title").type("Boolean");

  form
    .createField("description")
    .name("Description")
    .type("RichText")
    .localized(true)
    .validations([{ nodes: {} }]);

  form.createField("action").name("Action").type("Symbol");

  form
    .createField("method")
    .name("Method")
    .type("Symbol")
    .validations([{ in: ["post", "get", "dialog"] }]);

  form.createField("inputs").name("Inputs").type("Object");

  form
    .createField("submitText")
    .name("Submit text")
    .type("Symbol")
    .localized(true);

  form.changeFieldControl("title", "builtin", "singleLine");
  form.changeFieldControl("showTitle", "builtin", "boolean");
  form.changeFieldControl("description", "builtin", "richTextEditor");
  form.changeFieldControl("action", "builtin", "urlEditor");
  form.changeFieldControl("method", "builtin", "dropdown");
  form.changeFieldControl("inputs", "builtin", "3cvPE2OV7Msa8Poo0kQRVi");
  form.changeFieldControl("submitText", "builtin", "singleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("form");
