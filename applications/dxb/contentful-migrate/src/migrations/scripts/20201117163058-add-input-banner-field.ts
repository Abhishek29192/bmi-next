import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add input banner to resources content type and remove the showSignUpBlock";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("pdpInputBanner")
    .name("PDP: Input Banner")
    .type("Link")
    .validations([{ linkContentType: ["inputBanner"] }])
    .linkType("Entry");

  resources.changeFieldControl("pdpInputBanner", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("pdpInputBanner");
};
