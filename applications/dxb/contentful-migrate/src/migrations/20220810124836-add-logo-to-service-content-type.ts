import type { MigrationFunction } from "contentful-migration";

export const description = "add company logo to Service content type";

export const up: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("companyLogo")
    .name("Company logo")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["image"] }]);

  roofer.moveField("companyLogo").afterField("fax");
};

export const down: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("companyLogo");
};
