import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create lead block cta on SDP";

const field = "sdpLeadBlockCta";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Lead Block CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  resources.changeFieldControl(field, "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
