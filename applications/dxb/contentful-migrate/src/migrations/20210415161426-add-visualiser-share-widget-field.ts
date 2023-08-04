import type { MigrationFunction } from "contentful-migration";

export const description = "Add visualiser share widget section link";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("visualiserShareWidget")
    .name("Visualiser: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("visualiserShareWidget");
};
