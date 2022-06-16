import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create SDP Bim Description";

const field = "sdpBimDescription";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: BIM Description Content")
    .type("RichText");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
