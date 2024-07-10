import type { MigrationFunction } from "contentful-migration";

export const description = "create content model for account link";

export const up: MigrationFunction = async (migration) => {
  const accountLink = migration
    .createContentType("accountLink")
    .name("Account Link");

  accountLink
    .createField("name")
    .name("Name")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountLink
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountLink
    .createField("type")
    .name("Type")
    .type("Symbol")
    .localized(true)
    .required(true)
    .validations([
      {
        in: [
          "Calculator",
          "Company Profile",
          "Guarantees",
          "Team",
          "Visualiser"
        ]
      }
    ]);

  accountLink
    .createField("link")
    .name("Link")
    .type("Link")
    .localized(true)
    .required(true)
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  accountLink.changeFieldControl("link", "builtin", "entryLinkEditor", {
    helpText:
      "Only internal, external and HubSpot CTA link content types are supported."
  });
};

export const down: MigrationFunction = async (migration) => {
  migration.deleteContentType("accountLink");
};
