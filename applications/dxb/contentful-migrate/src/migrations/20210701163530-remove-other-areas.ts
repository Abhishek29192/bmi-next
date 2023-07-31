import type { MigrationFunction } from "contentful-migration";

export const description = "Remove Other areas";

export const up: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("otherAreasTitle");
  contactUsPage.deleteField("otherAreas");
};

export const down: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("otherAreasTitle")
    .name("Other areas title")
    .type("Symbol");
  contactUsPage
    .createField("otherAreas")
    .name("Other areas")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });
};
