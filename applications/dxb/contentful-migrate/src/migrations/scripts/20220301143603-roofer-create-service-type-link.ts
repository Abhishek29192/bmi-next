import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Roofer Service Type field";

export const up: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("serviceTypes")
    .name("Services provided by this service provider")
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["serviceType"] }],
      linkType: "Entry"
    });

  roofer.changeFieldControl("serviceTypes", "builtin", "entryLinksEditor", {
    helpText: "Services offered by this Entry type at the top of this page"
  });

  roofer.moveField("serviceTypes").afterField("merchantType");
};

export const down: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("serviceTypes");
};
