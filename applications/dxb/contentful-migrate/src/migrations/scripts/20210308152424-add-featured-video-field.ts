import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Create featuredVideo field to accept video content type link.";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  page.changeFieldControl("featuredVideo", "builtin", "entryLinkEditor", {
    helpText: "This field will override 'featuredImage' field when populated."
  });

  page.moveField("featuredVideo").afterField("featuredImage");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.deleteField("featuredVideo");
};
