import type { MigrationFunction } from "contentful-migration";

export const description = "Delete category from team member";

export const up: MigrationFunction = (migration) => {
  const teamMember = migration.editContentType("teamMember");

  teamMember.deleteField("category");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
