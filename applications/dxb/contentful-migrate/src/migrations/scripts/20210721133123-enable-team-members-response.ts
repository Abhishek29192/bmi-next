import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Enable team members in response";

export const up: MigrationFunction = (migration: Migration) => {
  const teamCategory = migration.editContentType("teamCategory");

  teamCategory.editField("teamMembers").disabled(false).omitted(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  const teamCategory = migration.editContentType("teamCategory");

  teamCategory.editField("teamMembers").disabled(false).omitted(true);
};
