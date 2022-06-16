import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add share widget link on SDP";

const field = "sdpShareWidget";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
