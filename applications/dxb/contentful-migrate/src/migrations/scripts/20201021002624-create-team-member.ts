import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Team Member";

export const up: MigrationFunction = (migration: Migration) => {
  const teamMember = migration
    .createContentType("teamMember")
    .name("Team Member")
    .displayField("name")
    .description("");

  teamMember.createField("name").name("Name").type("Symbol").required(true);

  teamMember
    .createField("profilePicture")
    .name("Profile Picture")
    .type("Link")
    .required(true)
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  teamMember.createField("jobTitle").name("Job Title").type("Symbol");

  teamMember
    .createField("links")
    .name("Links")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["link"] }],
      linkType: "Entry"
    });

  teamMember
    .createField("category")
    .name("Category")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["teamCategory"] }])
    .linkType("Entry");

  teamMember.changeFieldControl("name", "builtin", "singleLine");
  teamMember.changeFieldControl("profilePicture", "builtin", "assetLinkEditor");
  teamMember.changeFieldControl("jobTitle", "builtin", "singleLine");
  teamMember.changeFieldControl("links", "builtin", "entryLinksEditor");
  teamMember.changeFieldControl("category", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("teamMember");
