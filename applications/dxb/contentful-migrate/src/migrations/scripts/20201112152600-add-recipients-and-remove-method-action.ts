import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add recipients field and remove method and action";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.deleteField("action");
  form.deleteField("method");
  form
    .createField("successRedirect")
    .name("Success redirect")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");
  form
    .createField("recipients")
    .name("Recipients")
    .type("Symbol")
    .required(true);
  form.moveField("recipients").afterField("description");
};

export const down: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.createField("action").name("Action").type("Symbol");
  form
    .createField("method")
    .name("Method")
    .type("Symbol")
    .validations([{ in: ["post", "get", "dialog"] }]);
  form.deleteField("successRedirect");
  form.deleteField("recipients");
};
