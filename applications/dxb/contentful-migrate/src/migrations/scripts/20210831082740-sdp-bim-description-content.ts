import type { MigrationFunction } from "contentful-migration";

export const description = "Create SDP Bim Description";

const field = "sdpBimDescription";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: BIM Description Content")
    .type("RichText");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
