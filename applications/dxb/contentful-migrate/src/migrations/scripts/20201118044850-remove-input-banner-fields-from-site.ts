import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove input banner fields from site";

// NOTE: I can't risk the `site` migration to run before the transform
// entries runs. This means I have to remove the fields from the site in this
// content type folder.
export const up: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.deleteField("signUpTitle");
  site.deleteField("signUpDescription");
  site.deleteField("signUpInputLabel");
  site.deleteField("signUpCallToAction");
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site
    .createField("signUpTitle")
    .name("Sign Up Title")
    .type("Symbol")
    .required(true);

  site
    .createField("signUpDescription")
    .name("Sign Up Description")
    .type("Text")
    .required(true);

  site
    .createField("signUpInputLabel")
    .name("Sign Up Input Label")
    .type("Symbol")
    .required(true);

  site
    .createField("signUpCallToAction")
    .name("Sign Up Call To Action")
    .type("Symbol")
    .required(true);

  site.changeFieldControl("signUpTitle", "builtin", "singleLine");
  site.changeFieldControl("signUpDescription", "builtin", "markdown");
  site.changeFieldControl("signUpInputLabel", "builtin", "singleLine");
  site.changeFieldControl("signUpCallToAction", "builtin", "singleLine");
};
